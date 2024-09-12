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
    ActivityIndicator,
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
import Colors from '../../configs/Colors';
import { FontAwesome } from '@expo/vector-icons';

const CreateService = () => {
    const user = useContext(MyUserContext);
    const [service, setService] = useState({});

    const [serviceTypes, setServiceTypes] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState(null);

    const [discounts, setDiscounts] = useState(null);
    const [discountModalVisible, setDiscountModalVisible] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState(null);

    const [provinces, setProvinces] = useState(null);
    const [provinceModalVisible, setProvinceModalVisible] = useState(false);
    const [selectedProvince, setSelectedProvince] = useState(null);

    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadServiceTypes = async () => {
        setLoading(true);
        try {
            let res = await APIS.get(endpoint['serviceTypes']);
            setServiceTypes(res.data);
        } catch (ex) {
            console.error(ex);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const loadDiscounts = async () => {
        setLoading(true);
        try {
            let res = await APIS.get(endpoint['discounts']);
            setDiscounts(res.data);
        } catch (ex) {
            console.error(ex);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const loadProvinces = async () => {
        setLoading(true);
        try {
            let res = await APIS.get(endpoint['provinces']);
            setProvinces(res.data);
        } catch (ex) {
            console.error(ex);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDiscounts();
        loadServiceTypes();
        loadProvinces();
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

    const [images, setImages] = useState([]); // Dùng để lưu danh sách ảnh đã chọn

    const picker = async () => {
        if (images.length >= 5) {
            Alert.alert('Thông báo', 'Bạn chỉ có thể chọn tối đa 5 ảnh.');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Travel_App', 'Quyền truy cập bị từ chối!');
        } else {
            let res = await ImagePicker.launchImageLibraryAsync({
                allowsMultipleSelection: true, // Cho phép chọn nhiều ảnh
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

            if (!res.canceled) {
                // Lọc ra các ảnh mới chọn
                const newImages = res.assets.map((asset) => ({ uri: asset.uri }));

                // Tính số ảnh mới sau khi thêm ảnh mới
                const totalImages = images.length + newImages.length;

                if (totalImages <= 5) {
                    setImages((prevImages) => [...prevImages, ...newImages]);
                } else {
                    Alert.alert('Thông báo', 'Bạn chỉ có thể chọn tối đa 5 ảnh.');
                }
            }
        }
    };

    const handleProvinceSelect = (province) => {
        setSelectedProvince(province);
        updateState('province', province.id);
        setProvinceModalVisible(false);
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

    const handleRemoveImage = (index) => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa ảnh này không?', [
            { text: 'Hủy', style: 'cancel' },
            {
                text: 'Xóa',
                onPress: () => {
                    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
                },
            },
        ]);
    };

    const handleAddImages = async (serviceId) => {
        if (images.length === 0) return; // Không làm gì nếu không có ảnh

        setLoading(true);
        try {
            for (const [index, img] of images.entries()) {
                const formData = new FormData();
                formData.append('path', {
                    uri: img.uri,
                    type: 'image/jpeg', // Hoặc 'image/png' tùy vào định dạng ảnh
                    name: `image_${index}.jpg`, // Tên ảnh, có thể thay đổi tùy ý
                });
                formData.append('service', serviceId);

                // Gửi yêu cầu POST để thêm từng ảnh
                let res = await APIS.post(endpoint['create-image'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.status !== 201) {
                    Alert.alert('Lỗi', `Thêm ảnh thứ ${index + 1} thất bại`);
                }
            }
            setImages([]);
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Lỗi thêm ảnh');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Kiểm tra các trường bắt buộc
            const requiredFields = ['name', 'address', 'price', 'description', 'require'];
            for (const field of requiredFields) {
                if (!service[field]) {
                    Alert.alert('Lỗi', `Vui lòng nhập ${inputFields.find((f) => f.field === field).placeholder}`);
                    setLoading(false);
                    return;
                }
            }

            if (!selectedProvince) {
                Alert.alert('Lỗi', 'Vui lòng chọn tỉnh/thành phố');
                setLoading(false);
                return;
            }

            // Kiểm tra serviceTypes, provinces và images
            if (!selectedServiceType) {
                Alert.alert('Lỗi', 'Vui lòng chọn loại dịch vụ');
                setLoading(false);
                return;
            }

            if (images.length === 0) {
                Alert.alert('Lỗi', 'Vui lòng chọn ít nhất một ảnh');
                setLoading(false);
                return;
            }

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
            for (const key in service) {
                if (key !== 'price') {
                    formData.append(key, service[key]);
                }
            }

            formData.append('provider', user.id);

            // Gửi yêu cầu POST để tạo dịch vụ
            let res = await APIS.post(endpoint['create-service'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                // Lấy ID của dịch vụ mới tạo
                const serviceId = res.data.id;

                // Xử lý ảnh sau khi tạo dịch vụ thành công
                await handleAddImages(serviceId);

                Alert.alert('Thành công', 'Thêm dịch vụ mới thành công');
                // Reset lại form hoặc chuyển hướng đến màn hình khác
                setService({});
                setSelectedProvince(null);
                setSelectedServiceType(null);
                setSelectedDiscount(null);
                setLoading(false);
            } else {
                Alert.alert('Lỗi', 'Thêm dịch vụ mới thất bại');
                setLoading(false);
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Lỗi hệ thống');
            setLoading(false);
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
                            value={service[input.field] || ''}
                            onChangeText={(t) => updateState(input.field, t)}
                            multiline={input.multiline}
                            numberOfLines={input.numberOfLines || 1}
                        />
                    ))}

                    <TouchableOpacity style={styles.serviceTypeInput} onPress={() => setProvinceModalVisible(true)}>
                        <Text style={styles.serviceTypeText}>
                            {selectedProvince ? selectedProvince.name : 'Chọn tỉnh/thành phố...'}
                        </Text>
                    </TouchableOpacity>

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

                    <TouchableRipple style={styles.serviceTypeInput} onPress={picker}>
                        <Text style={styles.serviceTypeText}>Chọn ảnh</Text>
                    </TouchableRipple>
                    <ScrollView horizontal style={styles.imagesContainer}>
                        {images.map((img, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: img.uri }} style={styles.image} />
                                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                                    <FontAwesome name="close" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </ScrollView>
            </KeyboardAvoidingView>

            <ButtonFooter onPress={handleSubmit}>Xác nhận</ButtonFooter>

            <ModalSelectItem
                visible={provinceModalVisible}
                onClose={() => setProvinceModalVisible(false)}
                items={provinces}
                onSelect={handleProvinceSelect}
            />

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
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    serviceTypeInput: {
        padding: 10,
        marginTop: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    serviceTypeText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    imagesContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        marginTop: 24,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 6,
        marginBottom: 50,
    },
    removeButton: {
        position: 'absolute',
        top: 2,
        right: 12,
        backgroundColor: 'red',
        borderRadius: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});

export default CreateService;
