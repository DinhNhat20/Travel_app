import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const MyServiceItem = ({ service }) => {
    return (
        <View style={styles.serviceItem}>
            <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
            <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.text}>{service.location}</Text>
                <Text style={styles.text}>Ngày: {service.date}</Text>
                <Text style={styles.text}>
                    Thời gian: {service.startTime}h - {service.endTime}h
                </Text>
                <View style={styles.flexRow}>
                    <Text style={styles.text}>Số lượng: {service.quantity}</Text>
                    <TouchableOpacity>
                        <Text style={styles.serviceReview}>Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        color: '#1877F2',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 14,
        color: '#777',
    },
    serviceReview: {
        color: '#EE4D2D',
    },
    serviceList: {
        paddingBottom: 16,
    },
});
