import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Colors from '../../configs/Colors';

const ButtonFooter = ({ children, primary, secondary, onPress }) => {
    const buttonStyles = [primary && styles.primary, secondary && styles.secondary];
    return (
        <TouchableOpacity style={[styles.footer, buttonStyles]} onPress={onPress}>
            <Text style={styles.logoutText}>{children}</Text>
        </TouchableOpacity>
    );
};

export default ButtonFooter;

const styles = StyleSheet.create({
    footer: {
        padding: 14,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    logoutText: {
        color: Colors.white,
        fontSize: 16,
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.secondary,
    },
});
