import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import Header from '../Header';
import ServiceManageItem from '../ServiceManageItem/ServiceManageItem';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import ServiceItem from '../ServiceItem';
import { MyUserContext } from '../../configs/Context';
import { isCloseToBottom } from '../../configs/Utils';
import Colors from '../../configs/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ServiceManagement = ({ navigation }) => {
    const user = useContext(MyUserContext);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('');
    const [selectedSort, setSelectedSort] = useState(null);

    const filterItems = [
        { label: 'Bộ lọc', icon: 'fa-caret-down' },
        { label: 'Xếp theo', icon: 'fa-caret-down' },
        { label: 'Thêm' },
    ];

    const loadServices = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let res = await APIS.get(endpoint['services-of-provider'](q, page, user.id, sort));

                if (res.data.next === null) setPage(0);

                if (page === 1) setServices(res.data.results);
                else
                    setServices((current) => {
                        return [...current, ...res.data.results];
                    });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadServices();
    }, [q, page, user.id, sort]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setPage(1);
            loadServices();
        });

        return unsubscribe;
    }, [navigation]);

    const loadMore = (event) => {
        const { nativeEvent } = event;
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const handleSearch = (value) => {
        setPage(1);
        setQ(value);
    };

    const handleSelectSort = (sort) => {
        setSelectedSort(sort);
        setSort(sort.id);
        setPage(1);
    };

    const renderServiceItem = ({ item }) => <ServiceItem service={item} footerType={2} />;

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header
                filterItems={filterItems}
                search={handleSearch}
                onSelectSort={handleSelectSort}
                navigation={navigation}
            />

            {/* Body */}
            <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.serviceList}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && page > 1 && <ActivityIndicator />}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && page === 1}
                        onRefresh={() => {
                            setPage(1);
                            loadServices();
                        }}
                    />
                }
                onScroll={loadMore}
            />
        </View>
    );
};

export default ServiceManagement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    serviceList: {
        paddingBottom: 16,
    },
    selectedItemsContainer: {
        flexDirection: 'row',
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 8,
        margin: 6,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedItemText: {
        fontSize: 14,
        color: '#4E4B66',
        marginRight: 8,
    },
    removeItemText: {
        fontSize: 14,
        color: Colors.primary,
    },
});
