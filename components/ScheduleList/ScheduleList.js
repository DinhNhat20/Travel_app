import { Alert, FlatList, StyleSheet, TextInput, View, TouchableOpacity, Text } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Button as NativePaperButton, Dialog, Portal } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Thêm import này

import HeaderBase from '../HeaderBase/HeaderBase';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import Button from '../Button';
import Colors from '../../configs/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScheduleList = ({ route }) => {
    const navigation = useNavigation();
    const { serviceId, serviceName } = route.params;

    const [serviceSchedules, setServiceSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [maxParticipants, setMaxParticipants] = useState('');
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [visible, setVisible] = useState(false);
    const [editingMode, setEditingMode] = useState(false);

    const fetchServiceSchedules = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(endpoint['service-schedules'](serviceId));
            setServiceSchedule(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchServiceSchedules();
        }, [serviceId]),
    );

    const goToCreateSchedule = () => {
        navigation.navigate('CreateSchedule', {
            serviceId: serviceId,
            serviceSchedules: serviceSchedules,
            onRefresh: fetchServiceSchedules, // Truyền callback để tải lại dữ liệu
        });
    };

    const goToRegistrationList = () => {
        setVisible(false);
        navigation.navigate('RegistrationList', {
            schedule: selectedItem,
            serviceName: serviceName,
        });
    };

    const handleConfirmStartTime = (date) => {
        setStartTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })); // Sử dụng hour12: false cho 24 giờ
        setStartTimePickerVisible(false);
    };

    const handleConfirmEndTime = (date) => {
        setEndTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })); // Sử dụng hour12: false cho 24 giờ
        setEndTimePickerVisible(false);
    };

    const showDialog = (item) => {
        setSelectedItem(item);
        setMaxParticipants(item.max_participants.toString());
        setStartTime(item.start_time);
        setEndTime(item.end_time);
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
        setSelectedItem(null);
    };

    const handleUpdate = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await authAPI(token).patch(endpoint['update-service-schedule'](selectedItem.id), {
                max_participants: maxParticipants,
                start_time: startTime,
                end_time: endTime,
            });
            fetchServiceSchedules();
            Alert.alert('Thông báo', 'Cập nhật thành công', [
                {
                    text: 'OK',
                    style: 'cancel',
                },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            hideDialog();
        }
    };

    const confirmUpdate = () => {
        Alert.alert('Xác nhận cập nhật', 'Bạn có chắc chắn muốn cập nhật lịch trình này không?', [
            {
                text: 'OK',
                onPress: handleUpdate,
                style: 'destructive',
            },
            {
                text: 'Hủy',
                style: 'cancel',
            },
        ]);
    };

    const handleDelete = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await authAPI(token).delete(endpoint['delete-service-schedule'](selectedItem.id));
            fetchServiceSchedules(); // Tải lại danh sách sau khi xóa
            Alert.alert('Thông báo', 'Xóa thành công', [
                {
                    text: 'OK',
                    style: 'cancel',
                },
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            hideDialog(); // Đóng dialog sau khi xóa
        }
    };

    const confirmDelete = () => {
        Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa lịch trình này không?', [
            {
                text: 'Xóa',
                onPress: handleDelete,
                style: 'destructive',
            },
            {
                text: 'Hủy',
                style: 'cancel',
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Danh sách lịch trình</HeaderBase>
            <FlatList
                data={serviceSchedules}
                renderItem={({ item }) => (
                    <ScheduleItem
                        date={item.date}
                        max_participants={item.max_participants}
                        available={item.available}
                        onPress={() => showDialog(item)}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.marginTop}
            />

            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
                    <View style={styles.updateContent}>
                        {editingMode ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    label="Số lượng người tối đa"
                                    value={maxParticipants}
                                    keyboardType="numeric"
                                    onChangeText={setMaxParticipants}
                                />
                                <TouchableOpacity style={styles.button} onPress={() => setStartTimePickerVisible(true)}>
                                    <Text style={styles.buttonText}>
                                        {startTime ? `Bắt đầu: ${startTime}` : 'Thời gian bắt đầu'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.button} onPress={() => setEndTimePickerVisible(true)}>
                                    <Text style={styles.buttonText}>
                                        {endTime ? `Kết thúc: ${endTime}` : 'Thời gian kết thúc'}
                                    </Text>
                                </TouchableOpacity>

                                {/* Modal chọn thời gian bắt đầu */}
                                <DateTimePickerModal
                                    isVisible={isStartTimePickerVisible}
                                    mode="time"
                                    is24Hour={true}
                                    onConfirm={handleConfirmStartTime}
                                    onCancel={() => setStartTimePickerVisible(false)}
                                />

                                {/* Modal chọn thời gian kết thúc */}
                                <DateTimePickerModal
                                    isVisible={isEndTimePickerVisible}
                                    mode="time"
                                    is24Hour={true}
                                    onConfirm={handleConfirmEndTime}
                                    onCancel={() => setEndTimePickerVisible(false)}
                                />
                                <View style={styles.modalActions}>
                                    <NativePaperButton onPress={confirmUpdate}>Cập nhật</NativePaperButton>
                                    <NativePaperButton onPress={() => setEditingMode(false)}>Hủy</NativePaperButton>
                                </View>
                            </>
                        ) : (
                            <Dialog.Actions style={styles.dialogActions}>
                                <NativePaperButton
                                    textColor={Colors.primary}
                                    style={styles.dialogButton}
                                    onPress={() => goToRegistrationList()}
                                >
                                    Xem danh sách đăng ký
                                </NativePaperButton>
                                <View style={styles.separator} />
                                <NativePaperButton
                                    textColor={Colors.primary}
                                    style={styles.dialogButton}
                                    onPress={() => setEditingMode(true)}
                                >
                                    Sửa lịch trình
                                </NativePaperButton>
                                <View style={styles.separator} />
                                <NativePaperButton
                                    textColor={Colors.primary}
                                    style={styles.dialogButton}
                                    onPress={confirmDelete}
                                >
                                    Xóa lịch trình
                                </NativePaperButton>
                                <View style={styles.separator} />
                                <NativePaperButton
                                    textColor={Colors.primary}
                                    style={styles.dialogButton}
                                    onPress={hideDialog}
                                >
                                    Hủy
                                </NativePaperButton>
                            </Dialog.Actions>
                        )}
                    </View>
                </Dialog>
            </Portal>
            <Button primary onPress={goToCreateSchedule}>
                Thêm lịch trình
            </Button>
        </View>
    );
};

export default ScheduleList;

const styles = StyleSheet.create({
    container: {
        flex: 1, // Đảm bảo View cha chiếm toàn bộ chiều cao màn hình
    },
    marginTop: {
        marginTop: 12,
    },
    dialog: {
        width: '80%',
        maxHeight: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    dialogActions: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    dialogButton: {
        color: Colors.primary,
        width: '100%',
        textAlign: 'center',
        paddingVertical: 8,
    },
    separator: {
        height: 1,
        backgroundColor: '#717273',
        width: '100%',
    },
    updateContent: {
        padding: 10,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 12,
        backgroundColor: Colors.primary,
        marginVertical: 6,
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: Colors.white,
        fontSize: 12,
    },
    input: {
        borderColor: '#717273',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginBottom: 6,
        fontSize: 12,
    },
});
