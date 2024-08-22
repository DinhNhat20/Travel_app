import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import HeaderBase from '../HeaderBase/HeaderBase';
import Input from '../Input';
import { MyUserContext } from '../../configs/Context';
import MyStyles from '../../styles/MyStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endpoint } from '../../configs/APIS';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';

const ContactBookingInfo = ({ route }) => {
    const { service, quantity, selectedSchedule } = route.params;
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const [contactInfo, setContactInfo] = useState({
        full_name: '',
        phone: '',
        email: '',
    });
    const [profileOfUser, setProfileOfUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const updateState = (field, value) => {
        setContactInfo((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const loadProfileOfUser = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');
            let url = `${endpoint['customers']}?user=${user.id}`;
            let res = await authAPI(token).get(url);
            const profileData = res.data[0];
            setProfileOfUser(profileData);
            // Cập nhật contactInfo khi profileOfUser có dữ liệu
            setContactInfo({
                full_name: profileData.full_name,
                phone: user.phone,
                email: user.email,
            });
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileOfUser();
    }, [user.id]);

    const inputFields = [
        { label: 'Họ và tên', placeholder: 'Họ và tên...', field: 'full_name', multiline: false },
        { label: 'Số điện thoại', placeholder: 'Số điện thoại...', field: 'phone', multiline: false },
        { label: 'Email', placeholder: 'Email...', field: 'email', multiline: false },
    ];

    const goToBooking = () => {
        navigation.navigate('Booking', { contactInfo, service, quantity, selectedSchedule });
    };

    return (
        <View style={[MyStyles.container]}>
            <HeaderBase>Thông tin liên hệ</HeaderBase>

            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#1877F2" />
                ) : (
                    inputFields.map((input, index) => (
                        <Input
                            key={index}
                            label={input.label}
                            placeholder={input.placeholder}
                            value={contactInfo[input.field]}
                            onChangeText={(t) => updateState(input.field, t)}
                            multiline={input.multiline}
                            numberOfLines={input.numberOfLines || 1}
                        />
                    ))
                )}
            </View>

            <View>
                <Button primary onPress={goToBooking}>
                    Tiếp tục
                </Button>
            </View>
        </View>
    );
};

export default ContactBookingInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
});
