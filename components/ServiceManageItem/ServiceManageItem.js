import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import Colors from '../../configs/Colors';

const ServiceManageItem = ({ service }) => {
    return (
        <View style={styles.container}>
            <View style={styles.serviceItem}>
                <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
                <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceLocation}>{service.address}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                    <Text style={styles.serviceRating}>⭐ {service.average_rating}/5</Text>
                </View>
            </View>

            <View style={styles.controlContainer}>
                <Pressable style={styles.button}>
                    <Text style={styles.textColor}>Thêm lịch</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.textColor}>Sửa</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Text style={styles.textColor}>Xóa</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ServiceManageItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        margin: 12,
    },
    serviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
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
    serviceLocation: {
        fontSize: 14,
        color: '#777',
    },
    servicePrice: {
        fontSize: 14,
        color: '#777',
    },
    serviceLink: {
        color: Colors.secondary,
    },
    serviceRating: {
        fontSize: 14,
        color: '#f39c12',
    },
    serviceList: {
        paddingBottom: 16,
    },
    controlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    button: {
        flex: 1, // Đảm bảo mỗi nút chiếm một phần không gian
        justifyContent: 'center', // Căn giữa nội dung của nút theo chiều dọc
        alignItems: 'center', // Căn giữa nội dung của nút theo chiều ngang
        height: 48, // Chiều cao của nút
        marginHorizontal: 10, // Khoảng cách giữa các nút (tùy chọn)
        borderRadius: 8, // Bo góc nút
        backgroundColor: Colors.secondary,
    },
    textColor: {
        fontSize: 12,
        color: Colors.white,
    },
});
