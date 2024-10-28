import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Colors from '../../configs/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import * as ImagePicker from 'expo-image-picker';

const UserProfileHeader = ({ avatarUrl, username, email }) => {
    const [loading, setLoading] = useState(false);
    const [avatar, setAvatar] = useState(avatarUrl);
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            setAvatar(localUri);
            uploadAvatar(localUri);
        }
    };

    const uploadAvatar = async (uri) => {
        const formData = new FormData();
        formData.append('avatar', {
            uri,
            name: 'avatar.jpg',
            type: 'image/jpeg',
        });

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            const res = await authAPI(token).patch(endpoint['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                setAvatar(res.data.avatar);
                Alert.alert('Thông báo', 'Cập nhật Avatar thành công');
            } else {
                Alert.alert('Lỗi', 'Cập nhật Avatar thất bại');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật Avatar không thành công');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.avatarContainer}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                ) : (
                    <Image source={require('../../assets/images/none_avatar.jpg')} style={styles.avatar} />
                )}
                <View style={styles.cameraIcon}>
                    <TouchableOpacity onPress={pickImage}>
                        <FontAwesomeIcon icon={faCamera} size={18} color={Colors.gray} />
                    </TouchableOpacity>
                </View>
            </View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.email}>{email}</Text>

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
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
    avatarContainer: {
        position: 'relative',
        width: 100,
        height: 100,
        marginBottom: 12,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: 50,
        padding: 5,
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
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});
