import {
    View,
    Text,
    Alert,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import HeaderBase from '../HeaderBase/HeaderBase';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import MyStyles from '../../styles/MyStyles';
import Input from '../Input';
import APIS, { endpoint } from '../../configs/APIS';
import { MyUserContext } from '../../configs/Context';
import ModalSelectItem from '../ModalSelectItem/ModalSelectItem';

const CreateService = () => {
    const user = useContext(MyUserContext);
    const [service, setService] = useState({});

    const [serviceTypes, setServiceTypes] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);

    const [discounts, setDiscounts] = useState(null);
    const [discountModalVisible, setDiscountModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadServiceTypes = async () => {
        try {
            let res = await APIS.get(endpoint['serviceTypes']);
            setServiceTypes(res.data);
        } catch (ex) {
            console.error(ex);
        }
    };

    const loadDiscounts = async () => {
        try {
            let res = await APIS.get(endpoint['discounts']);
            setDiscounts(res.data);
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        loadDiscounts();
        loadServiceTypes();
    }, []);

    const updateState = (field, value) => {
        setService((current) => {
            return { ...current, [field]: value };
        });
    };

    const inputFields = [
        { placeholder: 'Tên dịch vụ...', field: 'name', multiline: false },
        { placeholder: 'Địa chỉ...', field: 'address', multiline: false },
        { placeholder: 'Giá...', field: 'price', multiline: false },
        { placeholder: 'Mô tả tổng quan...', field: 'description', multiline: true, numberOfLines: 4 },
        { placeholder: 'Yêu cầu...', field: 'require', multiline: true, numberOfLines: 4 },
    ];

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Travel_App', 'Permissions Denied!');
        } else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                updateState('image', res.assets[0]);
            }
        }
    };

    const handleServiceTypeSelect = (type) => {
        setSelectedServiceType(type);
        updateState('service_type', type.id);
        setModalVisible(false);
    };

    const handleDiscountSelect = (discount) => {
        setSelectedDiscount(discount);
        updateState('discount', discount.id);
        setDiscountModalVisible(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Chuyển đổi giá thành số thực
            if (service.price) {
                const priceFloat = parseFloat(service.price);
                if (!isNaN(priceFloat)) {
                    formData.append('price', priceFloat);
                } else {
                    Alert.alert('Lỗi', 'Giá không hợp lệ');
                    return;
                }
            }

            // Thêm tất cả các trường từ service state vào formData
            // for (const key in service) {
            //     if (key === 'image') {
            //         formData.append(key, {
            //             uri: service[key].uri,
            //             type: service[key].type,
            //             name: service[key].name,
            //         });
            //     } else {
            //         formData.append(key, service[key]);
            //     }
            // }

            for (const key in service) {
                if (key !== 'image' && key !== 'price') {
                    formData.append(key, service[key]);
                }
            }

            // Thêm trường service_provider với giá trị là user.id
            formData.append('service_provider', user.id);
            formData.append('image', null);

            console.log(formData);

            // Gửi yêu cầu POST
            let res = await APIS.post(endpoint['services01'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                Alert.alert('Thành công', 'Thêm dịch vụ mới thành công');
                // Reset lại form hoặc chuyển hướng đến màn hình khác
                setService({});
                setSelectedServiceType(null);
                setSelectedDiscount(null);
            } else {
                Alert.alert('Lỗi', 'Thêm dịch vụ mới thất bại');
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Tạo dịch vụ</HeaderBase>

            <KeyboardAvoidingView
                style={MyStyles.containerBase}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView>
                    {inputFields.map((input, index) => (
                        <Input
                            key={index}
                            placeholder={input.placeholder}
                            value={service[input.field]}
                            onChangeText={(t) => updateState(input.field, t)}
                            multiline={input.multiline}
                            numberOfLines={input.numberOfLines || 1}
                        />
                    ))}

                    <TouchableOpacity style={styles.serviceTypeInput} onPress={() => setModalVisible(true)}>
                        <Text style={styles.serviceTypeText}>
                            {selectedServiceType ? selectedServiceType.name : 'Chọn loại dịch vụ...'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.serviceTypeInput} onPress={() => setDiscountModalVisible(true)}>
                        <Text style={styles.serviceTypeText}>
                            {selectedDiscount ? selectedDiscount.name : 'Chọn giảm giá...'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableRipple style={styles.imagePicker} onPress={picker}>
                        <Text style={styles.imagePickerText}>Chọn ảnh</Text>
                    </TouchableRipple>

                    {service.image && <Image source={{ uri: service.image.uri }} style={styles.image} />}
                </ScrollView>
            </KeyboardAvoidingView>

            <ButtonFooter onPress={handleSubmit}>Xác nhận</ButtonFooter>

            <ModalSelectItem
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                items={serviceTypes}
                onSelect={handleServiceTypeSelect}
            />

            <ModalSelectItem
                visible={discountModalVisible}
                onClose={() => setDiscountModalVisible(false)}
                items={discounts}
                onSelect={handleDiscountSelect}
            />
        </View>
    );
};

export default CreateService;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imagePicker: {
        padding: 10,
        marginTop: 20,
        marginBottom: 12,
        backgroundColor: '#717273',
        borderRadius: 8,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
    },
    image: {
        width: 200,
        height: 160,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },
    serviceTypeInput: {
        padding: 10,
        marginTop: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    serviceTypeText: {
        color: '#4E4B66',
    },
});
