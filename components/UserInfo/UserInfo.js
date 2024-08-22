import { StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
import { faPhone, faLocationDot, faCalendarDays, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import UserProfileHeader from '../UserProfileHeader';
import MenuItem from '../MenuItem';
import Button from '../Button';
import { MyUserContext } from '../../configs/Context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const UserInfo = ({ route }) => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const { profileOfUser } = route.params;

    const menuItems = [
        { icon: faPhone, title: user.phone },
        { icon: faLocationDot, title: user.address },
        {
            icon: profileOfUser.birthday ? faCalendarDays : faCircleUser,
            title: profileOfUser.birthday ? moment(profileOfUser.birthday).format('DD/MM/YYYY') : profileOfUser.name,
        },
    ];

    const goToChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    return (
        <View>
            <UserProfileHeader avatarUrl={user.avatar} username={user.username} email={user.email} />

            <View style={styles.menuItems}>
                <View style={styles.separator} />
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <MenuItem icon={item.icon} title={item.title} onPress={item.onPress} />
                        {index < menuItems.length - 1 && <View style={styles.separator} />}
                    </React.Fragment>
                ))}
            </View>

            <View>
                <Button primary>Sửa thông tin</Button>
                <Button primary onPress={goToChangePassword}>
                    Đổi mật khẩu
                </Button>
            </View>
        </View>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    icon: {
        color: '#EE4D2D',
    },
    menuItems: {
        marginTop: 16,
        padding: 16,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 6,
    },
});
