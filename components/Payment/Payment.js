import { View, Text, StyleSheet, Pressable, Image, FlatList, Alert, Linking } from 'react-native';
import React, { useContext, useState } from 'react';
import HeaderBase from '../HeaderBase/HeaderBase';
import MyStyles from '../../styles/MyStyles';
import Button from '../Button';
import { MyUserContext } from '../../configs/Context';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../configs/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Payment = ({ route }) => {
    const navigation = useNavigation();
    const { paymentData } = route.params;

    const user = useContext(MyUserContext);

    const [loading, setLoading] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);

    const paymentMethods = [
        { id: 1, name: 'Thanh toán trực tiếp' },
        { id: 2, name: 'QR chuyển khoản', qrImage: require('../../assets/images/qr-code.png') },
        { id: 3, name: 'Ví Momo', qrImage: require('../../assets/images/momo.png') },
        { id: 4, name: 'Ví ZaloPay', qrImage: require('../../assets/images/zalopay.png') },
    ];

    const calculatePrice = (price, discount, quantity) => {
        if (discount) {
            return ((price * (100 - discount)) / 100) * quantity;
        }
        return price * quantity;
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

    const handlePaymentLive = () => {
        handleSubmit(false);

        Alert.alert('Thành công', 'Đăng ký thành công', [
            {
                text: 'OK',
                onPress: () => navigation.navigate('Service'),
            },
        ]);
    };

    const handlePaymentMoMo = async () => {
        try {
            const response = await APIS.post(endpoint['momo'], null, {
                headers: {
                    amount: calculatePrice(
                        paymentData.service.price,
                        paymentData.service.discount?.discount,
                        paymentData.quantity,
                    ).toString(),
                },
            });
            if (response.data.payUrl) {
                Linking.openURL(response.data.payUrl);
                handleSubmit(true); // Sau khi thanh toán thành công, gọi handleSubmit với paymentStatus = true
                navigation.navigate('Service');
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
                    amount: calculatePrice(
                        paymentData.service.price,
                        paymentData.service.discount?.discount,
                        paymentData.quantity,
                    ).toString(),
                },
            });
            if (response.data.order_url) {
                Linking.openURL(response.data.order_url);
                handleSubmit(true); // Sau khi thanh toán thành công, gọi handleSubmit với paymentStatus = true
                navigation.navigate('Service');
            } else {
                Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
        }
    };

    const updateServiceSchedule = async (scheduleId, updatedAvailable) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await authAPI(token).patch(`service-schedules/${scheduleId}/`, {
                available: updatedAvailable,
            });
        } catch (error) {
            console.error('Lỗi cập nhật lịch trình:', error);
        }
    };

    const handleSubmit = async (paymentStatus = false) => {
        setLoading(true);
        try {
            const formData = new FormData();

            const selectedPaymentMethodObj = paymentMethods.find((method) => method.id === selectedPaymentMethod);

            formData.append('active', true);
            formData.append('full_name', paymentData.contactInfo.full_name);
            formData.append('phone', paymentData.contactInfo.phone);
            formData.append('email', paymentData.contactInfo.email);
            formData.append('quantity', paymentData.quantity);
            formData.append(
                'total_price',
                calculatePrice(paymentData.service.price, paymentData.service.discount?.discount, paymentData.quantity),
            );
            formData.append('payment_status', paymentStatus);
            formData.append('payment_method', selectedPaymentMethodObj.name);
            formData.append('customer', user.id);
            formData.append('service_schedule', paymentData.selectedSchedule.id);

            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).post(endpoint['booking'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                const available = Number(paymentData.selectedSchedule.available);
                const qty = Number(paymentData.quantity);

                const updatedAvailable = Math.floor(available + qty);

                await updateServiceSchedule(paymentData.selectedSchedule.id, updatedAvailable);
            } else {
                Alert.alert('Lỗi', 'Đăng ký thất bại');
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert('Lỗi', 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={MyStyles.container}>
            <HeaderBase>Thanh toán</HeaderBase>

            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Phương thức thanh toán</Text>
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

                {selectedPaymentMethod === 2 && !isOptionsVisible && (
                    <View style={styles.qrContainer}>
                        <Image
                            source={paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage}
                            style={styles.qrImage}
                        />
                        <Button primary>Thanh toán QR chuyển khoản</Button>
                    </View>
                )}

                {selectedPaymentMethod === 3 && !isOptionsVisible && (
                    <View style={styles.qrContainer}>
                        <Image
                            source={paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage}
                            style={styles.qrImage}
                        />
                        <Button primary onPress={handlePaymentMoMo}>
                            Thanh toán MoMo
                        </Button>
                    </View>
                )}

                {selectedPaymentMethod === 4 && !isOptionsVisible && (
                    <View style={styles.qrContainer}>
                        <Image
                            source={paymentMethods.find((method) => method.id === selectedPaymentMethod)?.qrImage}
                            style={styles.qrImage}
                        />
                        <Button primary onPress={handlePaymentZaloPay}>
                            Thanh toán ZaloPay
                        </Button>
                    </View>
                )}

                {selectedPaymentMethod === 1 && !isOptionsVisible && (
                    <View style={styles.confirmationContainer}>
                        <Button primary onPress={handlePaymentLive}>
                            Xác nhận
                        </Button>
                    </View>
                )}
            </View>
        </View>
    );
};

export default Payment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 24,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    changeMethodText: {
        fontSize: 12,
        color: Colors.primary,
        textDecorationLine: 'underline',
    },
    paymentOption: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginVertical: 8,
        backgroundColor: Colors.white,
    },
    selectedPaymentOption: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    paymentText: {
        fontSize: 14,
    },
    selectedMethodContainer: {
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: Colors.white,
        marginTop: 16,
    },
    selectedMethodText: {
        fontSize: 14,
    },
    qrContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    qrImage: {
        width: 200,
        height: 200,
        marginBottom: 8,
    },
    confirmationContainer: {
        marginTop: 16,
        alignItems: 'center',
    },
});
