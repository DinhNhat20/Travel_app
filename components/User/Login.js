import React, { useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { useNavigation } from '@react-navigation/native';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatcherContext } from '../../configs/Context';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const Login = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatcherContext);

    const updateState = (field, value) => {
        setUser((current) => ({ ...current, [field]: value }));
    };

    const login = async () => {
        setLoading(true);
        try {
            let res = await APIS.post(endpoint['login'], {
                ...user,
                client_id: 'nqnoxN5LnpCsW1dOKugY2cLs7AgVexVV9IoUBe3k',
                client_secret:
                    'umy4ALbRIchL82EXsTJeDt6pNexSKdVM3VvvCRqO8DArLYXqDNvj5mEJ07d4U6OlTlaVw0bB8gBuOFdqJdfsgzrOjqqvcDfHqls1m8YfS4aWlhwwHwFqdtDOJRRjZaZM',
                grant_type: 'password',
            });

            await AsyncStorage.setItem('token', res.data.access_token);

            setTimeout(async () => {
                let token = await AsyncStorage.getItem('token');
                let user = await authAPI(token).get(endpoint['current-user']);
                await AsyncStorage.setItem('user', JSON.stringify(user.data));

                dispatch({ type: 'login', payload: user.data });

                if (user.data.role === 1) {
                    nav.navigate('Service');
                } else {
                    nav.navigate('ServiceManagement');
                }
            }, 100);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const goRegister = () => {
        nav.navigate('Register');
    };

    return (
        <LinearGradient
            colors={['#CDFFD8', '#94B9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[MyStyles.container, MyStyles.padding]}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView>
                    <Text style={styles.text}>Đăng nhập</Text>
                    <Text style={styles.text02}>Tận hưởng mọi khoảnh khắc</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Tài khoản..."
                        value={user.username}
                        onChangeText={(t) => updateState('username', t)}
                    />

                    <TextInput
                        style={styles.textInput}
                        placeholder="Mật khẩu..."
                        value={user.password}
                        onChangeText={(t) => updateState('password', t)}
                        secureTextEntry
                    />

                    <View style={styles.alignRight}>
                        <Text style={styles.text03}>Quên mật khẩu?</Text>
                    </View>

                    <Pressable style={styles.btnLogin} onPress={login}>
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.textLogin}>Đăng nhập</Text>
                        )}
                    </Pressable>

                    <View style={styles.rowCenter}>
                        <Text style={styles.text03}>Bạn chưa có tài khoản? </Text>
                        <Pressable onPress={goRegister}>
                            <Text style={styles.link}>Đăng ký ngay</Text>
                        </Pressable>
                    </View>

                    <View style={styles.center}>
                        <Text style={[styles.text03, { color: '#4E4B66' }]}>-hoặc đăng nhập/đăng ký với-</Text>
                    </View>

                    <View style={[MyStyles.container, styles.buttonContainer, { marginTop: 24 }]}>
                        <TouchableOpacity style={styles.button}>
                            <Text>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                            <Text>Google</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

export default Login;

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1877F2',
    },
    text02: {
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        marginTop: 20,
        color: '#4E4B66',
        marginBottom: 48,
    },
    text03: {
        fontSize: 12,
        color: '#1877F2',
    },
    textInput: {
        height: 54,
        padding: 10,
        paddingLeft: 28,
        marginTop: 18,
        marginBottom: 12,
        borderRadius: 28,
        color: '#4E4B66',
        backgroundColor: '#fff',
        fontSize: 16,
    },
    btnLogin: {
        height: 54,
        backgroundColor: '#1877F2',
        borderRadius: 28,
        marginTop: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLogin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#FF3131',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    alignRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
    },
});
