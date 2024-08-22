import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
    faUser,
    faHistory,
    faQuestionCircle,
    faCog,
    faCartShopping,
    faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import MenuItem from '../MenuItem';
import UserProfileHeader from '../UserProfileHeader';
import { MyDispatcherContext, MyUserContext } from '../../configs/Context';
import { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Button from '../Button';

const Customer = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);
    const [profileOfUser, setProFileOfUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadProfileOfUser = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');

            let url = `${endpoint['customers']}?user=${user.id}`;

            let res = await authAPI(token).get(url);

            setProFileOfUser(res.data[0]);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    // gọi hàm loadCates 1 lần khi nạp các component
    useEffect(() => {
        loadProfileOfUser();
    }, [user.id]);

    const goToUserInfo = () => {
        navigation.navigate('UserInfo', { profileOfUser });
    };

    const menuItems = [
        { icon: faUser, title: 'Thông tin cá nhân', onPress: goToUserInfo },
        { icon: faHistory, title: 'Lịch sử giao dịch' },
        { icon: faQuestionCircle, title: 'Trợ giúp' },
        { icon: faCog, title: 'Cài đặt' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <UserProfileHeader avatarUrl={user.avatar} username={user.username} email={user.email} />

            {/* Body */}
            <View style={styles.body}>
                <View style={styles.iconRow}>
                    <View style={styles.flexBox}>
                        <FontAwesomeIcon icon={faListCheck} size={30} style={styles.icon} />
                        <Text style={{ color: '#717273' }}>Dịch vụ của bạn</Text>
                    </View>
                    <View style={styles.flexBox}>
                        <FontAwesomeIcon icon={faCartShopping} size={30} style={styles.icon} />
                        <Text style={{ color: '#717273' }}>Giỏ hàng</Text>
                    </View>
                </View>
                <View style={styles.menuItems}>
                    <View style={styles.separator} />
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <MenuItem icon={item.icon} title={item.title} onPress={item.onPress} />
                            {index < menuItems.length - 1 && <View style={styles.separator} />}
                        </React.Fragment>
                    ))}
                </View>
            </View>

            {/* Footer */}
            <Button primary onPress={() => dispatch({ type: 'logout' })}>
                Đăng xuất
            </Button>
        </View>
    );
};

export default Customer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flexBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        flex: 1,
        padding: 16,
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 8,
    },
    icon: {
        color: '#EE4D2D',
    },
    menuItems: {
        marginTop: 16,
        paddingHorizontal: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 6,
    },
});
