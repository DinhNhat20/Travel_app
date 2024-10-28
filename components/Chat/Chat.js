import { StyleSheet } from 'react-native';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, orderBy, query, onSnapshot, doc, setDoc, getDocs, where } from 'firebase/firestore';
import { database } from '../../configs/Firebase';
import { MyUserContext } from '../../configs/Context';

const Chat = ({ route }) => {
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const navigation = useNavigation();
    const user = useContext(MyUserContext);
    const { user2 } = route.params;

    // Hàm kiểm tra hoặc tạo cuộc hội thoại
    const createOrFindConversation = useCallback(async () => {
        try {
            const conversationsRef = collection(database, 'conversations');

            // Tìm xem đã có cuộc hội thoại giữa user.id và user2 chưa
            const q = query(
                conversationsRef,
                where('users', 'array-contains', user.id), // tìm các cuộc hội thoại mà user.id là 1 trong 2 người tham gia
            );

            const querySnapshot = await getDocs(q);
            let foundConversation = null;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.users.includes(user2)) {
                    foundConversation = { id: doc.id, ...data };
                }
            });

            // Nếu đã có cuộc hội thoại, sử dụng cuộc hội thoại đó
            if (foundConversation) {
                setConversationId(foundConversation.id);
                loadMessages(foundConversation.id);
            } else {
                // Nếu chưa, tạo một cuộc hội thoại mới
                const newConversation = await addDoc(conversationsRef, {
                    users: [user.id, user2], // Lưu danh sách user tham gia cuộc hội thoại
                    createdAt: new Date(),
                });
                setConversationId(newConversation.id);
            }
        } catch (error) {
            console.error('Error finding or creating conversation:', error);
        }
    }, [user.id, user2]);

    // Hàm tải tin nhắn từ cuộc hội thoại đã có
    const loadMessages = (conversationId) => {
        const messagesRef = collection(database, 'conversations', conversationId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
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
    };

    useLayoutEffect(() => {
        createOrFindConversation();
    }, [createOrFindConversation]);

    // Hàm gửi tin nhắn mới
    const onSend = useCallback(
        (messages = []) => {
            if (!conversationId) return;

            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));

            const { _id, createdAt, text, user } = messages[0];
            const messagesRef = collection(database, 'conversations', conversationId, 'messages');

            addDoc(messagesRef, {
                _id,
                createdAt,
                text,
                user,
            });
        },
        [conversationId],
    );

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
