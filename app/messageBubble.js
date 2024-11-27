import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ message, isOwnMessage }) => {
    // console.log("MessageBubble received message:", message);

    const getTimeString = () => {
        if (!message.timestamp) return '';
        try {
            return new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return '';
        }
    };

    return (
        <View style={[
            styles.container,
            isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}>
            <View style={[
                styles.bubble,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                <Text style={[
                    styles.messageText,
                    isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                ]}>
                    {message.content || ''}
                </Text>
                {message.timestamp && (
                    <Text style={[
                        styles.timestamp,
                        isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
                    ]}>
                        {getTimeString()}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        marginVertical: 2,
    },
    ownMessageContainer: {
        alignItems: 'flex-end',
    },
    otherMessageContainer: {
        alignItems: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 20,
    },
    ownMessage: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    otherMessage: {
        backgroundColor: '#E8E8E8',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        marginBottom: 4,
    },
    ownMessageText: {
        color: '#FFFFFF',
    },
    otherMessageText: {
        color: '#000000',
    },
    timestamp: {
        fontSize: 11,
        opacity: 0.7,
        alignSelf: 'flex-end',
    },
    ownTimestamp: {
        color: '#FFFFFF',
    },
    otherTimestamp: {
        color: '#666666',
    }
});

export default MessageBubble;