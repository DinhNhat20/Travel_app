import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, orderBy, query, getDocs, where, limit } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { database } from '../../configs/Firebase';
import { MyUserContext } from '../../configs/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI, endpoint } from '../../configs/APIS';
import Colors from '../../configs/Colors';

const ChatList = () => {
    const [conversations, setConversations] = useState([]);
    const [profileMap, setProfileMap] = useState({});
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const user = useContext(MyUserContext);

    const loadProfileOfOtherUser = async (otherUserId) => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem('token');

            let url =
                user.role === 2
                    ? `${endpoint['customers']}?user=${otherUserId}`
                    : `${endpoint['providers']}?user=${otherUserId}`;

            let res = await authAPI(token).get(url);

            setProfileMap((prev) => ({
                ...prev,
                [otherUserId]: res.data[0],
            }));
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversations = async () => {
        setLoading(true);
        try {
            const conversationsRef = collection(database, 'conversations');
            const q = query(conversationsRef, where('users', 'array-contains', user.id));

            const snapshot = await getDocs(q);
            const conversationList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            // Tạo một mảng promises để lấy tin nhắn cuối cùng từ mỗi cuộc hội thoại
            const updatedConversations = await Promise.all(
                conversationList.map(async (conversation) => {
                    const messagesRef = collection(database, 'conversations', conversation.id, 'messages');
                    const qMessages = query(messagesRef, orderBy('createdAt', 'desc'), limit(1)); // Lấy tin nhắn cuối cùng

                    const messagesSnapshot = await getDocs(qMessages);
                    const lastMessage = messagesSnapshot.docs[0]?.data() || { text: 'Chưa có tin nhắn' };

                    return {
                        ...conversation,
                        lastMessage, // Gán tin nhắn cuối cùng vào cuộc hội thoại
                    };
                }),
            );

            setConversations(updatedConversations);

            // Load profiles of other users
            updatedConversations.forEach((conversation) => {
                const otherUserId = conversation.users.find((u) => u !== user.id);
                if (otherUserId && !profileMap[otherUserId]) {
                    loadProfileOfOtherUser(otherUserId);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            fetchConversations();
        }, []),
    );

    const renderItem = ({ item }) => {
        const otherUserId = item.users.find((u) => u !== user.id);
        const profile = profileMap[otherUserId] || {};

        const displayName = profile.name || profile.full_name || 'Unknown';
        const lastMessageText = item.lastMessage?.text || 'Chưa có tin nhắn';

        // Chỉ hiển thị giờ và phút từ timestamp của tin nhắn cuối cùng
        const timestamp = item.lastMessage?.createdAt
            ? new Date(item.lastMessage.createdAt.seconds * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
              })
            : '';

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => navigation.navigate('Chat', { user2: otherUserId, conversationId: item.id })}
            >
                <Text style={styles.usernameText}>{displayName}</Text>
                <View style={styles.messageRow}>
                    <Text style={styles.messageText} numberOfLines={1}>
                        {lastMessageText}
                    </Text>
                    <Text style={styles.timestampText}>{timestamp}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có cuộc hội thoại nào cả</Text>}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    conversationItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    usernameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    messageRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    messageText: {
        fontSize: 14,
        color: Colors.gray,
    },
    timestampText: {
        fontSize: 12,
        color: Colors.gray,
        marginLeft: 8, // Thêm khoảng cách giữa tin nhắn và thời gian
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: Colors.gray,
    },
});

export default ChatList;
