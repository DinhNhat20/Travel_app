import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, Image, View } from 'react-native';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { HelperText, TouchableRipple } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

import MyStyles from '../../styles/MyStyles';
import HeaderBase from '../HeaderBase/HeaderBase';
import Input from '../Input';
import ButtonFooter from '../ButtonFooter';
import Button from '../Button';

const Register = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const updateState = (field, value) => {
        setUser((current) => {
            return { ...current, [field]: value };
        });
    };

    const inputFields = [
        { placeholder: 'Họ và tên đệm', field: 'name', multiline: false },
        { placeholder: 'Tên', field: 'address', multiline: false },
        { placeholder: 'Tên đăng nhập', field: 'username', multiline: false },
        { placeholder: 'Email', field: 'email', multiline: false },
        { placeholder: 'Số điện thoại', field: 'phone', multiline: false },
        { placeholder: 'Mật khẩu', field: 'password', multiline: false, secureTextEntry: true },
        { placeholder: 'Xác nhận mật khẩu', field: 'confirm', multiline: false, secureTextEntry: true },
    ];

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status != 'granted') Alert.alert('TravelApp', 'Permissions Denied!');
        else {
            let res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled) {
                updateState('avatar', res.assets[0]);
            }
        }
    };

    const register = async () => {
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

                let res = await APIS.post(endpoint['register'], form, {
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
        register(); // Ensure that registration logic is called on submit
    };

    return (
        <View style={[MyStyles.container]}>
            <HeaderBase>Đăng ký</HeaderBase>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
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
                        Mật khẩu không khớp!
                    </HelperText>

                    <TouchableRipple style={styles.imagePicker} onPress={picker}>
                        <Text style={styles.imagePickerText}>Chọn ảnh</Text>
                    </TouchableRipple>

                    {user.avatar && <Image source={{ uri: user.avatar.uri }} style={styles.avatar} />}
                </ScrollView>
            </KeyboardAvoidingView>
            <Button primary onPress={handleSubmit}>
                Xác nhận
            </Button>
        </View>
    );
};

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    imagePicker: {
        padding: 10,
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
