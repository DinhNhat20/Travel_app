import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useState } from 'react';
import MyStyles from '../../styles/MyStyles';
import HeaderBase from '../HeaderBase/HeaderBase';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

const Booking = ({ route }) => {
    const navigation = useNavigation();
    const { contactInfo, service, quantity, selectedSchedule } = route.params;

    const [loading, setLoading] = useState(false);

    const formatTime = (timeStr) => {
        const time = new Date(`1970-01-01T${timeStr}Z`); // Thêm ngày giả định để có thể parse được thời gian
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePayment = () => {
        // Gom dữ liệu vào một object
        const paymentData = {
            contactInfo,
            service,
            quantity,
            selectedSchedule,
            totalPrice: service.discount ? (service.price * (100 - service.discount)) / 100 : service.price,
        };

        // Điều hướng đến component Payment và truyền dữ liệu paymentData
        navigation.navigate('Payment', { paymentData });
    };

    return (
        <View style={[MyStyles.container]}>
            <HeaderBase>Thông tin booking</HeaderBase>

            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#1877F2" />
                ) : (
                    <View>
                        <View>
                            <Text style={styles.text1}>Thông tin dịch vụ</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.info}>Tên dịch vụ: {service.name}</Text>
                                </View>
                                <View style={styles.row}>
                                    <FontAwesomeIcon icon="fa-map-marker-alt" size={18} color="#777" />
                                    <Text style={styles.info}>{service.address}</Text>
                                </View>
                                <View style={styles.row}>
                                    <FontAwesomeIcon icon="fa-calendar" size={18} color="#777" />
                                    <Text style={styles.info}>
                                        {moment(selectedSchedule.date).format('DD/MM/YYYY')}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <FontAwesomeIcon icon="fa-clock" size={18} color="#777" />
                                    <Text style={styles.info}>
                                        {formatTime(selectedSchedule.start_time)} -{' '}
                                        {formatTime(selectedSchedule.end_time)}
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <FontAwesomeIcon icon={faHandHoldingDollar} size={18} color="#777" />
                                    <Text style={styles.info}>
                                        {service.discount
                                            ? formatPrice(
                                                  ((service.price * (100 - service.discount.discount)) / 100) *
                                                      quantity,
                                              )
                                            : service.price}{' '}
                                        VNĐ
                                    </Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.info}>Số lượng: {quantity}</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.text1}>Thông tin liên hệ</Text>
                        <View style={styles.infoContainer}>
                            <View style={styles.contactContainer}>
                                <Text style={styles.info}>Họ và tên</Text>
                                <View>
                                    <Text style={styles.info}>{contactInfo.full_name}</Text>
                                </View>
                            </View>
                            <View style={styles.contactContainer}>
                                <Text style={styles.info}>Số điện thoại</Text>
                                <View>
                                    <Text style={styles.info}>{contactInfo.phone}</Text>
                                </View>
                            </View>
                            <View style={styles.contactContainer}>
                                <Text style={styles.info}>Email</Text>
                                <View>
                                    <Text style={styles.info}>{contactInfo.email}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <View>
                <Button primary onPress={handlePayment}>
                    Tiếp tục
                </Button>
            </View>
        </View>
    );
};

export default Booking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#F5F5F5',
    },
    infoContainer: {
        marginVertical: 12,
        padding: 10,
        borderRadius: 6,
        borderColor: '#717273',
        backgroundColor: '#fff',
    },
    contactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    text1: {
        color: '#1877F2',
        fontSize: 14,
        fontWeight: 'bold',
    },
    info: {
        fontSize: 14,
        color: '#777',
        marginLeft: 8,
    },
});
