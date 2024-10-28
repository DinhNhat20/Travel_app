import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { MyUserContext } from '../../configs/Context';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import MyServiceItem from '../MyServiceItem/MyServiceItem';
import { isCloseToBottom } from '../../configs/Utils';
import Colors from '../../configs/Colors';
import HeaderBase from '../HeaderBase/HeaderBase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [bookings, setBookings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBooking = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('token');
                const res = await authAPI(token).get(endpoint['customer-bookings-notyetpaid'](user.id, page));
                if (res.data.next === null) setPage(0);
                if (page === 1) setBookings(res.data.results);
                else
                    setBookings((current) => {
                        return [...current, ...res.data.results];
                    });
            } catch (ex) {
                console.error(ex);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadBooking();
    }, [page]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setPage(1);
            loadBooking();
        });

        return unsubscribe;
    }, [navigation]);

    const loadMore = (event) => {
        const { nativeEvent } = event;
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const onUpdate = async () => {
        setPage(1);
        loadBooking();
    };

    return (
        <View style={styles.container}>
            <HeaderBase>Giỏ hàng</HeaderBase>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MyServiceItem booking={item} paid={false} onUpdate={onUpdate} />}
                ListEmptyComponent={<Text>Không có dữ liệu</Text>}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && page > 1 && <ActivityIndicator size="large" color={Colors.primary} />}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && page === 1}
                        onRefresh={() => {
                            setPage(1);
                            loadBooking();
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
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
