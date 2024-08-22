import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Thêm import này
import HeaderBase from '../HeaderBase/HeaderBase';
import MyStyles from '../../styles/MyStyles';
import APIS, { endpoint } from '../../configs/APIS';
import { useNavigation } from '@react-navigation/native';
import Button from '../Button';

const CreateSchedule = ({ route }) => {
    const navigation = useNavigation();
    const { serviceId, serviceSchedules } = route.params;

    const [selectedDate, setSelectedDate] = useState({});
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const currentDate = new Date().toISOString().split('T')[0]; // Ngày hiện tại

    const onDayPress = (day) => {
        const { dateString } = day;

        // Ngăn chọn các ngày trước ngày hiện tại
        if (dateString < currentDate) {
            return; // Không làm gì nếu ngày chọn trước ngày hiện tại
        }

        // Giới hạn chỉ chọn một ngày
        const newSelectedDate = {};
        newSelectedDate[dateString] = { selected: true, marked: true, selectedColor: 'blue' };
        setSelectedDate(newSelectedDate);
    };

    const checkDateConflict = (selectedDate, serviceSchedules) => {
        const selectedDateString = Object.keys(selectedDate)[0];
        return serviceSchedules.some((schedule) => {
            return schedule.date === selectedDateString;
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

    const handleSubmit = async () => {
        const selectedDateString = Object.keys(selectedDate)[0]; // Lấy ngày đã chọn
        const numPeople = parseInt(numberOfPeople, 10); // Chuyển đổi số lượng người thành số nguyên

        if (!selectedDateString) {
            alert('Vui lòng chọn ngày.');
            return;
        }

        if (isNaN(numPeople) || numPeople <= 0) {
            alert('Số lượng người không hợp lệ.');
            return;
        }

        // Kiểm tra ngày đã chọn có bị trùng không
        const isDateConflict = checkDateConflict(selectedDate, serviceSchedules);
        if (isDateConflict) {
            alert('Lịch trình đã tồn tại, hãy chọn một ngày khác.');
            return;
        }

        // Tạo đối tượng FormData
        const formData = new FormData();
        formData.append('service', serviceId);
        formData.append('date', selectedDateString);
        formData.append('start_time', startTime);
        formData.append('end_time', endTime);
        formData.append('max_participants', numPeople);

        console.log(formData);

        // Gửi yêu cầu đến API
        try {
            let res = await APIS.post(endpoint['service-schedules01'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res.status === 201) {
                alert('Lịch trình đã được tạo thành công.');
                // Có thể chuyển hướng đến trang khác hoặc cập nhật giao diện
                route.params.onRefresh(); // Gọi callback để tải lại dữ liệu
                navigation.goBack(); // Quay lại trang trước đó
            } else {
                alert('Đã xảy ra lỗi khi tạo lịch trình.');
            }
        } catch (error) {
            console.error('Error creating schedule:', error);
            alert('Đã xảy ra lỗi khi tạo lịch trình.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <HeaderBase>Tạo lịch trình</HeaderBase>

            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={MyStyles.padding}>
                    <Calendar onDayPress={onDayPress} markedDates={selectedDate} markingType={'multi-dot'} />

                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập số lượng người"
                            keyboardType="numeric"
                            value={numberOfPeople}
                            onChangeText={setNumberOfPeople}
                        />

                        <View style={styles.timeContainer}>
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
                        </View>
                    </View>

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
                </View>
            </ScrollView>

            <Button primary onPress={handleSubmit}>
                Xác nhận
            </Button>
        </KeyboardAvoidingView>
    );
};

export default CreateSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        width: 180,
        padding: 12,
        backgroundColor: '#1877F2',
        marginVertical: 16,
        borderRadius: 5,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
    },
    input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 30,
        fontSize: 16,
    },
});
