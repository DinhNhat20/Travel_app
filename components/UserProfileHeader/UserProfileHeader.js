import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Colors from '../../configs/Colors';

const UserProfileHeader = ({ avatarUrl, username, email }) => {
    return (
        <View style={styles.header}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>
        </View>
    );
};

export default UserProfileHeader;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f0f0f0',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    email: {
        fontSize: 16,
        color: Colors.gray,
    },
});
