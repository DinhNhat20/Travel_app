import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faHistory, faQuestionCircle, faCog, faChartSimple, faStar } from '@fortawesome/free-solid-svg-icons';
import MenuItem from '../MenuItem/MenuItem';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import MyStyles from '../../styles/MyStyles';
import UserProfileHeader from '../UserProfileHeader';
import { useNavigation } from '@react-navigation/native';
import { MyDispatcherContext, MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import Button from '../Button';
import Colors from '../../configs/Colors';

const Provider = () => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);
    const [profileOfUser, setProFileOfUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState(null);
    const [averageStar, setAverageStar] = useState(0);

    const loadProfileOfUser = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');

            let url = `${endpoint['providers']}?user=${user.id}`;

            let res = await authAPI(token).get(url);

            setProFileOfUser(res.data[0]);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const loadReviews = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['provider-reviews'](user.id));
            setReviews(res.data);
            calculateAverageStar(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // gọi hàm loadCates 1 lần khi nạp các component
    useEffect(() => {
        loadProfileOfUser();
        loadReviews();
    }, [user.id]);

    const calculateAverageStar = (reviews) => {
        if (reviews && reviews.length > 0) {
            const totalStars = reviews.reduce((sum, review) => sum + review.star, 0);
            const average = totalStars / reviews.length;
            setAverageStar(average.toFixed(1)); // Round to one decimal place
        }
    };

    const goToUserInfo = () => {
        navigation.navigate('UserInfo', { profileOfUser });
    };

    const goToStatistical = () => {
        navigation.navigate('Statistical');
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
                    <TouchableOpacity style={styles.flexBox} onPress={goToStatistical}>
                        <FontAwesomeIcon icon={faChartSimple} size={30} style={styles.icon} />
                        <Text style={MyStyles.textColor}>Thống kê</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.flexBox}>
                        <FontAwesomeIcon icon={faStar} size={30} style={styles.icon} />
                        <Text style={MyStyles.textColor}>
                            {averageStar}/5 ({reviews ? reviews.length : 0} đánh giá)
                        </Text>
                    </TouchableOpacity>
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

export default Provider;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    flexBox: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        color: Colors.secondary,
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
