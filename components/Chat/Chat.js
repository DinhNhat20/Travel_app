import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import moment from 'moment';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, orderBy, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../configs/Firebase';
import { MyUserContext } from '../../configs/Context';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const user = useContext(MyUserContext);

    useLayoutEffect(() => {
        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log('snapshot');
            setMessages(
                snapshot.docs.map((doc) => ({
                    _id: doc.id,
                    createdAt: doc.data().createdAt.toDate(),
                    text: doc.data().text,
                    user: doc.data().user,
                })),
            );
        });
        return unsubscribe;
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
        });
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{
                _id: user.id,
                avatar: user.avatar,
            }}
            messagesContainerStyle={{
                backgroundColor: '#fff',
            }}
        />
    );
};

export default Chat;

const styles = StyleSheet.create({});
