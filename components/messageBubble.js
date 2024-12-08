import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MessageBubble = ({ message, isOwnMessage }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const screenWidth = Dimensions.get('window').width;

    const getTimeString = () => {
        if (!message.timestamp && !message.created_at) return '';
        try {
            const timestamp = message.timestamp || message.created_at;
            return new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error("Error formatting timestamp:", error);
            return '';
        }
    };

    const renderMedia = () => {
        if (!message.media_urls || message.media_urls.length === 0) return null;

        return (
            <View style={styles.mediaContainer}>
                {message.media_urls.map((url, index) => {
                    const isImage = url.match(/\.(jpg|jpeg|png|gif)$/i);
                    if (isImage) {
                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => setSelectedImage(url)}
                                style={styles.mediaWrapper}
                            >
                                <Image
                                    source={{ uri: url }}
                                    style={styles.mediaImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <TouchableOpacity 
                                key={index}
                                onPress={() => {/* Handle document open */}}
                                style={styles.documentContainer}
                            >
                                <Ionicons name="document" size={24} color="#666" />
                                <Text style={styles.documentText}>
                                    {url.split('/').pop()}
                                </Text>
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>
        );
    };

    return (
        <>
            <View style={[
                styles.container,
                isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
            ]}>
                <View style={[
                    styles.bubble,
                    isOwnMessage ? styles.ownMessage : styles.otherMessage,
                    message.media_urls?.length > 0 && styles.bubbleWithMedia
                ]}>
                    {message.content && (
                        <Text style={[
                            styles.messageText,
                            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                        ]}>
                            {message.content}
                        </Text>
                    )}
                    {renderMedia()}
                    <View style={styles.bottomContainer}>
                        <Text style={[
                            styles.timestamp,
                            isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp
                        ]}>
                            {getTimeString()}
                        </Text>
                        {isOwnMessage && (
                            <View style={styles.statusContainer}>
                                {message.delivered && (
                                    <Ionicons 
                                        name="checkmark-done" 
                                        size={16} 
                                        color={message.read ? "#34C759" : "#FFFFFF"} 
                                        style={styles.statusIcon}
                                    />
                                )}
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <Modal
                visible={!!selectedImage}
                transparent={true}
                onRequestClose={() => setSelectedImage(null)}
            >
                <TouchableOpacity 
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setSelectedImage(null)}
                >
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullScreenImage}
                        resizeMode="contain"
                    />
                    <TouchableOpacity 
                        style={styles.closeButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Ionicons name="close-circle" size={32} color="#FFF" />
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
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
    bubbleWithMedia: {
        padding: 8,
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
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 2,
    },
    timestamp: {
        fontSize: 11,
        opacity: 0.7,
    },
    ownTimestamp: {
        color: '#FFFFFF',
    },
    otherTimestamp: {
        color: '#666666',
    },
    statusContainer: {
        marginLeft: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIcon: {
        marginLeft: 2,
    },
    mediaContainer: {
        marginTop: 8,
        marginBottom: 4,
        gap: 8,
    },
    mediaWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    mediaImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f0f0f0',
    },
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 8,
        gap: 8,
    },
    documentText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    }
});

export default MessageBubble;