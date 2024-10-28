import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import Colors from '../../configs/Colors';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    onFocus,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
}) => {
    return (
        <TextInput
            style={[styles.textInput, multiline && styles.textArea]}
            mode="outlined"
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={onFocus}
            multiline={multiline}
            numberOfLines={numberOfLines}
            secureTextEntry={secureTextEntry}
            theme={{
                colors: {
                    primary: Colors.secondary,
                    background: 'transparent', // Màu nền của input
                    text: Colors.secondary, // Màu chữ
                    placeholder: Colors.secondary, // Màu placeholder
                },
            }}
        />
    );
};

export default Input;

const styles = StyleSheet.create({
    textInput: {
        height: 54,
        paddingTop: 0,
        paddingHorizontal: 14,
        marginTop: 18,
        marginBottom: 12,
        borderRadius: 8,
        fontSize: 16,
        backgroundColor: Colors.white,
    },
    textArea: {
        height: 120, // Adjust the height as needed
        textAlignVertical: 'top', // Ensures the text starts from the top of the TextInput
    },
});
