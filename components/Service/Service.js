import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import Header from '../Header';
import ServiceItem from '../ServiceItem';
import APIS, { endpoint } from '../../configs/APIS';
import { isCloseToBottom } from '../../configs/Utils';

const Service = ({ navigation }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [q, setQ] = useState('');
    const [service_types, setService_types] = useState([]);
    const [service_type, setService_type] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [province, setProvince] = useState('');
    const [sort, setSort] = useState('');
    const [selectedServiceType, setSelectedServiceType] = useState(null);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedSort, setSelectedSort] = useState(null);

    const filterItems = [
        { label: 'Loại hình', icon: 'fa-caret-down' },
        { label: 'Tỉnh/TP', icon: 'fa-caret-down' },
        { label: 'Xếp theo', icon: 'fa-caret-down' },
    ];

    const loadProvinces = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let res = await APIS.get(endpoint['provinces']);
                setProvinces(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const loadServiceType = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let res = await APIS.get(endpoint['service-types']);
                setService_types(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const loadServices = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let res = await APIS.get(endpoint['services'](q, service_type, page, province, sort));

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
        loadServiceType();
        loadProvinces();
    }, []);

    useEffect(() => {
        loadServices();
    }, [q, page, service_type, province, sort]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setPage(1);
            loadServices();
        });

        return unsubscribe;
    }, [navigation]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const handleSearch = (value) => {
        setPage(1);
        setQ(value);
    };

    const handleSelectServiceType = (service_type) => {
        setSelectedServiceType(service_type);
        setService_type(service_type.id);
        setPage(1);
    };

    const handleSelectProvince = (province) => {
        setSelectedProvince(province);
        setProvince(province.id);
        setPage(1);
    };

    const handleSelectSort = (sort) => {
        setSelectedSort(sort);
        setSort(sort.id);
        setPage(1);
    };

    const handleRemoveServiceType = () => {
        setSelectedServiceType(null);
        setService_type('');
        setPage(1);
    };

    const handleRemoveProvince = () => {
        setSelectedProvince(null);
        setProvince('');
        setPage(1);
    };

    const handleRemoveSort = () => {
        setSelectedSort(null);
        setSort('');
        setPage(1);
    };

    const renderServiceItem = ({ item }) => <ServiceItem service={item} footerType={1} />;

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header
                filterItems={filterItems}
                search={handleSearch}
                provinces={provinces}
                onSelectProvince={handleSelectProvince}
                service_types={service_types}
                onSelectServiceType={handleSelectServiceType}
                onSelectSort={handleSelectSort}
            />

            {(selectedServiceType || selectedProvince || selectedSort) && (
                <View style={{ height: 60 }}>
                    <ScrollView horizontal style={styles.selectedItemsContainer}>
                        {selectedServiceType && (
                            <View style={styles.selectedItem}>
                                <Text style={styles.selectedItemText}>{selectedServiceType.name}</Text>
                                <TouchableOpacity onPress={handleRemoveServiceType}>
                                    <Text style={styles.removeItemText}>x</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {selectedProvince && (
                            <View style={styles.selectedItem}>
                                <Text style={styles.selectedItemText}>{selectedProvince.name}</Text>
                                <TouchableOpacity onPress={handleRemoveProvince}>
                                    <Text style={styles.removeItemText}>x</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {selectedSort && (
                            <View style={styles.selectedItem}>
                                <Text style={styles.selectedItemText}>{selectedSort.name}</Text>
                                <TouchableOpacity onPress={handleRemoveSort}>
                                    <Text style={styles.removeItemText}>x</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}

            {/* Body */}
            <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.serviceList}
                onEndReached={loadMore}
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
            />
        </View>
    );
};

export default Service;

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
        backgroundColor: '#fff',
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
        color: '#1877F2',
    },
});
