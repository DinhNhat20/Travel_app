import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Colors from '../../configs/Colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ModalSelectItem = ({ visible, onClose, items, onSelect }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <ScrollView>
                        {items &&
                            items.map((item, index) => (
                                <View key={item.id}>
                                    <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
                                        <Text style={styles.serviceTypeText}>
                                            {item.name ? item.name : `Giảm ${item.discount}%`}
                                        </Text>
                                    </TouchableOpacity>
                                    {index < items.length - 1 && <View style={styles.separator} />}
                                </View>
                            ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeModalText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: 8,
        width: '80%',
        maxHeight: SCREEN_HEIGHT / 2, // Giới hạn chiều cao tối đa là nửa màn hình
        padding: 16,
    },
    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
    },
    separator: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%',
    },
    closeModalText: {
        marginTop: 20,
        fontSize: 16,
        color: Colors.primary,
        textAlign: 'center',
    },
    serviceTypeText: {
        color: '#4E4B66',
    },
});

export default ModalSelectItem;
