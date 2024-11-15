import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Color';
import { tokenManager } from '../../utils/tokenManager';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from "@env";
import { UserService } from '../../services/UserService';

// SERVER URL
const serverURL = SERVER_URL;

// DEFAULT PHOTO
const DEFAULT_PHOTO_URI = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

const EditProfilePhotosScreen = ({ userId, photos, setPhotos, onSave, onCancel }) => {
    const [mainPhoto, setMainPhoto] = useState(null); // Photo currently displayed in the main view
    const [profilePhotoUri, setProfilePhotoUri] = useState(null); // Photo marked as profile photo with the gold star
    const [localPhotos, setLocalPhotos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newPhotos, setNewPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initialize photos
    const initializePhotos = async () => {
        setLoading(true);
        try {
            const token = await tokenManager.getAccessToken();
            const response = await axios.get(`${serverURL}/users/${userId}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const profilePhotoUri = response.data.profile_image_url || DEFAULT_PHOTO_URI;
            setProfilePhotoUri(profilePhotoUri); // Set the saved profile photo
            setMainPhoto(profilePhotoUri); // Display the profile photo in the main view initially

            let uniquePhotos = deduplicatePhotos(photos.map(photo => ({
                ...photo,
                id: photo.id || generateUniqueId(),
            })));

            setLocalPhotos([...uniquePhotos, ...createEmptySlots(uniquePhotos)]);
        } catch (error) {
            console.error("Failed to fetch profile photo URI:", error);
            Alert.alert("Error", "Could not fetch profile photo.");
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
    const generateUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const createEmptySlots = (existingPhotos) => {
        const emptySlots = [];
        const remainingSlots = 6 - existingPhotos.length;
        for (let i = 0; i < remainingSlots; i++) {
            emptySlots.push({ id: `empty-${i}`, uri: null, isEmpty: true });
        }
        return emptySlots;
    };

    const deduplicatePhotos = (photosArray) => {
        const seen = new Set();
        return photosArray.filter(photo => {
            if (!photo || photo.isEmpty) return true;
            if (seen.has(photo.uri)) {
                return false;
            }
            seen.add(photo.uri);
            return true;
        });
    };

    // Update the displayed image in the main view when a photo is clicked
    const handleDisplayPhoto = (photo) => {
        if (!photo || !photo.uri) return;
        setMainPhoto(photo.uri); // Show the selected photo in the main view
    };


    // Set the profile photo (starred photo)
    const handleSetProfilePhoto = (photo) => {
        if (!photo || !photo.uri) return;
        setProfilePhotoUri(photo.uri); // Mark the selected photo as the profile photo
        setMainPhoto(photo.uri); // Display it as the main view as well
        AsyncStorage.setItem('mainPhotoUri', photo.uri);
    };

    // Function to fetch photos
    const fetchProfileImages = async () => {
        if (!userId) return;
        console.log("Fetching profile images...");
        try {
            const fetchedPhotos = await UserService.getProfileImages(userId);
            if (Array.isArray(fetchedPhotos) && fetchedPhotos.length > 0) {
                setPhotos(fetchedPhotos);
                console.log("Fetched photos from server:", fetchedPhotos);
            } else {
                setPhotos([]);
                console.log("No photos found.");
            }
        } catch (error) {
            console.error("Error fetching profile images:", error);
            setPhotos([]);
        }
    };

    useEffect(() => {
        fetchProfileImages();
    }, [userId])


    // Remove Photo
    const handleRemovePhoto = async (photo) => {
        const updatedPhotos = localPhotos.filter(p => p.uri !== photo.uri && !p.isEmpty);
        setLocalPhotos([...updatedPhotos, ...createEmptySlots(updatedPhotos)]);

        // Also remove the photo from newPhotos if it's present there
        setNewPhotos((prevNewPhotos) =>
            prevNewPhotos.filter((p) => p.uri !== photo.uri)
        );

        if (photo.uri === mainPhoto) {
            const newMainPhoto = updatedPhotos.length > 0 ? updatedPhotos[0].uri : null;
            setMainPhoto(newMainPhoto);
            if (newMainPhoto) {
                setStarredPhotoUri(newMainPhoto); // Update starred photo only if it is the one being deleted
                await AsyncStorage.setItem('mainPhotoUri', newMainPhoto);
            }
        }

        try {
            const imageKey = photo.uri.split('.com/')[1];
            const token = await tokenManager.getAccessToken();

            await axios.delete(`${serverURL}/users/${userId}/profile-images`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { imageKey },
            });

            Alert.alert("Success", "Photo removed successfully!");
        } catch (error) {
            console.error("Failed to delete photo:", error);
            Alert.alert("Error", "Failed to delete photo.");
        }
    };

    // Image Picker
    const openImagePicker = async (source) => {
        let result;
        if (source === 'gallery') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
        } else if (source === 'camera') {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
        }

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedPhotoUri = result.assets[0].uri;
            const isDuplicate = localPhotos.some((photo) => photo.uri === selectedPhotoUri);

            if (localPhotos.filter((p) => !p.isEmpty).length >= 6) {
                Alert.alert("Maximum Photos", "You can only upload up to 6 photos.");
                return;
            }

            if (!isDuplicate) {
                const newPhoto = { id: generateUniqueId(), uri: selectedPhotoUri };
                setNewPhotos(prevPhotos => [...prevPhotos, newPhoto]);

                const updatedPhotos = [...localPhotos.filter((photo) => !photo.isEmpty), newPhoto];
                setLocalPhotos([...updatedPhotos, ...createEmptySlots(updatedPhotos)]);
            }
        }
        setModalVisible(false);
    };

    // Save Photos
    const handleSavePhotos = async () => {
        try {
            const token = await tokenManager.getAccessToken();
            const dynamoDBData = { userId: userId, mainPhotoUri: profilePhotoUri };

            await axios.patch(
                `${serverURL}/users/${userId}/profile`,
                dynamoDBData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (newPhotos.length > 0) {
                const formData = new FormData();
                newPhotos.forEach((photo) => {
                    formData.append("profileImages", {
                        uri: photo.uri,
                        name: `profile-image-${Date.now()}.jpg`,
                        type: "image/jpeg",
                    });
                });

                await axios.post(
                    `${serverURL}/users/${userId}/profile-images`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        },
                    }
                );

                Alert.alert("Success", "Photos updated successfully!");
                onSave();
            }
        } catch (error) {
            console.error('Error updating photos:', error);
            Alert.alert("Error", "Failed to update photos.");
        }
        onCancel(); // Close the screen (same as Cancel behavior)
    };

    // Cancel and Reset
    const handleCancel = () => {
        onCancel();
    };

    useEffect(() => {
        initializePhotos();
    }, [photos]);

    // Render Photos in Grid
    const renderPhotoItem = ({ item }) => {
        if (item.isEmpty) {
            return (
                <TouchableOpacity
                    style={[styles.photoContainer, styles.emptyPhotoContainer]}
                    onPress={() => setModalVisible(true)}
                >
                    <View style={styles.addButtonContent}>
                        <Ionicons name="add" size={40} color={Colors.white} />
                        <Text style={styles.addPhotoText}>Add Photo</Text>
                    </View>
                </TouchableOpacity>
            );
        }

        return (
            <TouchableOpacity onPress={() => handleDisplayPhoto(item)} style={styles.photoContainer}>
                <Image source={{ uri: item.uri || DEFAULT_PHOTO_URI }} style={styles.photo} />
                <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemovePhoto(item)}>
                    <AntDesign name="minuscircleo" size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.starIcon} onPress={() => handleSetProfilePhoto(item)}>
                    <FontAwesome
                        name="star"
                        size={20}
                        color={profilePhotoUri === item.uri ? 'gold' : 'gray'}
                    />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.roundButton} onPress={() => onCancel()}>
                    <Ionicons name="chevron-back" size={20} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Profile Photo</Text>
                <Ionicons name="eye" size={24} color={Colors.white} />
            </View>

            {/* Main Display Photo */}
            <View style={styles.mainPhotoContainer}>
                <Image source={{ uri: mainPhoto || DEFAULT_PHOTO_URI }} style={styles.mainPhoto} />
                <TouchableOpacity style={styles.starIcon} onPress={handleSetProfilePhoto}>
                    <FontAwesome
                        name="star"
                        size={24}
                        color={profilePhotoUri === mainPhoto ? 'gold' : 'gray'}
                    />
                </TouchableOpacity>
            </View>

            {/* Photo Grid */}
            <FlatList
                data={localPhotos}
                renderItem={renderPhotoItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                style={styles.photoGrid}
                contentContainerStyle={styles.photoGridContent}
            />

            {/* MESSAGE INDICATOR WHICH ONE IS PROFILE PHOTO */}
            <View style={styles.mainPhotoIndicatorContainer}>
                <FontAwesome name="star" size={20} color={'gold'} />
                <Text style={styles.mainPhotoIndicator}>Main Profile Photo</Text>
            </View>

            {/* MODAL TO PICK OPTION DURING IMAGE PICKER */}
            <Modal transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Photo</Text>
                        <TouchableOpacity style={styles.modalOption} onPress={() => openImagePicker("gallery")}>
                            <Entypo name="images" size={24} color={Colors.white} />
                            <Text style={styles.optionText}>Upload from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalOption} onPress={() => openImagePicker("camera")}>
                            <MaterialCommunityIcons name="camera" size={24} color={Colors.white} />
                            <Text style={styles.optionText}>Take a Photo</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelModalButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelModalText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Footer with Save and Cancel */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSavePhotos}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingTop: 48,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: '#2F2F30',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    mainPhotoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    mainPhoto: {
        width: '100%',
        height: 275,
        borderRadius: 20,
    },
    mainPhotoStar: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    photoGrid: {
        flex: 1,
    },
    photoGridContent: {
        paddingVertical: 10,
    },
    photoContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
        maxWidth: '30%',
    },
    emptyPhotoContainer: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: {
        color: Colors.white,
        fontSize: 12,
        marginTop: 5,
    },
    photo: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    removeIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        borderRadius: 12,
        padding: 4,
    },
    starIcon: {
        position: 'absolute',
        top: 5,
        left: 5,
        borderRadius: 12,
        padding: 4,
    },
    mainPhotoIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
        marginLeft: 10,
        marginBottom: 56,
    },
    mainPhotoIndicator: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: "Open Sans",
        fontSize: 10,
        fontStyle: 'normal',
        fontWeight: '300',
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    saveButton: {
        flex: 1,
        backgroundColor: Colors.themeColor,
        paddingVertical: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        shadowColor: Colors.themeColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#2A2A2A',
        paddingVertical: 15,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        shadowColor: '#2A2A2A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 6,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#222',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    modalTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
    },
    cancelModalButton: {
        marginTop: 15,
    },
    cancelModalText: {
        color: Colors.white,
        fontSize: 16,
    },
});

export default EditProfilePhotosScreen;