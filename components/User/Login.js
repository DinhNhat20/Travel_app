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
    Image,
} from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { useNavigation } from '@react-navigation/native';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatcherContext } from '../../configs/Context';
import { ActivityIndicator, HelperText } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../configs/Colors';

const Login = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(false);
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
            setErr(true);
        } finally {
            setLoading(false);
        }
    };

    const goRegister = () => {
        nav.navigate('Register');
    };

    return (
        <ScrollView>
            <LinearGradient
                // colors={['#CDFFD8', '#94B9FF']}
                colors={['#fff', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[MyStyles.container, MyStyles.padding]}
            >
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image source={require('../../assets/images/travel_logo.jpg')} style={styles.avatar} />
                    </View>
                    <Text style={styles.text02}>Tận hưởng mọi khoảnh khắc</Text>
                    <Text style={styles.text}>Đăng nhập</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Tài khoản..."
                        value={user.username}
                        onChangeText={(t) => updateState('username', t)}
                        onFocus={() => setErr(false)}
                    />

                    <TextInput
                        style={styles.textInput}
                        placeholder="Mật khẩu..."
                        value={user.password}
                        onChangeText={(t) => updateState('password', t)}
                        onFocus={() => setErr(false)}
                        secureTextEntry
                    />

                    {err && (
                        <HelperText type="error" visible={err} style={styles.helperText}>
                            Tài khoản hoặc mật khẩu không đúng.
                        </HelperText>
                    )}

                    <View style={styles.alignRight}>
                        <Text style={[styles.text03, { marginTop: 12 }]}>Quên mật khẩu?</Text>
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
                        <Text style={[styles.text03, { color: Colors.gray }]}>-hoặc đăng nhập/đăng ký với-</Text>
                    </View>

                    <View style={[MyStyles.container, styles.buttonContainer, { marginTop: 24 }]}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.primary }]}>
                            <Text style={{ color: Colors.white }}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.secondary }]}>
                            <Text style={{ color: Colors.white }}>Google</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </ScrollView>
    );
};

export default Login;

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        marginTop: 12,
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    text02: {
        marginTop: 12,
        textAlign: 'center',
        fontSize: 16,
        fontStyle: 'italic',
        color: Colors.gray,
    },
    text03: {
        fontSize: 12,
        color: Colors.primary,
    },
    textInput: {
        height: 50,
        padding: 8,
        paddingLeft: 20,
        marginTop: 18,
        marginHorizontal: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.gray,
        color: '#333',
        backgroundColor: Colors.white,
        fontSize: 16,
    },
    btnLogin: {
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        marginTop: 12,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textLogin: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: 'bold',
    },
    link: {
        color: '#FF3131',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    alignRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 10,
    },
    avatar: {
        width: 240,
        height: 160,
    },
    helperText: {
        marginVertical: 0,
        paddingVertical: 0,
        fontSize: 12,
        height: 'auto',
    },
});
