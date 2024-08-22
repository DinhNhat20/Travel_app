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
import Button from '../Button';

const UpdateService = ({ route }) => {
    const user = useContext(MyUserContext);
    const { service } = route.params;

    const [updateService, setUpdateService] = useState({});
    const [serviceTypes, setServiceTypes] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [discounts, setDiscounts] = useState(null);
    const [discountModalVisible, setDiscountModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serviceImages, setServiceImages] = useState([]); // Initialize with service images
    const [addedImages, setAddedImages] = useState([]); // Initialize with added images

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

    const loadImages = async () => {
        try {
            let res = await APIS.get(endpoint['images'](service.id));
            setServiceImages(res.data);
        } catch (ex) {
            console.error(ex);
        }
    };

    useEffect(() => {
        loadDiscounts();
        loadServiceTypes();
        loadImages();
    }, []);

    useEffect(() => {
        if (serviceTypes && service.service_type) {
            const matchingServiceType = serviceTypes.find((type) => type.id === service.service_type);
            setSelectedServiceType(matchingServiceType || null);
        }

        if (discounts && service.discount && service.discount.id) {
            const matchingDiscount = discounts.find((discount) => discount.id === service.discount.id);
            setSelectedDiscount(matchingDiscount || null);
        }
    }, [serviceTypes, discounts, service.service_type, service.discount]);

    const updateState = (field, value) => {
        setUpdateService((current) => {
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

    // Hàm picker
    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Travel_App', 'Quyền truy cập bị từ chối!');
            return;
        }

        let res = await ImagePicker.launchImageLibraryAsync();
        if (!res.canceled && res.assets && res.assets.length > 0) {
            const selectedImageUri = res.assets[0].uri;
            if (serviceImages.length + addedImages.length < 5) {
                setAddedImages((prev) => [...prev, selectedImageUri]);
            } else {
                Alert.alert('Thông báo', 'Bạn chỉ có thể thêm tối đa 5 ảnh.');
            }
        }
    };

    // Hiển thị ảnh
    const renderImages = (images) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageContainer}>
            {images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                    <Image source={{ uri: image.path }} style={styles.image} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderAddImages = (images) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageContainer}>
            {images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
                    <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const handleImagePress = (index) => {
        Alert.alert(
            'Thay đổi ảnh',
            'Bạn có muốn xóa ảnh này?',
            [
                {
                    text: 'OK',
                    onPress: () => picker(),
                },
                {
                    text: 'Hủy',
                },
            ],
            { cancelable: true },
        );
    };

    const handleRemoveImage = (index) => {
        setAddedImages((prev) => prev.filter((_, i) => i !== index));
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

    const handleSubmit = () => {
        // Submit handling logic (e.g., API call to update the service)
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Cập nhật dịch vụ</HeaderBase>

            <KeyboardAvoidingView
                style={MyStyles.containerBase}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView>
                    {inputFields.map((input, index) => (
                        <Input
                            key={index}
                            placeholder={input.placeholder}
                            value={service[input.field] !== null ? service[input.field].toString() : ''}
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
                            {selectedDiscount ? `Giảm ${selectedDiscount.discount}%` : 'Chọn giảm giá...'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableRipple style={styles.imagePicker} onPress={picker}>
                        <Text style={styles.imagePickerText}>Thêm ảnh</Text>
                    </TouchableRipple>

                    {/* Hiển thị ảnh có sẵn */}
                    {renderImages(serviceImages)}

                    {/* Hiển thị ảnh mới thêm */}
                    {addedImages.length > 0 && renderAddImages(addedImages)}
                </ScrollView>
            </KeyboardAvoidingView>

            <Button primary onPress={handleSubmit}>
                Xác nhận
            </Button>

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

export default UpdateService;

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
    imageContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginHorizontal: 5,
        borderRadius: 8,
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
