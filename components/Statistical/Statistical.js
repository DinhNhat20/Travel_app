import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import ModalSelectItem from '../ModalSelectItem/ModalSelectItem';
import HeaderBase from '../HeaderBase/HeaderBase';
import { MyUserContext } from '../../configs/Context';
import APIS, { endpoint } from '../../configs/APIS';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Colors from '../../configs/Colors';

const Statistical = () => {
    const user = useContext(MyUserContext);
    const provider_id = user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const [isMonthModalVisible, setMonthModalVisible] = useState(false);
    const [isYearModalVisible, setYearModalVisible] = useState(false);

    const [monthlyRevenueData, setMonthlyRevenueData] = useState(null);
    const [yearlyRevenueData, setYearlyRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const months = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: `Tháng ${i + 1}` }));
    const years = Array.from({ length: 5 }, (_, i) => ({ id: currentYear - i, name: `${currentYear - i}` }));

    const handleSelectMonth = (item) => {
        setSelectedMonth(item.id);
        setMonthModalVisible(false);
    };

    const handleSelectYear = (item) => {
        setSelectedYear(item.id);
        setYearModalVisible(false);
    };

    const loadStatisticalData = async () => {
        setLoading(true);
        try {
            const monthRes = await APIS.get(endpoint['monthly-revenue'](provider_id, selectedMonth, selectedYear));
            setMonthlyRevenueData(monthRes.data);

            const yearRes = await APIS.get(endpoint['yearly-revenue'](selectedYear));
            console.log(yearRes.data);
            setYearlyRevenueData(yearRes.data);
        } catch (ex) {
            console.error(ex);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatisticalData();
    }, [selectedMonth, selectedYear]); // Tải dữ liệu lại khi tháng hoặc năm thay đổi

    // Cập nhật định dạng dữ liệu cho biểu đồ doanh thu hàng tháng
    const monthlyChartData = {
        labels: monthlyRevenueData ? monthlyRevenueData.map((item) => item.service_name) : [],
        datasets: [
            {
                data: monthlyRevenueData ? monthlyRevenueData.map((item) => item.total_revenue) : [],
            },
        ],
    };

    // Cập nhật định dạng dữ liệu cho biểu đồ doanh thu hàng năm
    const yearlyChartData = {
        labels: yearlyRevenueData ? yearlyRevenueData.map((item) => item.month) : [],
        datasets: [
            {
                data: yearlyRevenueData ? yearlyRevenueData.map((item) => item.total_revenue) : [],
            },
        ],
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Thống kê</HeaderBase>

            <ScrollView contentContainerStyle={styles.body}>
                <TouchableOpacity style={styles.selector} onPress={() => setMonthModalVisible(true)}>
                    <Text style={styles.selectorText}>Tháng {selectedMonth}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.selector} onPress={() => setYearModalVisible(true)}>
                    <Text style={styles.selectorText}>Năm {selectedYear}</Text>
                </TouchableOpacity>

                <ModalSelectItem
                    visible={isMonthModalVisible}
                    onClose={() => setMonthModalVisible(false)}
                    items={months}
                    onSelect={handleSelectMonth}
                />

                <ModalSelectItem
                    visible={isYearModalVisible}
                    onClose={() => setYearModalVisible(false)}
                    items={years}
                    onSelect={handleSelectYear}
                />

                {loading ? (
                    <ActivityIndicator color="#000000" />
                ) : error ? (
                    <Text>{error}</Text>
                ) : (
                    <>
                        {monthlyRevenueData && monthlyRevenueData.length > 0 && (
                            <>
                                <Text style={styles.title}>
                                    Doanh thu của các dịch vụ du lịch trong tháng {selectedMonth}/{selectedYear}
                                </Text>
                                <BarChart
                                    data={monthlyChartData}
                                    width={Dimensions.get('window').width - 40} // width của biểu đồ
                                    height={220} // height của biểu đồ
                                    chartConfig={{
                                        backgroundColor: '#e26a00',
                                        backgroundGradientFrom: '#fb8c00',
                                        backgroundGradientTo: '#ffa726',
                                        decimalPlaces: 0, // Đảm bảo số chữ số thập phân là 0
                                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chữ
                                        style: {
                                            borderRadius: 16,
                                        },
                                        propsForLabels: {
                                            fontSize: '12px', // Kích thước chữ phù hợp với dữ liệu
                                            fontFamily: 'Helvetica', // Font chữ dễ đọc
                                        },
                                        propsForBars: {
                                            fill: '#4e73df', // Màu thanh bar
                                            borderRadius: 5, // Độ bo góc của thanh bar
                                        },
                                    }}
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                    }}
                                />
                            </>
                        )}

                        <Text style={styles.title}>Doanh thu các tháng trong năm {selectedYear}</Text>
                        {yearlyRevenueData && yearlyRevenueData.length > 0 && (
                            <LineChart
                                data={yearlyChartData}
                                width={Dimensions.get('window').width - 40} // width của biểu đồ
                                height={220} // height của biểu đồ
                                chartConfig={{
                                    backgroundColor: '#e26a00',
                                    backgroundGradientFrom: '#fb8c00',
                                    backgroundGradientTo: '#ffa726',
                                    decimalPlaces: 0, // Đảm bảo số chữ số thập phân là 0
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chữ
                                    style: {
                                        borderRadius: 16,
                                    },
                                    propsForLabels: {
                                        fontSize: '12px', // Kích thước chữ phù hợp với dữ liệu
                                        fontFamily: 'Helvetica', // Font chữ dễ đọc
                                    },
                                    propsForBars: {
                                        fill: '#4e73df', // Màu thanh bar
                                        borderRadius: 5, // Độ bo góc của thanh bar
                                    },
                                }}
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                        )}

                        {!monthlyRevenueData?.length && <Text>Không có dữ liệu doanh thu theo tháng</Text>}
                        {!yearlyRevenueData?.length && <Text>Không có dữ liệu doanh thu theo năm</Text>}
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        padding: 20,
    },
    selector: {
        marginBottom: 20,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        alignItems: 'center',
    },
    selectorText: {
        fontSize: 12,
        color: Colors.gray,
    },
    title: {
        fontSize: 14,
        color: Colors.primary,
        textAlign: 'center',
        fontWeight: 'bold',
        marginVertical: 12,
    },
});

export default Statistical;
