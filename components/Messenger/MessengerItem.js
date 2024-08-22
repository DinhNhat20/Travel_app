import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import { screenWidth } from '../../utilies/Device';

const MessengerItem = (props) => {
    const { onPress } = props;
    const { url, isSender, messenger, timestamp, showUrl } = props.item;
    return isSender == false ? (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 6,
            }}
        >
            {showUrl == true ? (
                <Image source={{ uri: url }} style={styles.image} />
            ) : (
                <View style={{ width: 40, height: 40, marginRight: 20 }}></View>
            )}
            <View
                style={{
                    width: screenWidth * 0.6,
                    flexDirection: 'row',
                }}
            >
                <View>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 12,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            borderRadius: 10,
                            backgroundColor: 'rgba(7, 161, 79, 0.1)',
                        }}
                    >
                        {messenger}
                    </Text>
                </View>
                <View style={{ width: 20 }}></View>
            </View>
        </TouchableOpacity>
    ) : (
        // isSender is true
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: 6,
            }}
        >
            <View
                style={{
                    width: screenWidth * 0.6,
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
            >
                <View style={{ width: 20 }}></View>
                <View>
                    <Text
                        style={{
                            color: 'black',
                            fontSize: 12,
                            paddingHorizontal: 8,
                            paddingVertical: 10,
                            borderRadius: 10,
                            backgroundColor: 'rgba(7, 161, 79, 0.1)',
                        }}
                    >
                        {messenger}
                    </Text>
                </View>
            </View>
            {showUrl == true ? (
                <Image source={{ uri: url }} style={styles.image} />
            ) : (
                <View style={{ width: 40, height: 40, marginRight: 20 }}></View>
            )}
        </TouchableOpacity>
    );
};

export default MessengerItem;

const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        marginRight: 20,
        borderRadius: 20,
    },
});
