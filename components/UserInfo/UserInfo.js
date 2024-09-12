import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import React, { useContext, useState } from 'react';
import { faPhone, faLocationDot, faCalendarDays, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import UserProfileHeader from '../UserProfileHeader';
import MenuItem from '../MenuItem';
import Button from '../Button';
import { MyUserContext } from '../../configs/Context';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Colors from '../../configs/Colors';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalSelectItem from '../ModalSelectItem';
import DateTimePicker from '@react-native-community/datetimepicker';

const UserInfo = ({ route }) => {
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const { profileOfUser } = route.params;

    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [fullName, setFullName] = useState(user.role === 1 ? profileOfUser.full_name : profileOfUser.name);
    const [address, setAddress] = useState(user.address);
    const [CCCD, setCCCD] = useState(user.CCCD); // Assuming cccd is available for role 1
    const [phone, setPhone] = useState(user.phone);
    const [email, setEmail] = useState(user.email);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [birthday, setBirthday] = useState(
        profileOfUser.birthday ? moment(profileOfUser.birthday).format('DD/MM/YYYY') : '',
    );
    const [isGenderModalVisible, setIsGenderModalVisible] = useState(false);
    const [selectedGender, setSelectedGender] = useState(user.role === 1 ? profileOfUser.gender : '');
    const [description, setDescription] = useState(user.role !== 1 ? profileOfUser.description : '');

    const menuItems = [
        { icon: faPhone, title: user.phone },
        { icon: faLocationDot, title: user.address },
        {
            icon: profileOfUser.birthday ? faCalendarDays : faCircleUser,
            title: profileOfUser.birthday ? moment(profileOfUser.birthday).format('DD/MM/YYYY') : profileOfUser.name,
        },
    ];

    const genderOptions = [
        { id: '1', name: 'Nam' },
        { id: '2', name: 'Nữ' },
        { id: '3', name: 'Ẩn danh' },
    ];

    const handleGenderSelection = () => {
        setIsGenderModalVisible(true);
    };

    const handleGenderSelect = (item) => {
        setSelectedGender(item.name);
        setIsGenderModalVisible(false);
    };

    const handleDatePicker = () => {
        setIsDatePickerVisible(true);
    };

    const handleDateChange = (event, selectedDate) => {
        if (event.type === 'set') {
            const currentDate = selectedDate || new Date();
            setBirthday(moment(currentDate).format('DD/MM/YYYY'));
        }
        setIsDatePickerVisible(false);
    };

    const goToChangePassword = () => {
        navigation.navigate('ChangePassword');
    };

    const updateCustomer01 = async () => {
        const formData = new FormData();
        formData.append('CCCD', CCCD);
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('email', email);
        console.log(formData);

        try {
            let token = await AsyncStorage.getItem('token');

            let res = await authAPI(token).patch(endpoint['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Tài khoản đã được cập nhật');
            } else {
                Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
        }
    };

    const updateCustomer02 = async () => {
        const formData = new FormData();
        formData.append('full_name', fullName);
        const formattedBirthday = moment(birthday, 'DD/MM/YYYY').format('YYYY-MM-DD');
        formData.append('birthday', formattedBirthday);
        formData.append('gender', selectedGender);

        console.log(formData);

        try {
            let token = await AsyncStorage.getItem('token');

            let res = await authAPI(token).patch(endpoint['update-customer'](profileOfUser.user), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Tài khoản đã được cập nhật');
            } else {
                Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
        }
    };

    const updateProvider01 = async () => {
        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('address', address);
        formData.append('email', email);
        console.log(formData);

        try {
            let token = await AsyncStorage.getItem('token');

            let res = await authAPI(token).patch(endpoint['current-user'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Tài khoản đã được cập nhật');
            } else {
                Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
        }
    };

    const updateProvider02 = async () => {
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('description', description);

        console.log(formData);

        try {
            let token = await AsyncStorage.getItem('token');

            let res = await authAPI(token).patch(endpoint['update-provider'](profileOfUser.user), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 200) {
                Alert.alert('Tài khoản đã được cập nhật');
            } else {
                Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Đã xảy ra lỗi khi cập nhật tài khoản của bạn.');
        }
    };

    const handleUpdate = () => {
        if (user.role === 1) {
            updateCustomer01();
            updateCustomer02();
        } else {
            updateProvider01();
            updateProvider02();
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
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
                <Button primary onPress={() => setIsModalVisible(true)}>
                    Sửa thông tin
                </Button>
                <Button primary onPress={goToChangePassword}>
                    Đổi mật khẩu
                </Button>
            </View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        {user.role === 1 ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Họ và tên"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Địa chỉ"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="CCCD"
                                    value={CCCD}
                                    onChangeText={setCCCD}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Số điện thoại"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TouchableOpacity onPress={handleDatePicker} style={styles.input}>
                                    <Text>{birthday || 'Ngày sinh'}</Text>
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
                                    <Text>{selectedGender || 'Giới tính'}</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Tên"
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Địa chỉ"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Số điện thoại"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mô tả"
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleUpdate}>
                                <Text style={styles.buttonText}>Cập nhật</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={styles.buttonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <ModalSelectItem
                visible={isGenderModalVisible}
                items={genderOptions}
                onSelect={handleGenderSelect}
                onClose={() => setIsGenderModalVisible(false)}
            />
        </View>
    );
};

export default UserInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    icon: {
        color: Colors.secondary,
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: Colors.white,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 15,
        padding: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    confirmButton: {
        backgroundColor: Colors.primary,
    },
    cancelButton: {
        backgroundColor: '#ddd',
    },
    buttonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});
