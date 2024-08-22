import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ActivityIndicator, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPhone, faInfo, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { MyUserContext } from '../../configs/Context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatBox = ({ route }) => {
    const user = useContext(MyUserContext);
    const { providerId } = route.params;

    const [provider, setProvider] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    const chatRef = firestore().collection('chats').doc(providerId).collection('messages');

    const loadProvider = async () => {
        try {
            let token = await AsyncStorage.getItem('token');
            let res = await authAPI(token).get(`${endpoint['providers']}?user=${providerId}`);
            setProvider(res.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (message.trim()) {
            const newMessage = {
                text: message,
                createdAt: new Date(),
                userId: auth().currentUser.uid,
                providerId: providerId,
            };
            await chatRef.add(newMessage);
            setMessage('');
        }
    };

    useEffect(() => {
        loadProvider();

        const unsubscribe = chatRef.orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
            const messages = snapshot.docs.map((doc) => doc.data());
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [providerId]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#1877F2" style={styles.loader} />
            ) : (
                <>
                    <View style={styles.headerContainer1}>
                        <View style={styles.headerContainer}>
                            <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            <Text style={styles.userName}>{provider.name}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faPhone} size={24} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faInfo} size={24} style={styles.icon} />
                            </TouchableOpacity>
                            <View style={styles.separator} />
                        </View>
                    </View>
                    <FlatList
                        data={messages}
                        renderItem={({ item }) => (
                            <View style={styles.messageContainer}>
                                <Text style={styles.messageText}>{item.text}</Text>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        inverted
                    />
                    <View style={styles.footer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <FontAwesomeIcon icon={faPaperPlane} size={24} style={styles.sendIcon} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
};

export default ChatBox;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 54,
        height: 54,
        marginRight: 12,
        borderRadius: 27,
    },
    userName: {
        fontSize: 16,
        color: '#333',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#1877F2',
        borderRadius: 50,
        padding: 6,
        margin: 6,
    },
    icon: {
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingLeft: 16,
        paddingRight: 40,
    },
    sendButton: {
        position: 'absolute',
        right: 10,
        padding: 10,
    },
    sendIcon: {
        color: '#1877F2',
    },
    messageContainer: {
        padding: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 10,
        marginBottom: 5,
        marginHorizontal: 10,
    },
    messageText: {
        fontSize: 16,
    },
});
