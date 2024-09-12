import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import MyStyles from '../../styles/MyStyles';
import moment from 'moment';

const ScheduleItem = ({ date, max_participants, available, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.parentContainer, styles.justifyContent]}>
                <Text style={MyStyles.text01}>Ngày {moment(date).format('DD/MM/YYYY')}</Text>
                <View style={styles.childrenContainer}>
                    <FontAwesomeIcon icon={faUserGroup} size={24} style={[MyStyles.textColor, styles.icon]} />
                    <Text style={MyStyles.textColor}>
                        {available}/{max_participants} người
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ScheduleItem;

const styles = StyleSheet.create({
    parentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        margin: 12,
    },
    childrenContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
});
