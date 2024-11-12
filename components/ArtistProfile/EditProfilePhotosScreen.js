import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons, FontAwesome, Entypo, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../constants/Color';
import { tokenManager } from '../../utils/tokenManager';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL, AUTHSERVER_URL } from "@env";

// SERVER URL
const serverURL = SERVER_URL;

// DEFAULT PHOTO
const DEFAULT_PHOTO_URI = 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg';

const EditProfilePhotosScreen = ({ userId, photos, onSave, onCancel }) => {
    const [mainPhoto, setMainPhoto] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [localPhotos, setLocalPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [starredPhotoUri, setStarredPhotoUri] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);
    const [saveClicked, setSaveClicked] = useState(false);
    const [loading, setLoading] = useState(true);

    // FETCH ALL PHOTOS FROM S3
    const initializePhotos = async () => {
        setLoading(true); // Start loading
        try {
            const token = await tokenManager.getAccessToken();
            const response = await axios.get(`${serverURL}/users/${userId}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const mainPhotoUri = response.data.profile_image_url;
            setStarredPhotoUri(mainPhotoUri);

            console.log("Main photo URI from DynamoDB:", mainPhotoUri);

            let uniquePhotos = deduplicatePhotos(photos?.map(photo => ({
                ...photo,
                id: photo.id || generateUniqueId(),
            })) || []);

            console.log("Fetched photo URIs:", uniquePhotos?.map(photo => photo.uri));

            if (mainPhotoUri) {
                setMainPhoto(mainPhotoUri);
            } else if (uniquePhotos.length > 0) {
                setMainPhoto(uniquePhotos[0].uri);
            }

            setLocalPhotos([...uniquePhotos, ...createEmptySlots(uniquePhotos)]);
        } catch (error) {
            console.error("Failed to fetch main photo URI:", error);
            Alert.alert("Error", "Could not fetch main profile photo.");
        } finally {
            setLoading(false); // Loading is complete
        }
    };

    // SET UNIQUE ID
    const generateUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // MAKE EMPTY SLOT FOR PHOTO WHEN PHOTO IS REMOVED
    const createEmptySlots = (existingPhotos) => {
        const emptySlots = [];
        const remainingSlots = 6 - existingPhotos.length;
        for (let i = 0; i < remainingSlots; i++) {
            emptySlots.push({ id: `empty-${i}`, uri: null, isEmpty: true });
        }
        return emptySlots;
    };

    // FUNCTIONS TO CHECK DUPLICATE PHOTOS
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

    // SET MAIN PHOTO (PROFILE PHOTO)
    const handleSetMainPhoto = async (photo) => {
        if (!photo || !photo.uri) return;
        setMainPhoto(photo.uri);
        setStarredPhotoUri(photo.uri); // Mark this as the starred photo
        console.log('Starred photo set to:', photo.uri);
        await AsyncStorage.setItem('mainPhotoUri', photo.uri);
    };

    // FUNCTION TO REMOVE PHOTO FROM BOTH UI AND S3
    const handleRemovePhoto = async (photo) => {
        const updatedPhotos = localPhotos.filter(p => p.uri !== photo.uri && !p.isEmpty);
        setLocalPhotos([...updatedPhotos, ...createEmptySlots(updatedPhotos)]);

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

    // OPEN IMAGE PICKER TO SELECT PHOTO FROM GALLERY OR CAMERA
    const openImagePicker = async (source) => {
        // Request camera permissions if the source is the camera
        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Camera Permission", "Camera permission is required to use the camera.");
                return; // Exit the function if permission is not granted
            }
        }

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

                // Update newPhotos state
                setNewPhotos(prevPhotos => [...prevPhotos, newPhoto]);

                // Update localPhotos
                const updatedPhotos = [...localPhotos.filter((photo) => !photo.isEmpty), newPhoto];
                setLocalPhotos([...updatedPhotos, ...createEmptySlots(updatedPhotos)]);

                // Set imagePicked flag
                setImagePicked(true);
                console.log('Image picked, setting imagePicked to true');
            }
        }
        setModalVisible(false);
    };

    // SAVE PHOTO(S) AFTER CHANGES
    const handleSavePhotos = async () => {
        console.log('Save clicked - Current states:', {
            imagePicked,
            saveClicked: true,
            newPhotosLength: newPhotos.length
        });

        setSaveClicked(true);
        let s3UploadSuccess = false; // Track if S3 upload was successful

        // Handle S3 upload for new photos
        if (imagePicked && newPhotos.length > 0) {
            try {
                console.log('Attempting S3 upload...');
                const token = await tokenManager.getAccessToken();

                const formData = new FormData();
                newPhotos.forEach((photo) => {
                    formData.append("profileImages", {
                        uri: photo.uri,
                        name: `profile-image-${Date.now()}.jpg`,
                        type: "image/jpeg",
                    });
                });

                console.log('Uploading to S3:', formData);
                const s3Response = await axios.post(
                    `${serverURL}/users/${userId}/profile-images`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        },
                    }
                );

                console.log('S3 upload successful:', s3Response.data);
                s3UploadSuccess = true; // Mark S3 upload as successful
                onSave(s3Response.data.images);

                // Show alert for successful S3 upload
                Alert.alert("Success", "Successfully added new photo!");

            } catch (error) {
                console.error('S3 upload failed:', error);
                Alert.alert("Error", "Failed to save photos to S3.");
                return;
            }
        }

        // Handle DynamoDB update
        try {
            const token = await tokenManager.getAccessToken();
            const dynamoDBData = {
                userId: userId,
                mainPhotoUri: mainPhoto,
            };

            console.log('Updating DynamoDB with:', dynamoDBData);
            const dynamoDBResponse = await axios.patch(
                `${serverURL}/users/${userId}/profile`,
                dynamoDBData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('DynamoDB update successful:', dynamoDBResponse.data);

            // Show alert for DynamoDB update only if no S3 upload was performed
            if (!s3UploadSuccess) {
                Alert.alert("Success", "Profile Photo set successfully!");
            }
        } catch (error) {
            console.error('DynamoDB update failed:', error);
            Alert.alert("Error", "Failed to update main photo in DynamoDB.");
        }

        // Reset states after all operations
        onCancel(); // Close the screen (same as Cancel behavior)
        setImagePicked(false);
        setSaveClicked(false);
        setNewPhotos([]);
    };

    // FUNCTION TO CANCEL AND RETURN TO ARTIST PROFILE SCREEN
    const handleCancel = () => {
        setImagePicked(false); // Reset picked flag on cancel
        setSaveClicked(false); // Reset save flag on cancel
        onCancel(); // Cancel without uploading
    };

    useEffect(() => {
        console.log('IMAGE PICKED ', imagePicked);
        console.log('SAVE CLICKED ', saveClicked);

        initializePhotos();
    }, [photos]);

    // LOADER
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.white} />
            </View>
        );
    }

    // RENDER PHOTOS ON PHOTO EDIT SCREEN 
    const renderPhotoItem = ({ item }) => {
        if (!item) {
            console.log("Item is undefined or null");
            return null;
        }

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
            <View style={styles.photoContainer}>
                <Image source={{ uri: item.uri || DEFAULT_PHOTO_URI }} style={styles.photo} />
                <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemovePhoto(item)}>
                    <AntDesign name="minuscircleo" size={20} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.starIcon} onPress={() => handleSetMainPhoto(item)}>
                    <FontAwesome name="star" size={20} color={starredPhotoUri === item.uri ? 'gold' : 'gray'} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.roundButton} onPress={() => onCancel()}>
                    <Ionicons name="chevron-back" size={20} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit Profile Photo</Text>
                <Ionicons name="eye" size={24} color={Colors.white} />
            </View>

            {/* MAIN PHOTO */}
            <View style={styles.mainPhotoContainer}>
                <Image source={{ uri: mainPhoto || DEFAULT_PHOTO_URI }} style={styles.mainPhoto} />
                <FontAwesome name="star" size={24} color="gold" style={styles.mainPhotoStar} />
            </View>

            {/* PHOTO GRID */}
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

            {/* FOOTER */}
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
        marginBottom: 48,
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