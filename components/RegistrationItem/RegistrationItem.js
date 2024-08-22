import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import MyStyles from '../../styles/MyStyles';

const RegistrationItem = ({ register }) => {
    return (
        <View style={[styles.parentContainer, styles.justifyContent]}>
            <Image source={{ uri: register.imageUrl }} style={styles.image} />
            <View style={styles.childrenContainer}>
                <Text style={MyStyles.text01}>{register.full_name}</Text>
                <Text style={MyStyles.textColor}>{register.phone}</Text>
            </View>
        </View>
    );
};

export default RegistrationItem;

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        margin: 12,
    },
    childrenContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    icon: {
        marginRight: 8,
    },
    image: {
        width: 68,
        height: 68,
        marginRight: 20,
        borderRadius: 50,
    },
});
