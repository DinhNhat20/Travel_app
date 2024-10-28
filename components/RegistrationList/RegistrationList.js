import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import HeaderBase from '../HeaderBase/HeaderBase';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import RegistrationItem from '../RegistrationItem/RegistrationItem';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { isCloseToBottom } from '../../configs/Utils';
import Colors from '../../configs/Colors';

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegistrationList = ({ navigation, route }) => {
    const { schedule, serviceName } = route.params;
    const [registers, setRegisters] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [allDataLoaded, setAllDataLoaded] = useState(false);

    const loadRegisters = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let token = await AsyncStorage.getItem('token');
                let res = await authAPI(token).get(endpoint['booking-list'](schedule.id, page));

                if (res.data.next === null) {
                    setPage(0);
                    setAllDataLoaded(true);
                }
                if (page === 1) setRegisters(res.data.results);
                else
                    setRegisters((current) => {
                        return [...current, ...res.data.results];
                    });
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadRegisters();
    }, [page]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setPage(1);
            setAllDataLoaded(false);
            loadRegisters();
        });

        return unsubscribe;
    }, [navigation]);

    const loadMore = (event) => {
        const { nativeEvent } = event;
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const handleUpdateBooking = async (register) => {
        try {
            const token = await AsyncStorage.getItem('token');
            await authAPI(token).patch(endpoint['update-booking'](register.id), {
                payment_status: true,
            });
            setPage(1);
            loadRegisters();
            Alert.alert('Thông báo', 'Cập nhật thông tin thành công', [
                {
                    text: 'OK',
                    style: 'cancel',
                },
            ]);
        } catch (error) {
            console.error(error);
        }
    };

    const exportListToExcel = async () => {
        if (!allDataLoaded) {
            Alert.alert('Thông báo', 'Vui lòng tải hết danh sách đăng ký trước khi xuất.');
            return;
        }

        if (registers.length === 0) {
            Alert.alert('Thông báo', 'Danh sách đăng ký trống, không có dữ liệu để xuất.');
            return;
        }

        // Chuẩn bị dữ liệu cho file Excel
        const dataForExcel = registers.map((register, index) => ({
            'Số thứ tự': index + 1,
            'Họ và tên': register.full_name, // Thay thế tên trường phù hợp
            'Số điện thoại': register.phone, // Thay thế tên trường phù hợp
            'Trạng thái thanh toán': register.payment_status ? 'Đã thanh toán' : 'Chưa thanh toán',
        }));

        // Tạo tiêu đề cho file Excel
        const title = [[`Danh sách đăng ký dịch vụ ${serviceName}`]]; // Dòng tiêu đề

        // Chuyển đổi dữ liệu sang file Excel
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachDangKy');

        // Tạo file Excel dưới dạng buffer và chuyển đổi sang binary
        const excelBuffer = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

        // Tạo đường dẫn lưu file
        const filePath =
            FileSystem.documentDirectory + `Danh sách đăng ký dịch vụ ${serviceName} ngày ${schedule.date}.xlsx`;

        // Lưu file Excel vào thư mục tạm thời
        await FileSystem.writeAsStringAsync(filePath, excelBuffer, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Chia sẻ file
        Sharing.shareAsync(filePath, {
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            dialogTitle: 'Xuất danh sách đăng ký',
            UTI: 'com.microsoft.excel.xlsx',
        });
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Danh sách đăng ký</HeaderBase>
            <FlatList
                data={registers}
                renderItem={({ item }) => <RegistrationItem register={item} onPress={handleUpdateBooking} />}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.registerList}
                ListEmptyComponent={<Text>Chưa có đăng ký</Text>}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && page > 1 && <ActivityIndicator size="large" color={Colors.primary} />}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && page === 1}
                        onRefresh={() => {
                            setPage(1);
                            loadRegisters();
                        }}
                    />
                }
                onScroll={loadMore}
            />
            {loading && page === 1 && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )}
            <ButtonFooter onPress={exportListToExcel}>Xuất danh sách</ButtonFooter>
        </View>
    );
};

export default RegistrationList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    registerList: {
        marginTop: 12,
        paddingBottom: 80,
    },
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
});
