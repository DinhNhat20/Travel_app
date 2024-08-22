import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

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
        backgroundColor: '#1877F2',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
    },
    primary: {
        backgroundColor: '#1877F2',
    },
    secondary: {
        backgroundColor: '#EE4D2D',
    },
});
