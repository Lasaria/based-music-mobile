import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../../constants/Color';
import { Ionicons, Entypo, EvilIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import Music from '../../../components/ArtistProfile/Music';
import Events from '../../../components/ArtistProfile/Events';
import Posts from '../../../components/ArtistProfile/Posts';
import Dashboard from '../../../components/ArtistProfile/Dashboard';
import { ArtistService } from '../../../services/artistService';
import { tokenManager } from '../../../utils/tokenManager';
import * as ImagePicker from 'expo-image-picker';
import MusicPlayer from '../../../components/MusicPlayer';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';

// SERVER URL
const serverURL = 'http://localhost:3000';
// DEVICE ACTUAL WIDTH
const { width } = Dimensions.get('window');
// CONSTANT VALUE FOR IMAGE HEIGHT
const IMG_HEIGHT = 340;

const ArtistProfileScreen = () => {
  // ANIMATION STATES
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const translateY = useSharedValue(0);
  const overlayOpacity = useSharedValue(1); // For fading out overlay
  // DEFINE ALL TABS OPTONS
  const tabs = ['Music', 'Events', 'Posts', 'Dashboard'];
  // STATE FOR SELECTED TAB
  const [selectedTab, setSelectedTab] = useState('music');
  // SHARED VALUE FOR ANIMATION
  const tabTransition = useSharedValue(0);
  // FOR NAVIGATION BETWEEN SCREENS
  const navigation = useNavigation();

  // ARTIST PROFILE STATES
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarUri, setAvatarUri] = useState();
  const [coverImageUri, setCoverImageUri] = useState();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('');
  const [location, setLocation] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  // STATE FOR EDIT MODE
  const [isEditing, setIsEditing] = useState(false);

  // CHECK DESCRIPTION VHARACTER LIMIT
  const [remainingChars, setRemainingChars] = useState(25);

  // CACHE ALL THE VALUES
  const [originalName, setOriginalName] = useState('')
  const [originalGenre, setOriginalGenre] = useState('')
  const [originalProfileImage, setProfileImage] = useState('')
  const [originalCoverImage, setCoverImage] = useState('')

  // ENTER EDIT MODE
  const handleEnterEditMode = () => {
    setOriginalName(name);
    setOriginalGenre(genre);
    setProfileImage(avatarUri)
    setCoverImage(coverImageUri)
    setIsEditing(true);
  };

  // REVERT CHANGES IF USER CLICK CLOSE BUTTON
  const handleCloseEditing = () => {
    setIsEditing(false);
    setName(originalName);
    setGenre(originalGenre);
    setAvatarUri(originalProfileImage);
    setCoverImageUri(originalCoverImage);
  };
  //FUNCTION TO HNADLE LIMIT OF DESCRIPTION CHARACTERS BETWEEN 25.
  const handleGenreChange = (text) => {
    if (text.length <= 30) {
      setGenre(text); // Update genre value
      setRemainingChars(30 - text.length); // Update remaining characters count
    }
  };

  // FETCH ARTIST PROFILE FROM THE SERVER
  const fetchArtistProfile = async () => {
    try {
      const userId = await tokenManager.getUserId();
      const response = await ArtistService.getArtistProfile(userId);

      if (response) {
        setArtistData(response);

        // Update variable names to match new schema
        const profileImageUrl = (response.profile_image_url && response.profile_image_url !== 'Unknown')
          ? response.profile_image_url
          : require('../../../assets/images/profile.png');

        const coverImageUrl = response.cover_image_url && response.cover_image_url !== 'Unknown'
          ? response.cover_image_url
          : require('../../../assets/images/profile.png');

        setAvatarUri(profileImageUrl); // Ensure profile_image_url is valid or use the default avatar
        setCoverImageUri(coverImageUrl);

        // Set other fields using new schema
        setName(response.name);
        setBio(response.bio);
        setGenre(response.genre);
        setLocation(response.location);
      } else {
        console.error('No artist data found');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistProfile(); // Fetch the artist profile when the component is mounted or refreshed
  }, []);

  // FUNCTION TO IMAGE PICKER AND SELECT PROFILE IMAGE FOR ARTIST PROFILE
  const openImagePicker = async (source) => {
    setModalVisible(true);

    if (source === 'gallery') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant photo library permissions to upload an image.',
          [{ text: 'OK' }]
        );
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 1],
        quality: 0.8,
      });
      setModalVisible(false);

      if (!result.canceled) {
        const imageUri = result.uri || (result.assets && result.assets[0].uri);
        if (imageUri) setAvatarUri(imageUri);
      }
    } else if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant camera permissions to take a photo.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      setModalVisible(false);

      if (!result.canceled) {
        const imageUri = result.uri || (result.assets && result.assets[0].uri);
        if (imageUri) setAvatarUri(imageUri);
      }
    } else if (source === 'default') {
      const defaultImageUri = Image.resolveAssetSource(require('../../../assets/images/profile.png')).uri;
      setAvatarUri(defaultImageUri);
      setModalVisible(false);
    }
  };

  //FUNCTION TO IMAGE PICKER AND SELECT COVER IMAGE FOR ARTIST PROFILE
  const openCoverImagePicker = async () => {
    // Request permissions to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissions Required',
        'Please grant photo library permissions to upload an image.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,      // Enables cropping
      aspect: [2, 1],           // Aspect ratio 2:1 for cover image
      quality: 0.8,             // Set image quality
    });

    if (result.canceled) {
      console.log('User cancelled image picker');
    } else {
      // Try to capture the URI based on where it is stored
      const imageUri = result.uri || (result.assets && result.assets[0].uri);
      if (imageUri) {
        setCoverImageUri(imageUri);  // Store the selected cover image URI in state
        console.log('Selected cover image URI:', imageUri);  // Log the URI for verification
      } else {
        console.log('Cover image URI not found');
      }
    }
  };

  // HANDLE SAVE ARTIST PROFILE CHANGES
  const handleSaveChanges = async () => {
    try {
      const userId = await tokenManager.getUserId();

      // Prepare profile data to send to the backend
      const profileData = {
        name,
        bio,
        genre,
        location,
      };

      // Update text fields
      await ArtistService.updateArtistProfile({
        artistId: userId,
        ...profileData,
      });

      const token = await tokenManager.getAccessToken();  // Get access token for authorization

      // Upload profile image if changed
      if (avatarUri && (!artistData.profile_image_url || avatarUri !== artistData.profile_image_url)) {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: avatarUri,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });

        await fetch(`${serverURL}/artists/${userId}/profile-image`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      // Upload cover image if changed
      if (coverImageUri && (!artistData.cover_image_url || coverImageUri !== artistData.cover_image_url)) {
        const coverFormData = new FormData();
        coverFormData.append('coverImage', {
          uri: coverImageUri,
          name: 'cover.jpg',
          type: 'image/jpeg',
        });

        await fetch(`${serverURL}/artists/${userId}/cover-image`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          body: coverFormData,
        });
      }

      alert('Profile updated successfully!');
      fetchArtistProfile(); // Refetch to show the updated data

    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  // TOP HEADER PART
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      // ARTIST NAME
      headerBackground: () => (
        <Animated.View style={[headerAnimatedStyle, styles.header]}>
          <Animated.Text style={[styles.title, titleAnimatedStyle]}>
            {name}
          </Animated.Text>
        </Animated.View>
      ),
      // NOTIFICATION, MESSAGES AND SETTINGS ICONS
      headerRight: () => (
        <>
          <Animated.View style={[styles.bar, iconsAnimatedStyle]}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.roundButton} onPress={() => {
                  handleSaveChanges();
                  setIsEditing(false);
                }}>
                  <Image source={require('../../../assets/images/ArtistProfile/save.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundButton} onPress={handleCloseEditing}>
                  <Image source={require('../../../assets/images/ArtistProfile/close.png')} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.roundButton}>
                  <Image source={require('../../../assets/images/ArtistProfile/bell.png')} />
                  <Image source={require('../../../assets/images/ArtistProfile/ellipse.png')} style={styles.badge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundButton} onPress={() => router.push("/artistInboxScreen")}>
                  <Image source={require('../../../assets/images/ArtistProfile/message.png')} />
                  <Image source={require('../../../assets/images/ArtistProfile/ellipse.png')} style={styles.badge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundButton} onPress={() => router.push("/settings")}>
                  <Image source={require('../../../assets/images/ArtistProfile/settings.png')} />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
          <Animated.View style={[styles.halfOutsideIconContainer, buttonAnimatedStyle]}>
            <TouchableOpacity style={styles.iconButton}>
              <Entypo name="upload" size={18} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </>
      ),
      // BACK BUTTON ICON
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
  }, [isEditing, name, genre, avatarUri, coverImageUri]);

  // ANIMATED STYLE FOR IMAGE FADE-OUT
  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  // ANIMATED STYLE FOR HEADER BACKGOUND VISIBILITY
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    };
  }, []);

  // ANIMATED STYLE FOR ARTIST NAME ON HEADER 
  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [IMG_HEIGHT / 1.5, IMG_HEIGHT], [0, 1]),
    };
  }, []);

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [IMG_HEIGHT / 1.5, IMG_HEIGHT], [0, 1]),
    };
  }, []);
  // ANIMATED STYLE FOR PROFILE IMAGE
  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, 250], [1, 0]), // Smooth fade out
      transform: [
        {
          scale: interpolate(scrollOffset.value, [0, 150], [1, 0.7], { extrapolateRight: 'clamp' }), // Ensure no enlarging, only shrinking
        },
      ],
    };
  });

  const inputAnimatedStyle = useAnimatedStyle(() => {
    // The input will start disappearing as the image is stretched
    const inputOpacity = interpolate(scrollOffset.value, [-IMG_HEIGHT, 0], [0, 1], { extrapolateLeft: 'clamp' });
    const inputScale = interpolate(scrollOffset.value, [-IMG_HEIGHT, 0], [0.6, 1], { extrapolateLeft: 'clamp' });

    return {
      opacity: inputOpacity,
      transform: [
        {
          scale: inputScale,
        },
      ],
    };
  });

  // ICONS FADE-OUT ANIMATION BASED ON SCROLL
  const iconsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, IMG_HEIGHT / 2], [1, 0], { extrapolateLeft: 'clamp' });
    return { opacity };
  });

  const closeWithAnimation = () => {
    overlayOpacity.value = withTiming(0, { duration: 300 }); // Fade out overlay
    translateY.value = withTiming(400, { duration: 300 }, () => {
      // After animation completes, hide modal
      runOnJS(setModalVisible)(false);
      translateY.value = 0; // Reset for next opening
      overlayOpacity.value = 1; // Reset overlay opacity
    });
  };

  const resetPosition = () => {
    translateY.value = withSpring(0); // Animate back to original position if not dismissed
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value, // Animate overlay opacity
  }));

  // ANIMATED STYLE FOR TABS SMOOTH TRANSITION
  const getOpacityStyle = (tabIndex) => {
    return useAnimatedStyle(() => {
      const opacity = withTiming(tabTransition.value === tabIndex ? 1 : 0, { duration: 1000 });
      return { opacity };
    });
  };

  // HANDLE THE TOGGLE TABS WITH SMOOTH TRANSITION
  const handleTabToggle = (tab) => {
    setSelectedTab(tab.toLowerCase());
    tabTransition.value = withTiming(tabs.indexOf(tab), { duration: 1000 });
  };

  // HANDLE GESTURE FOR MODAL
  const handleGesture = (event) => {
    translateY.value = Math.max(event.nativeEvent.translationY, 0); // Only allow downward movement
    if (event.nativeEvent.translationY > 300) {
      closeWithAnimation(); // Trigger smooth close with animation
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <Animated.ScrollView
          contentContainerStyle={{ paddingBottom: 100 }} // Add extra padding to ensure content is not hidden behind MusicPlayer
          ref={scrollRef}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          {/* COVER IMAGE */}
          {isEditing ? (
            <TouchableOpacity onPress={openCoverImagePicker}>
              <Animated.Image
                source={{ uri: coverImageUri }}
                style={[styles.image, imageAnimatedStyle]}
                resizeMode="cover"
              />
              <Animated.View style={[styles.gradientOverlay, imageAnimatedStyle]}>
                <View style={styles.gradientBackground} />
              </Animated.View>
            </TouchableOpacity>
          ) : (
            <>
              <Animated.Image
                source={{ uri: coverImageUri }}
                style={[styles.image, imageAnimatedStyle]}
                resizeMode="cover"
              />
              <Animated.View style={[styles.gradientOverlay, imageAnimatedStyle]}>
                <View style={styles.gradientBackground} />
              </Animated.View>
            </>
          )}

          {/* PROFILE AND INFO OVERLAY */}
          <Animated.View style={[styles.profileOverlay, profileImageAnimatedStyle, { marginTop: isEditing ? 100 : 180 }]}>
            {/* ARTIST PROFILE IMAGE */}
            <View style={styles.avatarContainer}>
              <Image
                source={avatarUri ? { uri: avatarUri } : require('../../../assets/images/profile.png')}
                style={styles.profileImage}
              />
              {isEditing && (
                <TouchableOpacity style={styles.editIconContainer} onPress={openImagePicker}>
                  <Image source={require('../../../assets/images/ArtistProfile/add.png')} style={styles.editIcon} />
                </TouchableOpacity>
              )}
            </View>

            {/* Modal for selecting image source */}
            <Modal
              transparent={true}
              visible={modalVisible}
              animationType="none" // Set to "none" for instant overlay appearance
              onRequestClose={() => setModalVisible(false)}
            >
              {/* Static Overlay */}
              <View style={styles.modalOverlay} />

              {/* Animated Modal Content */}
              <PanGestureHandler onGestureEvent={handleGesture} onEnded={resetPosition}>
                <Animated.View style={[styles.modalContent, animatedStyle, overlayStyle]}>
                  <View style={styles.pullIndicator} />

                  <Text style={styles.modalTitle}>Profile</Text>

                  <View style={styles.innerModalContainer}>
                    <TouchableOpacity style={styles.modalOption} onPress={() => openImagePicker('gallery')}>
                      <Entypo name="images" size={24} color={Colors.white} style={styles.optionIcon} />
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>Upload from Gallery</Text>
                        <Text style={styles.optionSubText}>Choose a photo from your library.</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalOption} onPress={() => openImagePicker('camera')}>
                      <FontAwesome name="camera" size={24} color={Colors.white} style={styles.optionIcon} />
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>Take a Photo</Text>
                        <Text style={styles.optionSubText}>Capture a new photo with your camera.</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.modalOption, { borderBottomWidth: 0, paddingTop: 15, paddingBottom: 0 }]} onPress={() => openImagePicker('default')}>
                      <MaterialCommunityIcons name="face-recognition" size={24} color={Colors.white} style={styles.optionIcon} />
                      <View style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>Set to Default</Text>
                        <Text style={styles.optionSubText}>Use default photo. You can change it later.</Text>
                      </View>
                    </TouchableOpacity>

                  </View>
                  <TouchableOpacity style={styles.cancelModalButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelModalText}>Cancel</Text>
                  </TouchableOpacity>
                </Animated.View>
              </PanGestureHandler>
            </Modal>

            {/* ARTIST NAME */}
            {isEditing ? (
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={styles.input}
                  value={name}
                  autoCorrect={false}
                  onChangeText={setName}
                />
              </Animated.View>
            ) : (
              <Text style={styles.artistName}>{name}</Text>
            )}

            {/* ARTIST DESCRIPTION/GENRE */}
            {isEditing ? (
              <Animated.View style={inputAnimatedStyle}>
                <TextInput
                  style={[styles.input, { opacity: 0.7, borderColor: Colors.white }]}
                  value={genre}
                  autoCorrect={false}
                  onChangeText={handleGenreChange}
                  maxLength={30}
                />
                <Text style={styles.charCount}>
                  {remainingChars} / 30
                </Text>
              </Animated.View>
            ) : (
              <Text style={styles.artistInfo}>{genre}</Text>
            )}

          </Animated.View>

          {/* BUTTON CONTAINER */}
          {/* {!isEditing && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.uploadButton}>
                <Entypo name="upload" size={18} color={Colors.white} />
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editProfileButton} onPress={() => {
                setIsEditing(true)
                handleEnterEditMode()
              }}>
                <EvilIcons name="pencil" size={28} color={Colors.white} />
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )} */}

          {/* TAB SELECTION */}
          <View style={styles.container}>
            {/* TAB SELECTION */}
            <View style={styles.trackContainer}>
              {/* Left Side - Album Art */}
              <Image
                source={{ uri: 'https://i.scdn.co/image/ab67616d0000b2733574ce3a15cb5edc6559065e' }}
                style={styles.artCover}
              />
              {/* Center - Latest Song or Album Info */}
              <View style={styles.songInfoContainer}>
                <Text style={styles.releaseDate}>Oct 31, 2024</Text>
                <Text style={styles.songName}>Shukraan</Text>
                <Text style={styles.trackType}>Latest Track</Text>
              </View>
              <Animated.View style={styles.stickyButtonContainer}>
                <TouchableOpacity style={styles.editButton}
                  onPress={() => {
                    setIsEditing(true)
                    handleEnterEditMode()
                  }}>
                  <EvilIcons name="pencil" size={28} color={Colors.white} />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton}>
                  <Entypo name="upload" size={18} color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>
            </View>
            <View style={styles.toggleContainer}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.toggleButton,
                    selectedTab === tab.toLowerCase() && styles.activeButton,
                  ]}
                  onPress={() => handleTabToggle(tab)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      selectedTab === tab.toLowerCase() && styles.activeText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* TAB CONTENT SECTION */}
            <View style={{ width: '100%', marginTop: -20, }}>
              <Animated.View style={[getOpacityStyle(0)]}>
                {selectedTab === 'music' && <Music />}
              </Animated.View>
              <Animated.View style={[getOpacityStyle(1)]}>
                {selectedTab === 'events' && <Events />}
              </Animated.View>
              <Animated.View style={[getOpacityStyle(2)]}>
                {selectedTab === 'posts' && <Posts avatarUri={avatarUri} name={name} />}
              </Animated.View>
              <Animated.View style={[getOpacityStyle(3)]}>
                {selectedTab === 'dashboard' && <Dashboard />}
              </Animated.View>
            </View>
          </View>
        </Animated.ScrollView>

        {/* Music Player - Fixed at the bottom */}
        <View style={styles.musicPlayerContainer}>
          <MusicPlayer />
        </View >
      </View >
    </GestureHandlerRootView >
  );
};

