// CustomModal.jsimport React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const ModalSelectItem = ({ visible, onClose, items, onSelect }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
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
        backgroundColor: '#fff',
        borderRadius: 8,
        width: '80%',
        padding: 16,
    },
    modalItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
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
        color: '#1877F2',
        textAlign: 'center',
    },
    serviceTypeText: {
        color: '#4E4B66',
    },
});

export default ModalSelectItem;
