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
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { MyUserContext } from '../../configs/Context';
import ModalSelectItem from '../ModalSelectItem/ModalSelectItem';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../configs/Colors';

const UpdateService = ({ route }) => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const { service } = route.params;

    const [updateService, setUpdateService] = useState({});
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
    const [serviceImages, setServiceImages] = useState([]); // Initialize with service images
    const [images, setImages] = useState([]); // Dùng để lưu danh sách ảnh đã chọn

    const loadServiceTypes = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['serviceTypes']);
            setServiceTypes(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadDiscounts = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['discounts']);
            setDiscounts(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadProvinces = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['provinces']);
            setProvinces(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadImages = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['images'](service.id));
            setServiceImages(res.data);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProvinces();
        loadDiscounts();
        loadServiceTypes();
        loadImages();
    }, []);

    useEffect(() => {
        setUpdateService({
            name: service.name || '',
            address: service.address || '',
            price: service.price || '',
            description: service.description || '',
            require: service.require || '',
            province: service.province || '',
            service_type: service.service_type || '',
            discount: service.discount ? service.discount.id : null,
        });
    }, [service]);

    useEffect(() => {
        if (provinces && service.province) {
            const matchingProvince = provinces.find((province) => province.id === service.province);
            setSelectedProvince(matchingProvince || null);
        }

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
                const totalImages = images.length + newImages.length + serviceImages.length;

                if (totalImages <= 5) {
                    setImages((prevImages) => [...prevImages, ...newImages]);
                } else {
                    Alert.alert('Thông báo', 'Bạn chỉ có thể chọn tối đa 5 ảnh.');
                }
            }
        }
    };

    const handleDeleteImage = async (id) => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).delete(endpoint['delete-image'](id));

            if (res.status === 204) {
                setServiceImages((prevImages) => prevImages.filter((image) => image.id !== id));

                Alert.alert('Thành công', 'Xóa ảnh thành công');
            } else {
                Alert.alert('Lỗi', 'Xóa ảnh thất bại.');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Xóa ảnh thất bại.');
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleImagePress = (id) => {
        Alert.alert(
            'Thay đổi ảnh',
            'Bạn có muốn xóa ảnh này?',
            [
                {
                    text: 'OK',
                    onPress: () => handleDeleteImage(id),
                },
                {
                    text: 'Hủy',
                },
            ],
            { cancelable: true },
        );
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

    // Function to render existing service images
    const renderImages = (images) => (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageContainer}>
            {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: image.path }} style={styles.image} />
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleImagePress(image.id)}>
                        <FontAwesome name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );

    // Function to render newly added images
    const renderAddImages = (images) => (
        <ScrollView horizontal style={styles.imageContainer}>
            {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.image} />
                    <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                        <FontAwesome name="close" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );

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

    const handleAddImages = async () => {
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
                formData.append('service', service.id);

                // Gửi yêu cầu POST để thêm từng ảnh
                let token = await AsyncStorage.getItem('token');
                let res = await authAPI(token).post(endpoint['create-image'], formData, {
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
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            // Add service details to the form data
            formData.append('name', updateService.name || service.name);
            formData.append('address', updateService.address || service.address);
            formData.append('price', updateService.price || service.price);
            formData.append('description', updateService.description || service.description);
            formData.append('require', updateService.require || service.require);
            formData.append('province', updateService.province || selectedProvince?.id);
            formData.append('service_type', updateService.service_type || selectedServiceType?.id);
            formData.append('discount', updateService.discount || selectedDiscount?.id);

            console.log(formData);

            let token = await AsyncStorage.getItem('token');

            let res = await APIS.patch(endpoint['services02'](service.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 200) {
                handleAddImages();
                Alert.alert('Thành công', 'Cập nhật dịch vụ thành công.');
                navigation.navigate('ServiceManagement');
            } else {
                Alert.alert('Lỗi', 'Cập nhật dịch vụ thất bại.');
            }
        } catch (error) {
            console.error('Error updating service:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật dịch vụ.');
        } finally {
            setLoading(false);
        }
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
                            value={
                                updateService[input.field] !== null && updateService[input.field] !== undefined
                                    ? updateService[input.field].toString()
                                    : ''
                            }
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

                    <TouchableRipple style={styles.imagePicker} onPress={picker}>
                        <Text style={styles.imagePickerText}>Thêm ảnh</Text>
                    </TouchableRipple>

                    {/* Hiển thị ảnh có sẵn */}
                    {serviceImages && serviceImages.length > 0 && <Text>Ảnh</Text>}
                    {renderImages(serviceImages)}

                    {/* Hiển thị ảnh mới thêm */}
                    {images && images.length > 0 && <Text>Ảnh thêm</Text>}
                    {images.length > 0 && renderAddImages(images)}
                </ScrollView>
            </KeyboardAvoidingView>

            <Button primary onPress={handleSubmit}>
                Xác nhận
            </Button>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}

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
        marginVertical: 10,
        marginTop: 10,
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
        borderRadius: 8,
    },
    serviceTypeInput: {
        padding: 10,
        marginTop: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    serviceTypeText: {
        color: '#4E4B66',
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
