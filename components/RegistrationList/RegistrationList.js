import { FlatList, StyleSheet, View } from 'react-native';
import React from 'react';

import HeaderBase from '../HeaderBase/HeaderBase';
import ButtonFooter from '../ButtonFooter/ButtonFooter';
import RegistrationItem from '../RegistrationItem/RegistrationItem';

const RegistrationList = () => {
    const registers = [
        { full_name: 'Nguyễn Văn A', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        { full_name: 'Nguyễn Văn B', phone: '0909868699', imageUrl: 'https://via.placeholder.com/100' },
        // Add more schedule data as needed
    ];

    return (
        <View style={styles.container}>
            <HeaderBase>Danh sách đăng ký</HeaderBase>
            <FlatList
                data={registers}
                renderItem={({ item }) => (
                    <RegistrationItem
                        register={item} // Truyền đối tượng schedule vào RegistrationItem
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.registerList}
            />
            <ButtonFooter>Xuất danh sách</ButtonFooter>
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
});
