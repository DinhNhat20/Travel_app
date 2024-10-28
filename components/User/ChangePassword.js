import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    Alert,
    ActivityIndicator,
    View,
} from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { HelperText, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import MyStyles from '../../styles/MyStyles';
import HeaderBase from '../HeaderBase/HeaderBase';
import Input from '../Input';
import ButtonFooter from '../ButtonFooter';
import Button from '../Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endpoint } from '../../configs/APIS';
import Colors from '../../configs/Colors';

const ChangePassword = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateState = (field, value) => {
        setUser((current) => {
            return { ...current, [field]: value };
        });
    };

    const inputFields = [
        { placeholder: 'Mật khẩu cũ...', field: 'oldPassword', multiline: false, secureTextEntry: true },
        { placeholder: 'Mật khẩu mới...', field: 'newPassword', multiline: false, secureTextEntry: true },
        { placeholder: 'Xác nhận mật khẩu mới...', field: 'confirm', multiline: false, secureTextEntry: true },
    ];

    const handleSubmit = async () => {
        // Kiểm tra các trường nhập
        for (const input of inputFields) {
            if (!user[input.field] || user[input.field].trim() === '') {
                Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
                return;
            }
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
        if (user.newPassword !== user.confirm) {
            setErr(true);
            return;
        }

        // Gửi yêu cầu thay đổi mật khẩu
        try {
            setLoading(true);

            // Thêm await để lấy token
            const token = await AsyncStorage.getItem('token');

            const formData = new FormData();
            formData.append('oldPassword', user.oldPassword);
            formData.append('newPassword', user.newPassword);

            const res = await authAPI(token).post(endpoint['change-password'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.status === 200) {
                Alert.alert('Thông báo', 'Đổi mật khẩu thành công!');
            } else {
                Alert.alert('Thông báo', 'Có lỗi xảy ra, vui lòng thử lại sau.');
            }
        } catch (error) {
            Alert.alert('Thông báo', 'Đổi mật khẩu thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={['#fff', '#fff']} // Các màu gradient
            start={{ x: 0, y: 0 }} // Bắt đầu từ góc trên bên trái
            end={{ x: 1, y: 0 }} // Kết thúc ở góc trên bên phải
            style={[MyStyles.container]}
        >
            <HeaderBase>Đổi mật khẩu</HeaderBase>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {inputFields.map((input, index) => (
                    <Input
                        key={index}
                        placeholder={input.placeholder}
                        value={user[input.field]}
                        onChangeText={(t) => updateState(input.field, t)}
                        secureTextEntry={input.secureTextEntry || false}
                    />
                ))}

                <HelperText type="error" visible={err}>
                    Mật khẩu xác nhận không khớp!
                </HelperText>
            </KeyboardAvoidingView>
            <Button primary onPress={handleSubmit}>
                Xác nhận
            </Button>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
        </LinearGradient>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    imagePicker: {
        padding: 10,
        marginTop: 20,
        backgroundColor: '#717273',
        borderRadius: 28,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
    },
    avatar: {
        width: 200,
        height: 160,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});
