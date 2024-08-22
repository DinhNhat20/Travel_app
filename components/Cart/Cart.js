import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import HeaderBase from '../HeaderBase/HeaderBase';
import CartItem from '../CartItem';
import ButtonFooter from '../ButtonFooter/ButtonFooter';

const Cart = () => {
    const services = [
        {
            id: '1',
            name: 'Service Name 1',
            location: 'Location',
            date: '12/08/2024',
            quantity: 2,
            total_price: '299.000',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: '2',
            name: 'Service Name 1',
            location: 'Location',
            date: '12/08/2024',
            quantity: 2,
            total_price: '299.000',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: '3',
            name: 'Service Name 1',
            location: 'Location',
            date: '12/08/2024',
            quantity: 2,
            total_price: '299.000',
            imageUrl: 'https://via.placeholder.com/100',
        },
        {
            id: '4',
            name: 'Service Name 1',
            location: 'Location',
            date: '12/08/2024',
            quantity: 2,
            total_price: '299.000',
            imageUrl: 'https://via.placeholder.com/100',
        },
    ];

    const renderServiceItem = ({ item }) => <CartItem service={item} />;

    return (
        <View style={styles.container}>
            <HeaderBase>Giỏ hàng</HeaderBase>
            <FlatList
                data={services}
                renderItem={renderServiceItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.serviceList}
            />
            <ButtonFooter secondary={true}>Thanh toán</ButtonFooter>
        </View>
    );
};

export default Cart;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    serviceList: {
        paddingBottom: 60,
    },
});
