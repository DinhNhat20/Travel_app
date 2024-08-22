import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MyStyles from '../../styles/MyStyles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const HeaderBase = ({ children, leftIconName, rightIconName, onPressLeftIcon, onPressRightIcon }) => {
    const leftIcon = leftIconName ? leftIconName : null;
    const rightIcon = rightIconName ? rightIconName : null;
    return (
        <View style={[MyStyles.primaryBackgroundColor, styles.HeaderBase]}>
            {leftIconName ? (
                <Pressable onPress={onPressLeftIcon}>
                    <FontAwesomeIcon icon={leftIconName} size={20} style={styles.icon} />
                </Pressable>
            ) : (
                <View></View>
            )}
            <Text style={styles.text}>{children}</Text>
            {rightIconName ? (
                <Pressable onPress={onPressRightIcon}>
                    <FontAwesomeIcon icon={rightIconName} size={20} style={styles.icon} />
                </Pressable>
            ) : (
                <View></View>
            )}
        </View>
    );
};

export default HeaderBase;

const styles = StyleSheet.create({
    HeaderBase: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        padding: 16,
        margin: 10,
        color: '#fff',
    },
});
