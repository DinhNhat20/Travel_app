import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Colors from '../../configs/Colors';

const ReviewItem = ({ review, formatDate }) => {
    return (
        <View style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
                <Image source={{ uri: review.customer_avatar }} style={styles.avatar} />
                <View style={styles.reviewInfo}>
                    <Text>{review.customer_name}</Text>
                    <View style={styles.starRating}>
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <FontAwesomeIcon
                                    key={i}
                                    icon="fa-star"
                                    size={20}
                                    color={i < review.rating ? Colors.star : '#ccc'}
                                />
                            ))}
                    </View>
                </View>
                <Text style={styles.reviewDate}>{formatDate(review.updated_date)}</Text>
            </View>
            {review.content ? <Text style={styles.reviewContent}>{review.content}</Text> : null}
            <View style={styles.separator} />
        </View>
    );
};

const styles = StyleSheet.create({
    reviewContainer: {
        marginTop: 16,
        marginBottom: 16,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewInfo: {
        flex: 1,
    },
    starRating: {
        flexDirection: 'row',
    },
    reviewDate: {
        color: Colors.gray,
    },
    reviewContent: {
        fontSize: 16,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginTop: 16,
    },
});

export default ReviewItem;
