import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ModalSelectItem from '../ModalSelectItem/ModalSelectItem';

import {
    faCaretDown,
    faChevronDown,
    faMagnifyingGlass,
    faRightToBracket,
    faPlus,
    onPress,
} from '@fortawesome/free-solid-svg-icons';

library.add(faRightToBracket, faMagnifyingGlass, faChevronDown, faCaretDown, faPlus);

const Header = ({
    filterItems,
    search,
    service_types = '',
    onSelectServiceType = null,
    provinces = '',
    onSelectProvince = null,
    onSelectSort = null,
    navigation,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [isServiceTypeModalVisible, setServiceTypeModalVisible] = useState(false);
    const [isProvinceModalVisible, setProvinceModalVisible] = useState(false);
    const [isSortModalVisible, setSortModalVisible] = useState(false);

    const sortOptions = [
        { id: 1, name: 'Tăng dần', value: 'price_asc' },
        { id: 2, name: 'Giảm dần', value: 'price_desc' },
    ];

    const handleSearchChange = (text) => {
        setSearchValue(text);
        search(text);
    };

    return (
        <View style={styles.header}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm..."
                    value={searchValue}
                    onChangeText={handleSearchChange}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => {
                        if (search) {
                            search(searchValue);
                        }
                    }}
                >
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" size={24} color="#124f9f" />
                </TouchableOpacity>
            </View>

            <View style={styles.filterContainer}>
                {filterItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            style={styles.filterItem}
                            onPress={() => {
                                if (item.label === 'Tỉnh/TP') {
                                    setProvinceModalVisible(true);
                                }
                                if (item.label === 'Loại hình') {
                                    setServiceTypeModalVisible(true);
                                }
                                if (item.label === 'Xếp theo') {
                                    setSortModalVisible(true);
                                }
                                if (item.label === 'Thêm') {
                                    navigation.navigate('CreateService');
                                }
                            }}
                        >
                            <View style={styles.filterContent}>
                                <Text style={styles.filterText}>{item.label}</Text>
                                {item.icon && <FontAwesomeIcon icon={item.icon} size={20} color="#fff" />}
                            </View>
                        </TouchableOpacity>
                        {index < filterItems.length - 1 && <Text style={styles.separator}>|</Text>}
                    </React.Fragment>
                ))}
            </View>

            <ModalSelectItem
                visible={isServiceTypeModalVisible}
                onClose={() => setServiceTypeModalVisible(false)}
                items={service_types}
                onSelect={(item) => {
                    onSelectServiceType(item);
                    setServiceTypeModalVisible(false);
                }}
            />

            <ModalSelectItem
                visible={isProvinceModalVisible}
                onClose={() => setProvinceModalVisible(false)}
                items={provinces}
                onSelect={(item) => {
                    onSelectProvince(item);
                    setProvinceModalVisible(false);
                }}
            />

            <ModalSelectItem
                visible={isSortModalVisible}
                onClose={() => setSortModalVisible(false)}
                items={sortOptions}
                onSelect={(item) => {
                    onSelectSort(item);
                    setSortModalVisible(false);
                }}
            />
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'column',
        height: 160,
        backgroundColor: '#1877F2',
        marginBottom: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 28,
        paddingHorizontal: 16,
        marginHorizontal: 20,
        height: 48,
        marginTop: 16,
    },
    searchInput: {
        width: 300,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        backgroundColor: '#fff',
        color: '#4E4B66',
        borderRadius: 28,
    },
    searchButton: {
        paddingLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    filterItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    filterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterText: {
        color: '#fff',
        fontSize: 14,
    },
    separator: {
        color: '#fff',
        fontSize: 18,
    },
});
