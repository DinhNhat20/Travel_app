import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../configs/Colors';

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const ServiceItem = ({ service, footerType }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate('ServiceDetails', { service, footerType })}
        >
            <Image source={{ uri: service.images[0] }} style={styles.serviceImage} />
            <View style={styles.serviceDetails}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceLocation}>{service.address}</Text>
                <Text style={styles.servicePrice}>{formatPrice(service.price)} VNĐ</Text>
                <Text style={styles.serviceRating}>⭐ {service.average_rating.toFixed(1)}/5</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ServiceItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    serviceLocation: {
        fontSize: 14,
        color: Colors.gray,
    },
    servicePrice: {
        fontSize: 14,
        color: Colors.gray,
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
});
