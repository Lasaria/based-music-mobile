import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { tokenManager } from '../../utils/tokenManager';
import { UserService } from '../../services/UserService';
import { Colors } from '../../constants/Color';


const LIMIT = 87600.1;
// const LIMIT = 1;

const EditProfileScreen = ({ name, setName, coverImageUri, setCoverImageUri, avatarUri, onCancel, currentUsername, description, setDescription, lastUpdatedUsername, defaultCover, defaultProfile, openEditProfilePhotosScreen }) => {
    const [isUsernameDisabled, setIsUsernameDisabled] = useState(false);
    const [username, setUsername] = useState(currentUsername);
    const [tempCoverImageUri, setTempCoverImageUri] = useState(null); // Add temporary state
    const [timeLeftToChange, setTimeLeftToChange] = useState("");
    const [saveEnabled, setSaveEnabled] = useState(false);  // Track if "Save" button should be enabled
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [errors, setErrors] = useState({});

    // Store initial values in refs for comparison
    const initialNameRef = useRef(name);
    const initialUsernameRef = useRef(currentUsername);
    const initialDescriptionRef = useRef(description);
    const initialCoverImageUriRef = useRef(tempCoverImageUri);

    // Check if any field has changed from its initial value
    const checkChanges = () => {
        if (
            name !== initialNameRef.current ||
            username !== initialUsernameRef.current ||
            description !== initialDescriptionRef.current ||
            tempCoverImageUri !== initialCoverImageUriRef.current
        ) {
            setSaveEnabled(true);
        } else {
            setSaveEnabled(false);
        }
    };

    // Call checkChanges whenever the relevant fields update
    useEffect(() => {
        checkChanges();
    }, [name, username, description, tempCoverImageUri]);

    const calculateTimeRemaining = (lastUpdatedTime) => {
        const currentTime = new Date();
        const lastUpdateTime = new Date(lastUpdatedTime);
        const timeDifference = LIMIT * 60 * 1000 - (currentTime - lastUpdateTime); // Time remaining in milliseconds

        if (timeDifference <= 0) {
            return { canChange: true, message: "" };
        }

        let message = "You can change your username again after ";
        const totalMinutes = Math.ceil(timeDifference / (60 * 1000));
        const days = Math.floor(totalMinutes / 1440); // 1440 minutes in a day
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        // For days 
        if (LIMIT >= 1440) {
            if (days > 0) {
                message += `${days} day${days > 1 ? 's' : ''}.`;
            } else if (hours > 0) {
                message += `${hours} hour${hours > 1 ? 's' : ''}.`;
            } else {
                message += `${Math.max(1, minutes)} minute${minutes > 1 ? 's' : ''}.`;
            }
        }
        // For hours
        else if (LIMIT >= 60) {
            const totalHours = Math.floor(totalMinutes / 60);
            if (totalHours > 0) {
                message += `${totalHours} hour${totalHours > 1 ? 's' : ''}.`;
            } else {
                message += `${Math.max(1, minutes)} minute${minutes > 1 ? 's' : ''}.`;
            }
        }
        // For minutes
        else {
            message += `${Math.max(1, totalMinutes)} minute${totalMinutes > 1 ? 's' : ''}.`;
        }

        return { canChange: false, message };
    };

    // Update the useEffect hook
    useEffect(() => {
        const checkUsernameUpdateTime = () => {
            if (lastUpdatedUsername) {
                const result = calculateTimeRemaining(lastUpdatedUsername);
                setIsUsernameDisabled(!result.canChange);
                setTimeLeftToChange(result.message);
            }
        };

        checkUsernameUpdateTime();
        // Set up an interval to update the countdown every minute
        const interval = setInterval(checkUsernameUpdateTime, 60000);

        return () => clearInterval(interval);
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
                setTempCoverImageUri(imageUri); // Set the local URI for preview only
                console.log('Selected local cover image URI (preview only):', imageUri);
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
            // Basic validation checks
            if (username !== currentUsername && isUsernameDisabled) {
                alert('You can only update your username every 2 months. Please wait.');
                return;
            }

            if (username !== currentUsername && !isValidUsername(username)) {
                alert('Username must be at least 6 characters long and can contain letters, numbers, underscores, and periods only.');
                return;
            }

            const lowercaseNewUsername = username.toLowerCase();
            const lowercaseCurrentUsername = currentUsername.toLowerCase();

            if (lowercaseNewUsername !== lowercaseCurrentUsername) {
                console.log("Checking availability for new username:", username);
                const isAvailable = await UserService.checkUsernameAvailability(username);
                console.log("Username availability for", username, ":", isAvailable);

                if (!isAvailable) {
                    alert('Username is already taken. Please choose a different one.');
                    return;
                }
            } else {
                console.log("Username is unchanged, skipping availability check.");
            }

            const userId = await tokenManager.getUserId();
            const token = await tokenManager.getAccessToken();

            let coverImageUrl = coverImageUri; // Default to existing URI if no new image selected

            // Upload to S3 if a new cover image was selected
            if (tempCoverImageUri && tempCoverImageUri !== coverImageUri) {
                const formData = new FormData();
                formData.append('coverImage', {
                    uri: tempCoverImageUri,
                    name: `cover-${Date.now()}.jpg`,
                    type: 'image/jpeg',
                });
                const response = await UserService.updateUserCoverImage(userId, formData);
                coverImageUrl = response.cover_image_url; // Update cover image URI to the new S3 URL
                console.log('Cover image updated successfully:', coverImageUrl);
            }

            const profileData = {
                display_name: name,
                description: description,
                username: username,
                cover_image_url: coverImageUrl, // Use the updated S3 URL or existing URL
            };

            console.log('Data to be updated:', profileData);

            const response = await UserService.updateUserProfile({
                userId: userId,
                ...profileData,
                token: token
            });

            if (profileData) {
                alert('Profile updated successfully!');
                setCoverImageUri(coverImageUrl); // Update state with the new cover image URI if changed
                onCancel(); // Navigate back or close the screen after saving
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

    const maxDescriptionLength = 120;

    const toggleEditing = (platform) => {
        setEditing((prev) => ({ ...prev, [platform]: !prev[platform] }));
    };

    const handleUsernameChange = async (text) => {
        setUsername(text);
        setUsernameAvailable(null);
        setLoading(true);
        setSuggestions([]);
        setErrors({}); // Clear previous errors

        // Skip the check if the username matches the current one
        if (text === currentUsername) {
            setUsernameAvailable(true);
            setLoading(false);
            return;
        }

        // Validating username length
        if (text.length < 6) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                length: "Username must be at least 6 characters long.",
            }));
            setLoading(false);
            return;
        }

        // Validating allowed characters (letters, numbers, underscores, and periods)
        if (!/^[a-zA-Z0-9._]+$/.test(text)) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                format: "Username can only contain letters, numbers, underscores, and periods.",
            }));
            setLoading(false);
            return;
        }

        try {
            const isAvailable = await UserService.checkUsernameAvailability(text, true);
            setUsernameAvailable(isAvailable);

            // If not available, generate suggestions
            if (!isAvailable) {
                const generatedSuggestions = await generateUsernameSuggestions(text);
                setSuggestions(generatedSuggestions);
            }
        } catch (error) {
            console.error('Error checking username availability:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateUsernameSuggestions = async (baseUsername) => {
        const suggestions = [];
        for (let i = 0; i < 5; i++) {
            const suggestedUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
            const isAvailable = await UserService.checkUsernameAvailability(suggestedUsername);
            if (isAvailable) {
                suggestions.push(suggestedUsername);
            }
        }
        return suggestions;
    };

    const handleUsernameSelect = (suggestion) => {
        setUsername(suggestion);
        setUsernameAvailable(true);
        setSuggestions([]);
    };


    const handleRemoveLink = (platform) => {
        setLinks((prev) => ({ ...prev, [platform]: '' }));
        setEditing((prev) => ({ ...prev, [platform]: false }));
    };

    const handleDescriptionChange = (text) => {
        if (text.length <= maxDescriptionLength) {
            setDescription(text);
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
                <TouchableOpacity onPress={handleSaveChanges} disabled={!saveEnabled} style={styles.saveButton}>
                    <Text style={[styles.saveButtonText, { opacity: saveEnabled ? 1 : 0.5 }]}>Save</Text>
                </TouchableOpacity>
            </View>


            <ScrollView contentContainerStyle={styles.content}>
                {/* Cover Image Container */}
                <View style={styles.coverImageContainer}>
                    <Image
                        source={{ uri: tempCoverImageUri || coverImageUri || defaultCover }}
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
                            onChangeText={(text) => { setName(text); checkChanges(); }}
                        />
                        {name.length > 0 && (
                            <TouchableOpacity onPress={() => setName('')} style={styles.clearIcon}>
                                <Ionicons name="close-circle" size={20} color="#888" />
                            </TouchableOpacity>
                        )}
                    </View>


                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your username"
                            placeholderTextColor="#888"
                            value={username}
                            onChangeText={handleUsernameChange}
                            editable={!isUsernameDisabled}
                            autoCapitalize='none'
                        />
                        {loading ? (
                            <ActivityIndicator size="small" color={Colors.secondary} style={styles.suggestionIcon} />
                        ) : usernameAvailable === true && username.length > 0 && username !== currentUsername ? (
                            <Ionicons name="checkmark-circle-outline" size={26} color="green" style={styles.suggestionIcon} />
                        ) : null}
                    </View>
                    {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}
                    {errors.format && <Text style={styles.errorText}>{errors.format}</Text>}
                    {!isUsernameDisabled && usernameAvailable !== false && !errors.length && !errors.format && (
                        <Text style={[styles.restrictionMessage, { color: Colors.white, opacity: 0.7, marginBottom: 18 }]}>
                            You can change your username once every 2 months.
                        </Text>
                    )}
                    {usernameAvailable === false && (
                        <Text style={styles.errorText}>The username {username} is not available.</Text>
                    )}
                    {suggestions.length > 0 && (
                        <View style={styles.suggestionsContainer}>
                            {suggestions.map((suggestion, index) => (
                                <View key={index}>
                                    <TouchableOpacity
                                        onPress={() => handleUsernameSelect(suggestion)}
                                        style={styles.suggestionItem}
                                    >
                                        <Text style={styles.suggestionText}>{suggestion}</Text>
                                        <Ionicons name="checkmark-circle-outline" size={26} color="green" />
                                    </TouchableOpacity>
                                    {index < suggestions.length - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    )}
                    {timeLeftToChange && isUsernameDisabled && (
                        <Text style={styles.restrictionMessage}>
                            {timeLeftToChange}
                        </Text>
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

                    {/* Description Section */}
                    <Text style={styles.label}>Description</Text>
                    <View style={styles.descriptionContainer}>
                        <TextInput
                            style={styles.descriptionInput}
                            autoCapitalize='none'
                            placeholder="Write something about yourself..."
                            placeholderTextColor="#888"
                            multiline
                            maxLength={maxDescriptionLength}
                            value={description}
                            onChangeText={handleDescriptionChange}
                            scrollEnabled
                            showSoftInputOnFocus={false}
                        />
                        <Text style={styles.charCount}>{description.length} / {maxDescriptionLength}</Text>
                    </View>
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
    saveButton: {
        marginRight: 15,
        padding: 10,
        borderRadius: 5,
        position: 'absolute',
        top: 64,
        right: -6, // Adjust based on desired padding
    },
    saveButtonText: {
        color: Colors.white,
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
    content: {
        paddingHorizontal: 20,
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
    suggestionIcon: {
        position: 'absolute',
        right: 14,
        top: '50%',
        transform: [{ translateY: -24 }],
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
        right: 14,
        top: 20,
    },
    clearUserIcon: {
        position: 'absolute',
        top: 20,
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 12,
        marginTop: -26,
        marginBottom: 14
    },
    suggestionsContainer: {
        backgroundColor: '#212324',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        marginVertical: 4,
    },
    suggestionText: {
        color: Colors.white,
        marginHorizontal: 18,
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginHorizontal: 16,
    },
    restrictionMessage: {
        color: '#FF6347', // Red color for visibility
        fontSize: 12,
        marginTop: -24,
        marginBottom: 10,
        textAlign: 'left',
    },
    socialLinksContainer: {
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
    descriptionContainer: {
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        position: 'relative',
        borderWidth: 0.4,
        borderColor: '#CECECE'
    },
    descriptionInput: {
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
});

export default EditProfileScreen;






