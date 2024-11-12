import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Color';

const NewPostModal = ({ visible, onClose, onAddPost, avatarUri, username }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("Error picking image:", error);
            Alert.alert("Error", "Could not select image. Please try again.");
        }
    };

    const handleAddPost = () => {
        if (!selectedImage || !caption) {
            Alert.alert('Error', 'Please select an image and add a caption.');
            return;
        }

        onAddPost({
            id: Date.now(),
            username: username || 'Anonymous',
            time: 'Just now',
            content: caption,
            likes: 0,
            comments: 0,
            shares: 0,
            liked: false,
            avatar: avatarUri,
            image: selectedImage,
        });
        onClose();
        setSelectedImage(null);
        setCaption('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={onClose}>
                        <Ionicons name="chevron-back" size={20} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>New Post</Text>
                </View>

                <Text style={styles.captionLabel}>Upload Photo(s)</Text>
                <View style={styles.uploadContainer}>
                    <TouchableOpacity onPress={pickImage} style={styles.uploadBox}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                        ) : (
                            <>
                                <Image source={require('../../assets/images/UserProfile/upload.png')} style={styles.uploadIcon} />
                                <Text style={styles.uploadText}>Tap to upload from camera roll or files</Text>
                                <Text style={[styles.uploadText, { opacity: 0.8 }]}>Max file size 4MB</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <Text style={styles.captionLabel}>Caption</Text>
                <TextInput
                    style={styles.captionInput}
                    placeholder="Write Caption here"
                    placeholderTextColor="#888"
                    multiline
                    numberOfLines={4}
                    value={caption}
                    onChangeText={setCaption}
                />

                <TouchableOpacity style={styles.postButton} onPress={handleAddPost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default NewPostModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 78,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        position: 'relative',
        marginBottom: 48,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 50,
        backgroundColor: '#2F2F30',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -5,
        left: 0,
    },
    modalTitle: {
        color: Colors.white,
        fontFamily: "Open Sans",
        fontSize: 22,
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: 28,
    },
    uploadContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    uploadIcon: {
        marginBottom: 16,
    },
    uploadBox: {
        width: 343,
        height: 320,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    uploadText: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 22,
        opacity: 0.5,
    },
    captionLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    captionInput: {
        color: 'white',
        padding: 10,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#333',
        height: 100,
        textAlignVertical: 'top',
    },
    postButton: {
        backgroundColor: Colors.themeColor,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    postButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
});