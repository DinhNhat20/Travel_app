import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { Dialog, Button } from 'react-native-paper';
import Colors from '../../configs/Colors';

const RegistrationItem = ({ register, onPress }) => {
    const showAlert = () => {
        Alert.alert(
            'Xác nhận thanh toán',
            `Xác nhận thanh toán dịch vụ cho khách hàng ${register.full_name}`,
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => onPress(register),
                },
            ],
            { cancelable: false },
        );
    };
    return (
        <View style={[styles.parentContainer, styles.justifyContent]}>
            <View style={styles.childrenContainer}>
                <Text style={MyStyles.text01}>{register.full_name}</Text>
                <Text style={MyStyles.textColor}>{register.phone}</Text>
            </View>
            {register.payment_status ? (
                <Text style={styles.paymentStatus}>Đã thanh toán</Text>
            ) : (
                <TouchableOpacity onPress={showAlert}>
                    <Text style={{ color: Colors.secondary }}>Thanh toán</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default RegistrationItem;

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        margin: 12,
    },
    childrenContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    icon: {
        marginRight: 8,
    },
    image: {
        width: 68,
        height: 68,
        marginRight: 20,
        borderRadius: 50,
    },
    paymentStatus: {
        color: 'green',
        fontSize: 14,
    },
});
