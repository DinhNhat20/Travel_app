import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { useNavigation } from '@react-navigation/native';

const ChatItem = (props) => {
    const navigation = useNavigation();
    let { name, url, message, numberOfUnReadMessage } = props.user;
    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Messenger', { props });
            }}
            style={[styles.parentContainer, styles.justifyContent]}
        >
            <View>
                <Image source={{ uri: url }} style={styles.image} />
                {numberOfUnReadMessage > 0 && (
                    <Text
                        style={{
                            backgroundColor: 'red',
                            color: '#fff',
                            position: 'absolute',
                            right: 8,
                            fontSize: 12,
                            borderRadius: 20,
                            paddingHorizontal: numberOfUnReadMessage > 9 ? 2 : 6,
                        }}
                    >
                        {numberOfUnReadMessage}
                    </Text>
                )}
            </View>
            <View style={styles.childrenContainer}>
                <Text style={MyStyles.text01}>{name}</Text>
                <Text style={MyStyles.textColor}>{message}</Text>
            </View>

            <View style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
            }}>
                <Text style={{fontSize: 10, color: '#717273'}}>5 phút trước</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
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
        width: 60,
        height: 60,
        marginRight: 16,
        borderRadius: 50,
    },
});
