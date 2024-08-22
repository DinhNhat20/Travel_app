// ScheduleModal.js
import moment from 'moment';
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const ModalItem = ({ visible, onClose, schedules, onSelect }) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={schedules}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
                                    <Text>{moment(item.date).format('DD/MM/YYYY')}</Text>
                                </TouchableOpacity>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        />
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeModalText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default ModalItem;

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
    itemSeparator: {
        height: 1,
        backgroundColor: '#ccc',
        marginHorizontal: 20,
    },
    closeModalText: {
        marginTop: 20,
        fontSize: 16,
        color: '#1877F2',
        textAlign: 'center',
    },
});