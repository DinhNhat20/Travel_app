import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import HeaderBase from '../HeaderBase/HeaderBase';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAngleLeft, faEllipsisVertical, faL } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import MessengerItem from './MessengerItem';

const Messenger = ({ route }) => {
    const navigation = useNavigation();
    const { props } = route.params;
    const [chatHistory, setChatHistory] = useState([
        {
            url: 'https://randomuser.me/api/portraits/men/90.jpg',
            showUrl: true,
            isSender: true,
            messenger: 'Hello',
            timestamp: 1641654238000,
        },
        {
            url: 'https://randomuser.me/api/portraits/men/90.jpg',
            showUrl: false,
            isSender: true,
            messenger: 'How are you?',
            timestamp: 1641654298000,
        },
        {
            url: 'https://randomuser.me/api/portraits/men/90.jpg',
            showUrl: false,
            isSender: true,
            messenger: 'How about your work?sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
            timestamp: 1641654538000,
        },
        {
            url: 'https://randomuser.me/api/portraits/men/80.jpg',
            showUrl: true,
            isSender: false,
            messenger: 'Yes',
            timestamp: 1641654598000,
        },
        {
            url: 'https://randomuser.me/api/portraits/men/80.jpg',
            showUrl: false,
            isSender: false,
            messenger: 'I am fine',
            timestamp: 1641654598000,
        },
        {
            url: 'https://randomuser.me/api/portraits/men/90.jpg',
            showUrl: true,
            isSender: true,
            messenger: "Let's go out",
            timestamp: 1641654778000,
        },
    ]);

    return (
        <View style={{ flexDirection: 'column' }}>
            <HeaderBase
                leftIconName={faAngleLeft}
                rightIconName={faEllipsisVertical}
                onPressLeftIcon={() => {
                    navigation.goBack();
                }}
                onPressRightIcon={() => {
                    alert('press right icon');
                }}
            >
                {props.user.name}
            </HeaderBase>

            <FlatList
                style={{
                    backgroundColor: '#fff',
                }}
                data={chatHistory}
                renderItem={({ item }) => (
                    <MessengerItem
                        onPress={() => {
                            alert(`You press timestamp: ${item.timestamp}`);
                        }}
                        item={item}
                        key={`${item.timestamp}`}
                    />
                )}
            />
        </View>
    );
};

export default Messenger;

const styles = StyleSheet.create({
    icon: {
        padding: 12,
        margin: 10,
        color: 'black',
    },
});
