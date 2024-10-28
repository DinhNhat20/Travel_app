import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal,
    TextInput,
    Pressable,
    Alert,
    FlatList,
    Linking,
} from 'react-native';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { MyUserContext } from '../../configs/Context';
import Colors from '../../configs/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyServiceItem = ({ booking, paid, onUpdate = null }) => {
    const user = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');

    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(true);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const paymentMethods = [
        { id: 1, name: 'QR chuyển khoản', qrImage: require('../../assets/images/qr-code.png') },
        { id: 2, name: 'Ví Momo', qrImage: require('../../assets/images/momo.png') },
        { id: 3, name: 'Ví ZaloPay', qrImage: require('../../assets/images/zalopay.png') },
    ];

    const formatTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        return `${hours}:${minutes}`;
    };

    const formatPrice = (price) => {
        return price ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '0';
    };

    const handleStarPress = (index) => {
        setRating(index + 1);
    };

    const handleUpdateBookingAfterReview = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            formData.append('active', false);

            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).patch(endpoint['update-booking'](booking.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Lỗi cập nhật dữ liệu booking');
        } finally {
            setLoading(false);
        }
    };

    const handleReviewConfirm = async () => {
        const formData = new FormData();
        formData.append('star', rating);
        formData.append('content', reviewContent);
        formData.append('customer', user.id);
        formData.append('service', booking.service_id);

        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).post(endpoint['reviews'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                handleUpdateBookingAfterReview();
                Alert.alert('Cảm ơn bạn đã đánh giá dịch vụ');
                setModalVisible(false);
                setRating(0);
                setReviewContent('');
                onUpdate();
            } else {
                Alert.alert('Đã xảy ra lỗi khi đánh giá dịch vụ.');
            }
        } catch (error) {
            console.error(error);
            alert('Đã xảy ra lỗi khi đánh giá dịch vụ.');
        }
    };

    const handlePaymentMethodChange = (id) => {
        setSelectedPaymentMethod(id);
        setIsOptionsVisible(false);
    };

    const renderPaymentMethod = ({ item }) => (
        <Pressable
            style={[styles.paymentOption, selectedPaymentMethod === item.id && styles.selectedPaymentOption]}
            onPress={() => handlePaymentMethodChange(item.id)}
        >
            <Text style={styles.paymentText}>{item.name}</Text>
        </Pressable>
    );

    const handlePaymentMoMo = async () => {
        try {
            const response = await APIS.post(endpoint['momo'], null, {
                headers: {
                    amount: booking.total_price, // Replace with your calculation logic
                },
            });
            if (response.data.payUrl) {
                Linking.openURL(response.data.payUrl);
                setPaymentModalVisible(false);
                updateBooking();
            } else {
                Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
        }
    };

    const handlePaymentZaloPay = async () => {
        try {
            const response = await APIS.post(endpoint['zalo'], null, {
                headers: {
                    amount: booking.total_price, // Replace with your calculation logic
                },
            });
            if (response.data.order_url) {
                Linking.openURL(response.data.order_url);
                setPaymentModalVisible(false);
                updateBooking();
            } else {
                Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
        }
    };

    const updateBooking = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            const selectedPaymentMethodObj = paymentMethods.find((method) => method.id === selectedPaymentMethod);

            formData.append('payment_status', true);
            formData.append('payment_method', selectedPaymentMethodObj.name);

            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).patch(endpoint['update-booking'](booking.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                onUpdate();
                Alert.alert('Thành công', 'Thanh toán thành công và đã cập nhật dữ liệu booking');
            } else {
                Alert.alert('Lỗi', 'Thanh toán thất bại');
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Thanh toán thấy bại');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
        setPaymentModalVisible(false);
    };

    return (
        <View style={styles.serviceItem}>
            <Image source={{ uri: booking.service_images[0] }} style={styles.serviceImage} />
            <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{booking.service_name}</Text>
                <Text style={styles.text}>{booking.service_address}</Text>
                <Text style={styles.text}>Ngày: {moment(booking.date).format('DD/MM/YYYY')}</Text>
                <Text style={styles.text}>
                    Thời gian: {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                </Text>
                <View style={styles.flexRow}>
                    <Text style={styles.text}>Số lượng: {booking.quantity}</Text>
                    {/* Hiển thị nút tùy thuộc vào giá trị của paid */}
                    {paid === true ? (
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.serviceReview}>Đánh giá</Text>
                        </TouchableOpacity>
                    ) : paid === false ? (
                        <TouchableOpacity onPress={() => setPaymentModalVisible(true)}>
                            <Text style={styles.serviceReview}>Thanh toán</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>

            {/* Modal for review */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Đánh giá dịch vụ</Text>
                        <View style={styles.starsContainer}>
                            {[0, 1, 2, 3, 4].map((_, index) => (
                                <TouchableOpacity key={index} onPress={() => handleStarPress(index)}>
                                    <FontAwesome name="star" size={30} color={index < rating ? '#FFD700' : '#ddd'} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="Nhập nội dung đánh giá..."
                            value={reviewContent}
                            onChangeText={setReviewContent}
                        />
                        <View style={styles.buttonContainer}>
                            <Pressable style={[styles.button, styles.confirmButton]} onPress={handleReviewConfirm}>
                                <Text style={styles.buttonText}>Xác nhận</Text>
                            </Pressable>
                            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Payment Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={paymentModalVisible}
                onRequestClose={() => setPaymentModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.modalTitle}>Phương thức thanh toán</Text>
                            <Text style={{ fontSize: 18, color: Colors.primary, fontWeight: 'bold', marginBottom: 8 }}>
                                {formatPrice(booking.total_price)} VNĐ
                            </Text>
                            <Pressable onPress={() => setIsOptionsVisible(!isOptionsVisible)}>
                                <Text style={styles.changeMethodText}>Thay đổi</Text>
                            </Pressable>
                        </View>

                        {isOptionsVisible ? (
                            <FlatList
                                data={paymentMethods}
                                renderItem={renderPaymentMethod}
                                keyExtractor={(item) => item.id.toString()}
                                extraData={selectedPaymentMethod}
                            />
                        ) : (
                            <View style={styles.selectedMethodContainer}>
                                <Text style={styles.selectedMethodText}>
                                    {paymentMethods.find((method) => method.id === selectedPaymentMethod)?.name}
                                </Text>
                            </View>
                        )}

                        {selectedPaymentMethod === 1 && !isOptionsVisible && (
                            <View style={styles.qrContainer}>
                                <Image
                                    source={
                                        paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage
                                    }
                                    style={styles.qrImage}
                                />
                                <TouchableOpacity style={styles.paymentButton}>
                                    <Text style={styles.buttonText}>QR chuyển khoản</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {selectedPaymentMethod === 2 && !isOptionsVisible && (
                            <View style={styles.qrContainer}>
                                <Image
                                    source={
                                        paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage
                                    }
                                    style={styles.qrImage}
                                />
                                <TouchableOpacity style={styles.paymentButton} onPress={handlePaymentMoMo}>
                                    <Text style={styles.buttonText}>Thanh toán MoMo</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {selectedPaymentMethod === 3 && !isOptionsVisible && (
                            <View style={styles.qrContainer}>
                                <Image
                                    source={
                                        paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage
                                    }
                                    style={styles.qrImage}
                                />
                                <TouchableOpacity style={styles.paymentButton} onPress={handlePaymentZaloPay}>
                                    <Text style={styles.buttonText}>Thanh toán ZaloPay</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MyServiceItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        margin: 12,
    },
    serviceImage: {
        width: 120,
        height: 120,
        marginRight: 16,
        borderRadius: 8,
    },
    serviceDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    serviceName: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        color: Colors.gray,
    },
    serviceReview: {
        color: Colors.secondary,
    },
    serviceList: {
        paddingBottom: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        height: 100,
        width: '100%',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    cancelButton: {
        backgroundColor: '#ddd',
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    paymentOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray,
        borderRadius: 8,
        marginVertical: 6,
        alignItems: 'center',
    },
    selectedPaymentOption: {
        backgroundColor: '#f6e5de',
        borderColor: Colors.secondary,
    },
    paymentText: {
        fontSize: 16,
        color: Colors.secondary,
    },
    headerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginBottom: 14,
    },
    changeMethodText: {
        color: Colors.gray,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    selectedMethodContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    selectedMethodText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: '600',
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    qrImage: {
        width: 120,
        height: 120,
        marginBottom: 15,
    },
    paymentButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
    },
    confirmationContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
});