export default ArtistProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: IMG_HEIGHT,
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100%',
  },
  gradientFill: {
    flex: 1,
    height: '100%',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#2F2F30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 24,
    width: 9,
    height: 9,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    backgroundColor: '#2F2F30',
    height: 100,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    color: Colors.white,
  },
  profileOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatarContainer: {
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    left: 50,
    bottom: 60,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    width: '100%',
    height: '100%',
  },
  input: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
    borderWidth: 2,
    borderColor: '#CECECE',
    marginBottom: 10,
    borderRadius: 14,
    width: 343,
    height: 40,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundRepeat: 'no-repeat',
    marginBottom: 10,
  },
  artistName: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '900',
    lineHeight: 26,
    zIndex: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  artistInfo: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    zIndex: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    alignItems: 'center',
    height: 60,
    marginHorizontal: 20,
    width: 353,
    top: 330,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  uploadButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 167,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    borderRadius: 25,
    backgroundColor: '#4554F0',
  },
  editProfileButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 167,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 25,
    backgroundColor: '#4554F0',
  },
  buttonText: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeButton: {
    borderColor: Colors.white,
  },
  toggleText: {
    color: 'gray',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 18,
  },
  activeText: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 18,
  },
  contentContainer: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  placeholderText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 50,
    color: Colors.gray,
  },
  charCount: {
    color: Colors.white,
    textAlign: 'right',
    marginTop: -5,
    marginHorizontal: 10,
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    zIndex: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  musicPlayerContainer: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRadius: 14,
    borderBottomColor: Colors.white,
    marginHorizontal: 5,
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#1C1D22',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    alignItems: 'flex-start',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 400,
  },
  pullIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#313139',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: -10,
  },
  modalTitle: {
    color: Colors.white,
    fontFamily: 'Open Sans',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '900',
    lineHeight: 28,
    alignSelf: 'center',
  },
  innerModalContainer: {
    backgroundColor: '#27272F',
    width: '100%',
    borderRadius: 16,
    marginTop: 16,
    padding: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    width: '100%',
  },
  optionIcon: {
    marginRight: 15,
    opacity: 0.7
  },
  optionTextContainer: {
    flexDirection: 'column',
  },
  optionText: {
    color: Colors.white,
    fontFamily: 'Open Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
  },
  optionSubText: {
    color: Colors.white,
    fontSize: 10,
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '300',
    opacity: 0.6
  },
  cancelModalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4554F0',
    borderRadius: 8,
    height: 50,
    width: '100%',
    marginTop: 18,
  },
  cancelModalText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontStyle: 'normal',
    fontWeight: '800',
    lineHeight: 22,
  },




  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 26,
    marginTop: 4,
    borderRadius: 10,
  },
  artCover: {
    width: 56,
    height: 56,
    marginRight: 10,
  },
  songInfoContainer: {
    flex: 1,        // Takes remaining space in the center
    paddingLeft: 5,
  },
  releaseDate: {
    fontSize: 10,
    color: '#C0C0C0',
    fontWeight: '600'
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 2,
  },
  trackType: {
    fontSize: 10,
    color: '#0DBCEE',
  },
  stickyButtonContainer: {
    position: 'absolute',
    top: 10, // Adjust this value as needed
    right: 20,
    flexDirection: 'row',
    gap: 14,
  },
  halfOutsideIconContainer: {
    position: 'absolute',
    top: 16, // Position it halfway out of the header
    right: 5,
    zIndex: 10,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4554F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    width: 48,
    height: 50,
    borderRadius: 24,
    backgroundColor: '#4554F0',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1A1A1A',
    alignItems: 'center',
    position: 'absolute', // Overlapping position
    right: 0, // Shifted to overlap on the right side of the upload button
    top: 0, // Adjust to overlap slightly at the top
    zIndex: 10, // Ensures it sits above the first button
  },
  editButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 45,
    flexShrink: 0,
    width: 130,
    height: 50,
    borderRadius: 48,
    backgroundColor: '#4554F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '800',
    lineHeight: 20,
  },
});