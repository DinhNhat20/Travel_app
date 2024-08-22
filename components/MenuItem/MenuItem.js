import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const MenuItem = ({ icon, title, onPress }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <FontAwesomeIcon icon={icon} size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>{title}</Text>
        </TouchableOpacity>
    );
};

export default MenuItem;

const styles = StyleSheet.create({
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    menuIcon: {
        marginRight: 16,
        color: '#A6A6A6',
    },
    menuText: {
        fontSize: 16,
        color: '#717273',
    },
});
