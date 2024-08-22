import { FlatList, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';

import HeaderBase from '../HeaderBase/HeaderBase';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import APIS, { endpoint } from '../../configs/APIS';
import Button from '../Button';

const ScheduleList = ({ route }) => {
    const navigation = useNavigation();
    const { serviceId } = route.params;

    const [serviceSchedules, setServiceSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchServiceSchedules = async () => {
        try {
            let res = await APIS.get(endpoint['service-schedules'](serviceId));
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
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.marginTop}
            />
            <Button primary onPress={goToCreateSchedule}>Thêm lịch trình</Button>
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
});
