import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { HelperText, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import MyStyles from '../../styles/MyStyles';
import HeaderBase from '../HeaderBase/HeaderBase';
import Input from '../Input';
import ButtonFooter from '../ButtonFooter';
import Button from '../Button';

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

    const changePassword = async () => {
        if (user.password !== user.confirm) setErr(true);
        else {
            setErr(false);
            setLoading(true);
            try {
                let form = new FormData();

                for (let f in user)
                    if (f !== 'confirm')
                        if (f === 'avatar')
                            form.append(f, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: user.avatar.type,
                            });
                        else form.append(f, user[f]);

                let res = await APIS.post(endpoint['changePassword'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (res.status === 201) navigation.navigate('Login');
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSubmit = () => {
        changePassword(); // Ensure that registration logic is called on submit
    };

    return (
        <LinearGradient
            colors={['#CDFFD8', '#94B9FF']} // Các màu gradient
            start={{ x: 0, y: 0 }} // Bắt đầu từ góc trên bên trái
            end={{ x: 1, y: 0 }} // Kết thúc ở góc trên bên phải
            style={[MyStyles.container]}
        >
            <HeaderBase>Đăng ký</HeaderBase>
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
});
