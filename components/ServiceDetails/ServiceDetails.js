import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Pressable,
    PanResponder,
    Animated,
    Alert,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendar, faMessage, faStar, faMapMarkerAlt, faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { MyUserContext } from '../../configs/Context';
import Button from '../Button';
import ModalItem from '../ModalItem/ModalItem';

library.add(faMessage, faCalendar, faStar, faMapMarkerAlt, faClock, faUsers);

const ServiceDetails = ({ route }) => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const { service, footerType } = route.params;

    const [serviceSchedules, setServiceSchedule] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [quantity, setQuantity] = useState('1');
    const [provider, setProvider] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [dragging, setDragging] = useState(false); // Để theo dõi trạng thái kéo

    const loadProvider = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');

            let url = `${endpoint['providers']}?user=${service.provider}`;

            let res = await authAPI(token).get(url);

            setProvider(res.data[0]);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProvider();
    }, [service.provider]);

    useEffect(() => {
        const fetchServiceSchedules = async () => {
            try {
                let res = await APIS.get(endpoint['service-schedules'](service.id));
                setServiceSchedule(res.data);

                if (res.data.length > 0) {
                    setSelectedSchedule(res.data[0]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceSchedules();
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (e, gestureState) => {
                setDragging(true);
            },
            onPanResponderRelease: (e, gestureState) => {
                if (gestureState.dx < -50) {
                    // Kéo sang trái, chuyển sang ảnh tiếp theo
                    setCurrentImageIndex((prevIndex) => (prevIndex === service.images.length - 1 ? 0 : prevIndex + 1));
                } else if (gestureState.dx > 50) {
                    // Kéo sang phải, chuyển về ảnh trước
                    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? service.images.length - 1 : prevIndex - 1));
                }
                setDragging(false);
            },
        }),
    ).current;

    const renderIndicator = ({ index }) => (
        <View
            key={index}
            style={[
                styles.indicator,
                {
                    backgroundColor: currentImageIndex === index ? '#1877F2' : '#ccc',
                },
            ]}
        />
    );

    const formatTime = (timeStr) => {
        const time = new Date(`1970-01-01T${timeStr}Z`); // Thêm ngày giả định để có thể parse được thời gian
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to format date as dd/mm/yyyy
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleQuantityChange = (value) => {
        // Ensure the quantity is a number and at least 1
        const newQuantity = Math.max(parseInt(value, 10) || 1, 1);
        setQuantity(newQuantity.toString());
    };

    const handleIncreaseQuantity = () => {
        setQuantity((prevQuantity) => (parseInt(prevQuantity, 10) + 1).toString());
    };

    const handleDecreaseQuantity = () => {
        setQuantity((prevQuantity) => Math.max(parseInt(prevQuantity, 10) - 1, 1).toString());
    };

    const handleDateSelection = () => {
        setModalVisible(true); // Show the modal
    };

    const handleScheduleSelect = (schedule) => {
        setSelectedSchedule({ ...schedule });
        setModalVisible(false);
    };

    const goToChatBox = () => {
        const chatId = [user.id, provider.user].sort().join('-');
        navigation.navigate('Chat', { chatId: chatId }); // Navigate to ChatBox and pass serviceId
    };

    const goToSheduleList = () => {
        navigation.navigate('ScheduleList', { serviceId: service.id });
    };

    const goToUpdateService = () => {
        navigation.navigate('UpdateService', { service: service });
    };

    const goToContactBookingInfo = () => {
        if (!user) {
            Alert.alert(
                'Thông báo',
                'Hãy đăng nhập để đăng ký dịch vụ',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login'),
                    },
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        } else {
            navigation.navigate('ContactBookingInfo', { service, quantity, selectedSchedule });
        }
    };

    const handleDeleteService = async () => {
        try {
            let res = await APIS.delete(endpoint['services02'](service.id));

            if (res.status === 204) {
                Alert.alert('Thành công', 'Dịch vụ đã được xóa');
                navigation.goBack(); // Quay lại màn hình trước
            } else {
                Alert.alert('Lỗi', res.status);
            }
        } catch (error) {
            console.error('Error deleting service:', error);
            Alert.alert('Error', 'An error occurred while trying to delete the service.');
        }
    };

    const confirmDelete = () =>
        Alert.alert(
            'Xác nhận',
            'Bạn có muốn xóa dịch vụ này không?',
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Xoá', onPress: handleDeleteService },
            ],
            { cancelable: true },
        );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Animated.View style={styles.header} {...panResponder.panHandlers}>
                    <Image source={{ uri: service.images[currentImageIndex] }} style={styles.serviceImage} />
                </Animated.View>
                <View style={styles.indicatorContainer}>
                    {service.images.map((_, index) => renderIndicator({ index }))}
                </View>
            </View>
            {/* Body */}
            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.nameContainer}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Pressable onPress={goToChatBox}>
                        <FontAwesomeIcon icon="fa-message" size={24} color="#1877F2" />
                    </Pressable>
                </View>
                <View style={styles.row}>
                    <FontAwesomeIcon icon="fa-star" size={28} color="#FFD700" />
                    <Text style={styles.info}>{service.average_rating}/5</Text>
                </View>
                <View style={styles.row}>
                    <FontAwesomeIcon icon="fa-map-marker-alt" size={24} color="#777" />
                    <Text style={styles.info}>{service.address}</Text>
                </View>

                {/* Display loading indicator if data is not fetched yet */}
                {loading ? (
                    <ActivityIndicator size="large" color="#1877F2" />
                ) : selectedSchedule ? (
                    <>
                        <View style={styles.row}>
                            <FontAwesomeIcon icon="fa-clock" size={24} color="#777" />
                            <Text style={styles.info}>
                                {formatTime(selectedSchedule.start_time)} - {formatTime(selectedSchedule.end_time)}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <FontAwesomeIcon icon="fa-users" size={24} color="#777" />
                            <Text style={styles.info}>
                                {selectedSchedule.available}/{selectedSchedule.max_participants} người
                            </Text>
                        </View>
                        <View style={styles.nameContainer}>
                            <View style={styles.calendarContainer}>
                                <FontAwesomeIcon icon="fa-calendar" size={24} color="#777" />
                                <Text style={styles.info}>{formatDate(selectedSchedule.date)}</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.dateButton} onPress={handleDateSelection}>
                                    <Text style={styles.dateButtonText}>Chọn ngày</Text>
                                </TouchableOpacity>
                                <ModalItem
                                    visible={modalVisible}
                                    onClose={() => setModalVisible(false)}
                                    schedules={serviceSchedules}
                                    onSelect={handleScheduleSelect}
                                />
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.calendarContainer}>
                        <FontAwesomeIcon icon="fa-calendar" size={24} color="#777" />
                        <Text style={styles.info}>Chưa có lịch trình</Text>
                    </View>
                )}
                <View style={styles.separator} />
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.description}>{service.description}</Text>
                <View style={styles.separator} />
                <Text style={styles.sectionTitle}>Yêu cầu</Text>
                <Text style={styles.require}>{service.require}</Text>
            </ScrollView>

            {/* Footer */}
            {footerType === 1 ? (
                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>{formatPrice(service.price)} VNĐ</Text>
                        <Text style={styles.discountedPrice}>
                            {formatPrice((service.price * (100 - service.discount.discount)) / 100)} VNĐ
                        </Text>
                    </View>
                    <View style={styles.cartContainer}>
                        <View style={styles.quantitySection}>
                            <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.quantityInput}
                                keyboardType="numeric"
                                value={quantity}
                                onChangeText={handleQuantityChange}
                                maxLength={2}
                            />
                            <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <Button secondary onPress={goToContactBookingInfo}>
                            Đăng ký ngay
                        </Button>
                    </View>
                </View>
            ) : (
                <View style={styles.controlContainer}>
                    <Button secondary onPress={goToSheduleList}>
                        Lịch trình
                    </Button>
                    <Button secondary onPress={goToUpdateService}>
                        Sửa
                    </Button>
                    <Button secondary onPress={confirmDelete}>
                        Xóa
                    </Button>
                </View>
            )}
        </View>
    );
};

export default ServiceDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 200,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    body: {
        padding: 16,
        margin: 8,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    calendarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    serviceName: {
        color: '#1877F2',
        fontSize: 24,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 16,
        color: '#777',
        marginLeft: 8, // Space between icon and text
    },
    dateButton: {
        backgroundColor: '#1877F2',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    dateButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    require: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 16,
    },
    footer: {
        height: 120,
        padding: 8,
        marginBottom: 8,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    priceContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    cartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    originalPrice: {
        fontSize: 16,
        textDecorationLine: 'line-through',
        color: '#888',
    },
    discountedPrice: {
        fontSize: 20,
        color: '#EE4D2D',
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
    },
    quantityButton: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: '#EE4D2D',
    },
    quantityInput: {
        height: 40,
        fontSize: 14,
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#EE4D2D',
        backgroundColor: '#fff',
        marginHorizontal: 6,
    },
    controlContainer: {
        height: 100,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});
