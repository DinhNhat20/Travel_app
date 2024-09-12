import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../configs/Colors';

const CartItem = ({ service }) => {
    const [quantity, setQuantity] = useState('1'); // Ensure quantity is treated as a string

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

    return (
        <View style={styles.container}>
            <View style={styles.serviceItem}>
                <Image source={{ uri: service.imageUrl }} style={styles.serviceImage} />
                <View style={styles.serviceDetails}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceLocation}>{service.location}</Text>
                    <Text style={styles.serviceLocation}>{service.date}</Text>
                </View>
            </View>

            <View style={styles.textContainer}>
                <View>
                    <TouchableOpacity>
                        <Text style={styles.textPrice}>{service.total_price} VNĐ</Text>
                    </TouchableOpacity>
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
                            maxLength={2} // Set a maxLength if needed
                        />
                        <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
                            <Text style={styles.buttonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default CartItem;

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
        width: 100,
        height: 100,
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
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 6,
    },
    textPrice: {
        fontSize: 16,
        color: Colors.secondary,
    },
    cartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantitySection: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 8,
    },
    quantityButton: {
        height: 40,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        color: Colors.secondary,
    },
    quantityInput: {
        height: 40,
        width: 40,
        fontSize: 14,
        textAlign: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.secondary,
        backgroundColor: Colors.white,
        marginHorizontal: 6,
    },
});
