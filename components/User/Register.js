import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
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
import ModalSelectItem from '../ModalSelectItem';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import Colors from '../../configs/Colors';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
    const [user, setUser] = useState({});
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const nav = useNavigation();

    const genderOptions = [
        { id: '1', name: 'Nam' },
        { id: '2', name: 'Nữ' },
        { id: '3', name: 'Ẩn danh' },
    ];

    const updateState = (field, value) => {
        setUser((current) => {
            return { ...current, [field]: value };
        });
    };

    const inputFields = [
        { placeholder: 'Họ và tên', field: 'full_name', multiline: false },
        { placeholder: 'Tên đăng nhập', field: 'username', multiline: false },
        { placeholder: 'Email', field: 'email', multiline: false },
        { placeholder: 'Số điện thoại', field: 'phone', multiline: false },
        { placeholder: 'CCCD', field: 'CCCD', multiline: false },
        { placeholder: 'Địa chỉ', field: 'address', multiline: false },
        { placeholder: 'Mật khẩu', field: 'password', multiline: false, secureTextEntry: true },
        { placeholder: 'Xác nhận mật khẩu', field: 'confirm', multiline: false, secureTextEntry: true },
    ];

    const handleGenderSelection = () => {
        setIsGenderModalVisible(true);
    };

    const handleDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const handleGenderSelect = (item) => {
        updateState('gender', item.name);
        setIsGenderModalVisible(false);
    };

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || new Date();
            updateState('birthday', moment(currentDate).format('DD/MM/YYYY'));
        }
        setIsDatePickerVisible(false);
    };

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
        }
    };

    const register = async () => {
        // Kiểm tra tất cả các trường không để trống
        if (
            !user.full_name ||
            !user.username ||
            !user.email ||
            !user.phone ||
            !user.CCCD ||
            !user.address ||
            !user.password ||
            !user.confirm ||
            !user.gender ||
            !user.birthday
        ) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            Alert.alert('Thông báo', 'Email không hợp lệ.');
            return;
        }

        // Kiểm tra số điện thoại và CCCD
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(user.phone)) {
            Alert.alert('Thông báo', 'Số điện thoại không hợp lệ.');
            return;
        }

        const cccdRegex = /^\d{12}$/;
        if (!cccdRegex.test(user.CCCD)) {
            Alert.alert('Thông báo', 'CCCD phải là số và bao gồm 12 chữ số.');
            return;
        }

        if (user.password !== user.confirm) {
            setErr(true);
        } else {
            setErr(false);
            setLoading(true);
            try {
                // Đăng ký tài khoản
                let formData = new FormData();
                formData.append('username', user.username);
                formData.append('password', user.password);
                formData.append('email', user.email);
                formData.append('phone', user.phone);
                formData.append('CCCD', user.CCCD);
                formData.append('address', user.address);
                formData.append('role', 1); // Chỉ định vai trò người dùng

                let res = await APIS.post(endpoint['register'], formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Lấy token
                if (res.status === 201) {
                    // Đăng nhập để lấy token
                    let loginRes = await APIS.post(endpoint['login'], {
                        username: user.username,
                        password: user.password,
                        client_id: 'nqnoxN5LnpCsW1dOKugY2cLs7AgVexVV9IoUBe3k',
                        client_secret:
                            'umy4ALbRIchL82EXsTJeDt6pNexSKdVM3VvvCRqO8DArLYXqDNvj5mEJ07d4U6OlTlaVw0bB8gBuOFdqJdfsgzrOjqqvcDfHqls1m8YfS4aWlhwwHwFqdtDOJRRjZaZM',
                        grant_type: 'password',
                    });

                    const token = loginRes.data.access_token;

                    // Lưu token vào AsyncStorage
                    await AsyncStorage.setItem('token', token);

                    // Gửi thông tin khách hàng
                    const customerData = {
                        full_name: user.full_name,
                        birthday: moment(user.birthday, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                        gender: user.gender,
                        user: res.data.id,
                    };

                    let customerRes = await authAPI(token).post(endpoint['customers'], customerData);

                    if (customerRes.status === 201) {
                        Alert.alert('Thông báo', 'Tạo tài khoản thành công');
                        nav.navigate('SignIn');
                    }
                }
            } catch (ex) {
                console.error(ex);
                Alert.alert('Thông báo', 'Tạo tài khoản thất bại');
            } finally {
                setLoading(false);
            }
        }
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
                            onFocus={() => setErr(false)}
                        />
                    ))}

                    <TouchableOpacity onPress={handleDatePicker} style={styles.input}>
                        <Text style={styles.text}>{user.birthday || 'Ngày sinh'}</Text>
                    </TouchableOpacity>
                    {isDatePickerVisible && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                        />
                    )}

                    <TouchableOpacity onPress={handleGenderSelection} style={styles.input}>
                        <Text style={styles.text}>{user.gender || 'Giới tính'}</Text>
                    </TouchableOpacity>

                    {/* <TouchableRipple style={styles.imagePicker} onPress={pickImage}>
                        <Text style={styles.imagePickerText}>Chọn ảnh</Text>
                    </TouchableRipple> */}

                    {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}

                    <HelperText type="error" visible={err}>
                        Mật khẩu xác nhận không đúng!
                    </HelperText>
                </ScrollView>
            </KeyboardAvoidingView>
            <Button primary onPress={register}>
                Xác nhận
            </Button>

            <ModalSelectItem
                visible={isGenderModalVisible}
                items={genderOptions}
                onSelect={handleGenderSelect}
                onClose={() => setIsGenderModalVisible(false)}
            />

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
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
        marginTop: 20,
        backgroundColor: '#717273',
        borderRadius: 4,
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
    input: {
        flex: 1,
        justifyContent: 'center',
        height: 54,
        paddingHorizontal: 24,
        marginTop: 18,
        marginBottom: 10,
        borderRadius: 4,
        backgroundColor: Colors.white,
        borderColor: Colors.gray,
        borderWidth: 1,
    },
    text: {
        color: '#555',
        fontSize: 16,
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
