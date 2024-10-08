import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import Colors from '../../configs/Colors';

const Button = ({
    primary = false,
    secondary = false,
    white = false,
    outline = false,
    text = false,
    rounded = false,
    disabled = false,
    small = false,
    large = false,
    backgroundColor = Colors.white, // Default background color to white
    textColor = Colors.primary, // Default text color to blue
    children,
    style,
    leftIcon,
    rightIcon,
    onPress,
    ...passProps
}) => {
    const buttonStyles = [
        styles.wrapper,
        { backgroundColor },
        primary && styles.primary,
        secondary && styles.secondary,
        white && styles.white,
        outline && styles.outline,
        text && styles.text,
        rounded && styles.rounded,
        small && styles.small,
        large && styles.large,
        disabled && styles.disabled,
        styles.margin,
        style,
    ];

    if (disabled) {
        return (
            <View style={buttonStyles}>
                {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
                <Text style={styles.title}>{children}</Text>
                {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
            </View>
        );
    }

    return (
        <TouchableOpacity style={buttonStyles} onPress={onPress} {...passProps}>
            {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
            <Text style={styles.title}>{children}</Text>
            {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        fontSize: 16,
        fontWeight: '700',
        padding: 9,
        borderRadius: 4,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    margin: {
        margin: 10,
    },
    icon: {
        width: 24,
        textAlign: 'center',
    },
    title: {
        color: Colors.white,
        marginHorizontal: 8,
    },
    disabled: {
        opacity: 0.5,
    },
    rounded: {
        borderRadius: 50,
        borderColor: '#DADADA',
    },
    primary: {
        color: Colors.white,
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    secondary: {
        color: Colors.white,
        backgroundColor: Colors.secondary,
        borderColor: Colors.secondary,
    },
    white: {
        color: Colors.primary,
        backgroundColor: Colors.white,
        borderColor: Colors.white,
    },
    outline: {
        color: '#FE2C55',
        borderColor: '#FE2C55',
    },
    text: {
        textDecorationLine: 'underline',
    },
    small: {
        width: 40,
        padding: 4,
    },
    large: {
        minWidth: 148,
        padding: 14,
    },
});

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    text: PropTypes.bool,
    rounded: PropTypes.bool,
    disabled: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    children: PropTypes.node.isRequired,
    style: PropTypes.object,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
    onPress: PropTypes.func,
};

export default Button;
