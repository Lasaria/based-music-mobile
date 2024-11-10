import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { tokenManager } from '../../utils/tokenManager';
import { UserService } from '../../services/UserService';
import { Colors } from '../../constants/Color';

const EditProfileScreen = ({ name, setName, coverImageUri, setCoverImageUri, avatarUri, onCancel, currentUsername, lastUpdatedUsername, defaultCover, defaultProfile, openEditProfilePhotosScreen }) => {
    const [isUsernameDisabled, setIsUsernameDisabled] = useState(false);
    const [username, setUsername] = useState(currentUsername);

    useEffect(() => {
        const checkUsernameUpdateTime = () => {
            if (lastUpdatedUsername) {
                const lastUpdateTime = new Date(lastUpdatedUsername);
                const currentTime = new Date();
                const timeDifference = (currentTime - lastUpdateTime) / 1000 / 60; // Convert to minutes

                // Restrict if the username was updated within the last 2 months (or based on your requirement)
                if (timeDifference < 87600) {
                    setIsUsernameDisabled(true);
                } else {
                    setIsUsernameDisabled(false);
                }
            }
        };

        checkUsernameUpdateTime();
    }, [lastUpdatedUsername, currentUsername]);



    const isValidUsername = (username) => {
        const regex = /^[a-zA-Z0-9._]{6,}$/; // Minimum 6 characters, letters, numbers, underscores, and periods only
        return regex.test(username);
    };

    // HANDLE FUNCTION TO OPEN IMAGE PICKER AND SELECT COVER IMAGE FOR ARTIST PROFILE
    const handleOpenCoverImagePicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissions Required', 'Please grant photo library permissions to upload an image.', [{ text: 'OK' }]);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            const imageUri = result.uri || (result.assets && result.assets[0].uri);
            if (imageUri) {
                setCoverImageUri(imageUri); // This must be defined in props
                console.log('Selected cover image URI:', imageUri);
            } else {
                console.log('Cover image URI not found');
            }
        } else {
            console.log('User cancelled image picker');
        }
    };

    const handleSaveChanges = async () => {
        console.log('Current Username:', currentUsername);
        console.log('Entered Username:', username);
        console.log('Is Username Disabled:', isUsernameDisabled);

        try {
            // Check if the username field is disabled due to 5-minute restriction
            if (username !== currentUsername && isUsernameDisabled) {
                alert('You can only update your username every 2 months. Please wait.');
                return;
            }

            // Validate username format if it has changed
            if (username !== currentUsername && !isValidUsername(username)) {
                alert('Username must be at least 6 characters long and can contain letters, numbers, underscores, and periods only.');
                return;
            }

            // Only check availability if username is changed to a different one than the current username
            if (username !== currentUsername) {
                console.log("Checking availability for new username:", username);
                const isAvailable = await UserService.checkUsernameAvailability(username);
                console.log("Username availability for", username, ":", isAvailable);

                if (!isAvailable) {
                    alert('Username is already taken. Please choose a different one.');
                    return; // Stop further execution if username is taken
                }
            } else {
                console.log("Username is unchanged, skipping availability check.");
            }

            // Proceed with updating the profile since all validations are passed
            const userId = await tokenManager.getUserId();
            const token = await tokenManager.getAccessToken();

            const profileData = {
                display_name: name,
                username: username,
                cover_image_url: coverImageUri || null,
            };

            console.log('Data to be updated:', profileData);

            const response = await UserService.updateUserProfile({
                userId: userId,
                ...profileData,
                token: token
            });

            if (profileData) {
                alert('Profile updated successfully!');
                onCancel()
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const [links, setLinks] = useState({
        instagram: '',
        tiktok: '',
        snapchat: '',
    });

    const [editing, setEditing] = useState({
        instagram: false,
        tiktok: false,
        snapchat: false,
    });

    const urlPrefixes = {
        instagram: 'www.instagram.com/',
        tiktok: 'www.tiktok.com/@',
        snapchat: 'www.snapchat.com/add/',
    };

    const [bio, setBio] = useState('');
    const maxBioLength = 75;

    const toggleEditing = (platform) => {
        setEditing((prev) => ({ ...prev, [platform]: !prev[platform] }));
    };

    const handleUsernameChange = (text, platform) => {
        setLinks((prev) => ({ ...prev, [platform]: text }));
        if (isUsernameDisabled) {
            alert("You can only update your username every 2 months. Please wait.");
            return;
        }
        setUsername(text);
    };

    const handleRemoveLink = (platform) => {
        setLinks((prev) => ({ ...prev, [platform]: '' }));
        setEditing((prev) => ({ ...prev, [platform]: false }));
    };

    const handleBioChange = (text) => {
        if (text.length <= maxBioLength) {
            setBio(text);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onCancel}>
                    <Ionicons name="chevron-back" size={20} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>


            <ScrollView contentContainerStyle={styles.content}>
                {/* Cover Image Container */}
                <View style={styles.coverImageContainer}>
                    <Image
                        source={{ uri: !!coverImageUri ? coverImageUri : defaultCover }}
                        style={styles.coverImage}
                    />
                    <TouchableOpacity style={[styles.editIconContainer, {
                        position: 'absolute',
                        right: 4,
                        top: 4,
                        backgroundColor: '#3a3b3d',
                        borderRadius: 24,
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }]} onPress={handleOpenCoverImagePicker}>
                        <Image
                            source={require('../../assets/images/UserProfile/edit.png')}
                            style={styles.editIcon}
                        />
                    </TouchableOpacity>
                    {/* Profile Image */}
                    <View style={styles.profileImageWrapper}>
                        <Image
                            source={{ uri: avatarUri ? avatarUri : defaultProfile }}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity style={styles.editIconContainer} onPress={() => {
                            openEditProfilePhotosScreen();
                            onCancel();
                        }}>
                            <Image
                                source={require('../../assets/images/UserProfile/edit.png')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Instruction Note */}
                <Text style={styles.noteText}>Tap pencil icon to edit your Avatar.</Text>

                <View style={styles.displayBox}>
                    {/* Input Fields */}
                    <Text style={styles.label}>Display Name</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your stage name"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            value={name}
                            onChangeText={setName}
                        />
                        {name.length > 0 && (
                            <TouchableOpacity onPress={() => setName('')} style={styles.clearIcon}>
                                <Ionicons name="close-circle" size={20} color="#888" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.label}> Username</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#888"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            editable={!isUsernameDisabled}
                        />
                        {!isUsernameDisabled && username.length > 0 && (
                            <TouchableOpacity onPress={() => setUsername('')} style={styles.clearIcon}>
                                <Ionicons name="close-circle" size={20} color="#888" />
                            </TouchableOpacity>
                        )}

                    </View>
                    {isUsernameDisabled && (
                        <Text style={styles.restrictionMessage}>You can only change your username once every 2 months.</Text>
                    )}
                    {/* Social Links Section */}
                    <Text style={styles.label}>Connected Accounts</Text>
                    <View style={styles.socialLinksContainer}>
                        {['instagram', 'tiktok', 'snapchat'].map((platform) => (
                            <View key={platform} style={styles.linkItem}>
                                <Ionicons
                                    name={
                                        platform === 'instagram'
                                            ? 'logo-instagram'
                                            : platform === 'tiktok'
                                                ? 'logo-tiktok'
                                                : 'logo-snapchat'
                                    }
                                    size={24}
                                    color="#fff"
                                    style={styles.icon}
                                />
                                <View style={styles.linkContent}>
                                    {editing[platform] ? (
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.urlPrefix}>{urlPrefixes[platform]}</Text>
                                            <TextInput
                                                style={styles.usernameInput}
                                                placeholder="username"
                                                autoCapitalize='none'
                                                placeholderTextColor="#888"
                                                value={links[platform]}
                                                onChangeText={(text) => handleUsernameChange(text, platform)}
                                            />
                                        </View>
                                    ) : (
                                        <Text style={styles.linkText}>
                                            {links[platform]
                                                ? `${platform.charAt(0).toUpperCase() + platform.slice(1)} connected`
                                                : `Tap to connect ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.linkActions}>
                                    {links[platform] ? (
                                        <TouchableOpacity onPress={() => toggleEditing(platform)}>
                                            <Ionicons name="checkmark-circle-outline" size={20} color="green" />
                                        </TouchableOpacity>
                                    ) : null}
                                    <TouchableOpacity
                                        onPress={() =>
                                            links[platform]
                                                ? handleRemoveLink(platform)
                                                : toggleEditing(platform)
                                        }
                                    >
                                        <Ionicons
                                            name={links[platform] ? 'close-circle-outline' : (editing[platform] ? 'remove-outline' : 'add')}
                                            size={20}
                                            color={links[platform] ? '#888' : '#888'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Bio Section */}
                    <Text style={styles.label}>Bio</Text>
                    <View style={styles.bioContainer}>
                        <TextInput
                            style={styles.bioInput}
                            autoCapitalize='none'
                            placeholder="Write something about yourself..."
                            placeholderTextColor="#888"
                            multiline
                            maxLength={maxBioLength}
                            value={bio}
                            onChangeText={handleBioChange}
                            scrollEnabled
                            showSoftInputOnFocus={false} // Optional: prevents keyboard if you're using custom input handling
                        />
                        <Text style={styles.charCount}>{bio.length} / {maxBioLength}</Text>
                    </View>
                </View>
                {/* Bottom Button */}
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity style={styles.bottomButton} onPress={handleSaveChanges}>
                        <Text style={styles.bottomButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 72, // Adjust this for safe area or use SafeAreaView
        paddingBottom: 10,
        backgroundColor: '#1e1f22',
        position: 'relative', // Allows absolute positioning of the title
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 50,
        backgroundColor: '#2F2F30',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 64,
        left: 15, // Adjust based on desired padding
    },
    headerTitle: {
        color: Colors.white,
        textAlign: 'center',
        fontFamily: 'Open Sans',
        fontSize: 20,
        fontStyle: 'normal',
        fontWeight: 'bold',
        lineHeight: 22,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    coverImageContainer: {
        height: 180,
        backgroundColor: '#2b2c30',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    profileImageWrapper: {
        position: 'absolute',
        bottom: -40,
        left: 20,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    noteText: {
        color: '#888',
        fontFamily: 'Open Sans',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
        marginTop: 4,
        textAlign: 'right'
    },
    editIconContainer: {
        position: 'absolute',
        right: 0,
        top: 2,
        backgroundColor: '#3a3b3d',
        borderRadius: 12,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    editIcon: {
        width: 15,
        height: 15,
    },
    displayBox: {
        backgroundColor: '#1e1f22',
        marginVertical: 50,
        padding: 20,
        paddingVertical: 36,
    },
    label: {
        color: '#888',
        fontFamily: 'Open Sans',
        fontSize: 14,
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
    },
    inputWrapper: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#2b2c30',
        borderRadius: 5,
        // paddingHorizontal: 10,
        // marginBottom: 20,
    },
    input: {
        // backgroundColor: '#2b2c30',
        color: '#fff',
        borderRadius: 5,
        padding: 15,
        marginTop: 5,
        marginBottom: 30,
        borderWidth: 0.4,
        flex: 1,
        borderColor: '#CECECE'
    },
    clearIcon: {
        position: 'absolute',
        right: 14, // Position the icon inside the input field on the right
        top: 18,
    },
    restrictionMessage: {
        color: '#FF6347', // Red color for visibility
        fontSize: 12,
        marginTop: -20,
        marginBottom: 10,
        textAlign: 'left',
    },
    socialLinksContainer: {
        // backgroundColor: '#2b2c30',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 30,
        borderWidth: 0.4,
        borderColor: '#CECECE'
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    icon: {
        color: '#888',
        marginRight: 10,
    },
    linkContent: {
        flex: 1,
    },
    linkText: {
        color: '#888',
        fontSize: 15,
    },
    linkActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        flex: 1,
    },
    urlPrefix: {
        color: '#888',
        // paddingLeft: 10,
    },
    usernameInput: {
        color: '#888',
        marginRight: 10,
        flex: 1,
    },
    bioContainer: {
        // backgroundColor: '#2b2c30',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        position: 'relative',
        borderWidth: 0.4,
        borderColor: '#CECECE'
    },
    bioInput: {
        color: '#fff',
        height: 80,
        textAlignVertical: 'top',
    },
    charCount: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        color: '#888',
        fontSize: 12,
    },
    bottomButtonContainer: {
        marginBottom: 100,
        borderTopColor: '#3a3b3d',
    },
    bottomButton: {
        backgroundColor: Colors.themeColor,
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    bottomButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;







