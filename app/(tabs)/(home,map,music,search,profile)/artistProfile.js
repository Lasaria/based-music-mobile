import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { router, useNavigation, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/Color';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, {
  interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue, withTiming,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import Music from '../../../components/ArtistProfile/Music';
import Events from '../../../components/ArtistProfile/Events';
import Posts from '../../../components/ArtistProfile/Posts';
import Dashboard from '../../../components/ArtistProfile/Dashboard';
import { UserService } from '../../../services/UserService';
import { tokenManager } from '../../../utils/tokenManager';
import * as ImagePicker from 'expo-image-picker';
import MusicPlayer from '../../../components/MusicPlayer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditProfilePhotosScreen from '../../../components/EditProfile/EditProfilePhotosScreen';
import EditProfileScreen from '../../../components/EditProfile/EditProfileScreen';
import { formatCount } from '../../../utils/functions';
import { FollowersModal } from '../../../components/FollowersModal';
import { SERVER_URL, AUTHSERVER_URL } from "@env";


// SERVER URL
const serverURL = SERVER_URL;

// DEVICE ACTUAL WIDTH
const { width } = Dimensions.get('window');
// CONSTANT VALUE FOR IMAGE HEIGHT
const IMG_HEIGHT = 400;
// TABS 
const tabs = ['Music', 'Events', 'Posts', 'Dashboard'];

// DEFAULT AVATAR
const DEFAULT_PROFILE_IMAGE = 'https://i.sstatic.net/dr5qp.jpg';
const DEFAULT_COVER_IMAGE = 'https://plus.unsplash.com/premium_photo-1700604012249-e2f3c5645695?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWF0dGUlMjBibGFja3xlbnwwfHwwfHx8MA%3D%3D';


export const ArtistProfileScreen = ({ userData, onUpdateProfile, refreshControl, isRootProfile }) => {
  // ARTIST PROFILE STATES
  const params = useLocalSearchParams();
  //const [userData, setUserData] = useState(null);
  const {
    id: userId,
    profile_image_url: initialAvatarUri,
    cover_image_url: initialCoverUri,
    display_name: initialName,
    username: initialUsername,
    description: initialDescription,
    selected_genres: initialGenre,
    user_location: initialLocation,
    isSelfProfile,
    followers_count: initialFollowersCount
  } = userData;
  // const [avatarUri, setAvatarUri] = useState('');
  // const [coverImageUri, setCoverImageUri] = useState();
  // const [name, setName] = useState('');
  // const [genre, setGenre] = useState('');
  // const [location, setLocation] = useState('');
  // const [username, setUsername] = useState('');
  // const [description, setDescription] = useState('');
  // const [lastUpdatedUsername, setLastUpdatedUsername] = useState('');
  // const [loading, setLoading] = useState(true);
  // const [selectedTab, setSelectedTab] = useState('music');
  // const [isEditing, setIsEditing] = useState(false);
  // const [showEditPhotosScreen, setShowEditPhotosScreen] = useState(false);
  // const [photos, setPhotos] = useState([]);
  // const [userId, setUserId] = useState(null); // State to store the userId
  //const [isSelfProfile, setIsSelfProfile] = useState(false);
  // const [userType, setUserType] = useState(null);

  // const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  // State for editable fields
  const [avatarUri, setAvatarUri] = useState(initialAvatarUri);
  const [coverImageUri, setCoverImageUri] = useState(initialCoverUri);
  const [name, setName] = useState(initialName);
  const [genre, setGenre] = useState(initialGenre);
  const [location, setLocation] = useState(initialLocation);
  const [description, setDescription] = useState(initialDescription);
  const [username, setUsername] = useState(initialUsername);
  //const [followersCount, setFollowersCount] = useState(initialFollowersCount);

  // Other state variables
  const [lastUpdatedUsername, setLastUpdatedUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('music');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPhotosScreen, setShowEditPhotosScreen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  //const [userId, setUserId] = useState(userData.id);
  const [isOptionsModalVisible, setOptionsModalVisible] = useState(false);
  
  // Dynamic State variables for user interaction
  const [isFollowing, setIsFollowing] = useState(null)

  // Function to open modal
  const openOptionsModal = () => setOptionsModalVisible(true);

  // Function to close modal
  const closeOptionsModal = () => setOptionsModalVisible(false);


  // CACHE ALL THE VALUES
  const [originalName, setOriginalName] = useState('')
  const [originalGenre, setOriginalGenre] = useState('')
  const [originalProfileImage, setProfileImage] = useState('')
  const [originalCoverImage, setCoverImage] = useState('')

  // ANIMATION STATES
  const scrollOffset = useSharedValue(0);
  const tabTransition = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  // FOR NAVIGATION BETWEEN SCREENS
  const navigation = useNavigation();

  // FETCH ARTIST PROFILE FROM THE SERVER
  const fetchUserProfile = async () => {
    //try {
      // const userId = params.userId || await tokenManager.getUserId();
      console.log("FOLLOWING USER ID: ", userId);
      const following = await UserService.checkIsFollowing(userId); // Update function to fetch user profile
      // /isFollowing/:followee_id
      setIsFollowing(following);
  };

  // Follow Actions for user
  const follow = async (type) => {
    if (type) {
      const result = await UserService.follow(userId); // Update function to fetch user profile
      // /isFollowing/:followee_id
      setIsFollowing(result);
    } else {
      const result = await UserService.unfollow(userId); // Update function to fetch user profile
      // /isFollowing/:followee_id
      setIsFollowing(result);
    }
  }

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

  // ICONS FADE-OUT ANIMATION BASED ON SCROLL
  const iconsAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollOffset.value, [0, IMG_HEIGHT / 2], [1, 0], { extrapolateLeft: 'clamp' });
    return { opacity };
  });

  // COMBINED ANIMATION FOR FADE OUT THE TEXT ON PROFILE IMAGE 
  const combinedAnimatedStyle = useAnimatedStyle(() => {
    const fadeOutOpacity = interpolate(scrollOffset.value, [-IMG_HEIGHT / 3, 0], [0, 1], { extrapolateRight: 'clamp' });
    const iconsOpacity = interpolate(scrollOffset.value, [0, IMG_HEIGHT / 2], [1, 0], { extrapolateLeft: 'clamp' });
    const opacity = fadeOutOpacity * iconsOpacity;
    const scale = interpolate(scrollOffset.value, [-IMG_HEIGHT, 0], [0.8, 1], { extrapolateRight: 'clamp' });
    return { opacity, transform: [{ scale }] };
  });

  // HANDLE FUNCTION TO OPEN IMAGE PICKER AND SELECT COVER IMAGE FOR ARTIST PROFILE
  const handleOpenCoverImagePicker = async () => {
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

      // Log the data being sent
      console.log('Name before sending:', name); // Add this log

      const profileData = {
        display_name: name, // Changed from displayName to display_name
        selected_genres: genre,
        user_location: location,
        cover_image_url: coverImageUri,
        profile_image_url: avatarUri // Changed from mainPhotoUri to match backend
      };

      console.log('About to send the following data for update:', profileData);

      const response = await UserService.updateUserProfile({
        userId: userId,
        ...profileData,
      });
      console.log('Update response:', response);


      const token = await tokenManager.getAccessToken();  // Get access token for authorization
      // Upload profile image if changed
      if (avatarUri && (!userData.profile_image_url || avatarUri !== userData.profile_image_url)) {
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
      if (coverImageUri && (!userData.cover_image_url || coverImageUri !== userData.cover_image_url)) {
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


      if (response) {
        alert('Profile updated successfully!');
        fetchUserProfile(); // Refresh the profile data
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

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

  // TAB SWITCH ANIMATION AND VIBRATION
  const handleTabToggle = (tab) => {
    if (tab.toLowerCase() !== selectedTab) {
      setSelectedTab(tab.toLowerCase());
      Vibration.vibrate(10); // Short vibration on tab switch
      tabTransition.value = withTiming(tabs.indexOf(tab) * 80, { duration: 300 }); // Smooth transition based on index
    }
  };

  // OPEN EDIT PROFILE PHOTOS SCREEN TO PICK REMOVE OR ADD NEW PROFILE IMAGE
  const openEditProfilePhotosScreen = () => {
    console.log("Opening EditProfilePhotosScreen");
    setShowEditPhotosScreen(true);
  };


  // Handle adding a photo
  const handleAddPhoto = (newPhotoUri) => {
    console.log("Adding new photo with URI:", newPhotoUri);
    setPhotos((prevPhotos) => {
      const updatedPhotos = [...prevPhotos, { uri: newPhotoUri }];
      console.log("Updated photos after adding:", updatedPhotos);
      return updatedPhotos;
    });

  };

  // Handle removing a photo
  const handleRemovePhoto = (photo) => {
    console.log("Removing photo with URI:", photo.uri);
    setPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((p) => p.uri !== photo.uri);
      console.log("Updated photos after removing:", updatedPhotos);
      return updatedPhotos;
    });
  };

  const isProfileTab = (navigation) => {
    // Get the current route
    const currentRoute = navigation.getState().routes;
    
    // Check if we're in the profile tab and it's the root screen
    return currentRoute.some(route => 
      route.name === '(profile)' && 
      (!route.params || !route.params.userId)
    );
  };

  // FETCH THE ARTIST PROFILE WHEN COMPONENT IS MOUNTED OR REFRESHED
  useEffect(() => {
    fetchUserProfile();
    navigation.setOptions({ headerShown: !loading });
  }, [avatarUri, loading, userId]);

  // TOP HEADER PART
  useLayoutEffect(() => {
    if (!loading) {
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
        // NOTIFICATION, MESSAGES, AND SETTINGS ICONS
        headerRight: () => (
          <Animated.View style={[styles.bar, iconsAnimatedStyle]}>
            {isSelfProfile ? (
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.roundButton}>
                  <Image source={require('../../../assets/images/UserProfile/bell.png')} />
                  <Image source={require('../../../assets/images/UserProfile/ellipse.png')} style={styles.badge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundButton} onPress={() => router.push("/artistInboxScreen")}>
                  <Image source={require('../../../assets/images/UserProfile/message.png')} />
                  <Image source={require('../../../assets/images/UserProfile/ellipse.png')} style={styles.badge} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundButton} onPress={() => router.push("/settings")}>
                  <Image source={require('../../../assets/images/UserProfile/settings.png')} />
                </TouchableOpacity>
              </View>

            ) : (
              // Render the three dots icon when viewing someone else's profile
              <View style={styles.headerButtons}>
                <TouchableOpacity style={styles.roundButton} onPress={openOptionsModal}>
                  <Image source={require('../../../assets/images/UserProfile/morehorizontal.png')} />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        ),
        // BACK BUTTON ICON
        headerLeft: () => {
          // Only show back button if not on root profile
          return !isRootProfile ? (
            <TouchableOpacity 
              style={styles.roundButton} 
              onPress={() => router.back()}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={Colors.white} 
              />
            </TouchableOpacity>
          ) : null;
        },
      });
    }
  }, [isEditing, name, genre, avatarUri, coverImageUri, isSelfProfile, loading]);


  // FETCH ARTISTS OTHER IMAGES
  useEffect(() => {
    const fetchProfileImages = async () => {
      if (!userId) return; // Exit if userId is not available
      try {
        const fetchedPhotos = await UserService.getProfileImages(userId);

        // Check if fetchedPhotos is valid, and set photos state accordingly
        if (Array.isArray(fetchedPhotos) && fetchedPhotos.length > 0) {
          setPhotos(fetchedPhotos);
        }
      } catch (error) {
        console.log("Error loading profile images:");
        // Set photos to the default in case of an error
      }
    };

    fetchProfileImages();
  }, [userId]);


  return (
    <GestureHandlerRootView>
      {/* OPEN EDIT PHOTOS SCREEN */}
      <Modal
        visible={showEditPhotosScreen}
        animationType="slide"
        onRequestClose={() => setShowEditPhotosScreen(false)}
      >
        <EditProfilePhotosScreen
          userId={userId}
          photos={photos}
          setPhotos={setPhotos}
          onSave={() => {
            handleSaveChanges();
            fetchUserProfile();
          }}
          onCancel={() => {
            setShowEditPhotosScreen(false)
            setIsEditing(false)
            fetchUserProfile();
          }}
          onAddPhoto={handleAddPhoto}
          onRemovePhoto={handleRemovePhoto}
        />
      </Modal>

      {/* Modal for EditProfileScreen */}
      <Modal
        visible={isEditing}
        animationType="slide"
        onRequestClose={() => setIsEditing(false)}
      >
        <EditProfileScreen
          name={name}
          setName={setName}
          username={username}
          setUsername={setUsername}
          description={description}
          setDescription={setDescription}
          coverImageUri={coverImageUri}
          setCoverImageUri={setCoverImageUri}
          defaultCover={DEFAULT_COVER_IMAGE}
          avatarUri={avatarUri}
          defaultProfile={DEFAULT_PROFILE_IMAGE}
          currentUsername={username} // Pass the current username here
          lastUpdatedUsername={lastUpdatedUsername}
          openEditProfilePhotosScreen={openEditProfilePhotosScreen}
          onCancel={() => {
            setIsEditing(false)
            fetchUserProfile();
          }}
        />
      </Modal>


      {/* ACTION MODAL FOR BLOCK/REPORT */}
      <Modal
        visible={isOptionsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeOptionsModal}
      >
        <View style={styles.fullScreenOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeOptionsModal} style={styles.topBar}>
              <View style={styles.closeBar} />
            </TouchableOpacity>
            <View style={styles.optionsContainer}>
              <TouchableOpacity style={styles.option} onPress={() => {
                console.log('Block account pressed');
                closeOptionsModal();
              }}>
                <View style={styles.actionModalIconContainer}>
                  <Image source={require('../../../assets/images/UserProfile/ic_twotone-block.png')} />
                  <Text style={styles.optionText}>Block account</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.option} onPress={() => {
                console.log('Report pressed');
                closeOptionsModal();
              }}>
                <View style={styles.actionModalIconContainer}>
                  <Image source={require('../../../assets/images/UserProfile/alert-circle.png')} />
                  <Text style={styles.optionText}>Report</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* MAIN PROFILE UI CONTENT */}
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.white} />
          </View>
        ) : (
          <>
            <Animated.ScrollView
              contentContainerStyle={{ paddingBottom: 100 }}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              refreshControl={refreshControl}
            >
              {/* COVER IMAGE */}
              {isEditing ? (
                <TouchableOpacity onPress={handleOpenCoverImagePicker}>
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
                    source={coverImageUri ? { uri: coverImageUri } : DEFAULT_COVER_IMAGE}
                    style={[styles.image, imageAnimatedStyle]}
                    resizeMode="cover"
                  />
                  <Animated.View style={[styles.gradientOverlay, imageAnimatedStyle]}>
                    <View style={styles.gradientBackground} />
                  </Animated.View>
                </>
              )}

              {/* PROFILE AND INFO OVERLAY */}
              <Animated.View
                style={[
                  styles.profileOverlay,
                  { marginTop: isEditing ? 180 : isSelfProfile ? 180 : 160 },
                ]}
              >
                {/* IF ARTIST IS VIEWING THEIR PROFILE */}
                {isSelfProfile ? (
                  <>
                    {/* ARTIST PROFILE IMAGE */}
                    <Animated.View style={[styles.otherUserProfileContainer, combinedAnimatedStyle]}>
                      <View style={styles.profileDetailsContainer}>
                        <View style={styles.profileDetailsView}>
                          <View>
                            <Image
                              source={avatarUri ? { uri: avatarUri } : DEFAULT_PROFILE_IMAGE}
                              style={styles.otherUserProfileImage}
                            />
                            {/* Artist Name and Handle */}
                            <Text style={styles.artistName}>{name}</Text>
                            <View style={styles.artistHandleContainer}>
                              <Text style={styles.artistHandle}>@{username}</Text>
                            </View>
                          </View>
                        </View>

                        {/* ARITST SOCIAL HANDLES */}
                        <View style={styles.socialIconsContainer}>
                          <TouchableOpacity>
                            <Image source={require('../../../assets/images/UserProfile/entypo-social_instagram.png')} style={styles.icon} />
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Image source={require('../../../assets/images/UserProfile/lineicons_tiktok.png')} style={styles.icon} />
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Image source={require('../../../assets/images/UserProfile/uil_snapchat-square.png')} style={styles.icon} />
                          </TouchableOpacity>
                        </View>

                        {/* DESCRIPTION */}
                        <Text style={styles.description}>
                          {description.length > 0 && description}
                        </Text>

                      </View>
                    </Animated.View>
                  </>
                ) : (
                  // IF LISTENER IS VIEWING ARTIST PROFILE
                  <Animated.View style={[styles.otherUserProfileContainer, combinedAnimatedStyle]}>
                    <View style={styles.profileDetailsContainer}>
                      <View style={styles.profileDetailsView}>
                        <View>
                          <Image
                            source={avatarUri ? { uri: avatarUri } : require('../../../assets/images/profile.png')}
                            style={styles.otherUserProfileImage}
                          />
                          {/* Artist Name and Handle */}
                          <Text style={styles.artistName}>{name}</Text>
                          <View style={styles.artistHandleContainer}>
                            <Text style={styles.artistHandle}>@{username}</Text>
                          </View>
                        </View>

                        {/* ARTIST RANKING */}
                        <View style={styles.artistStats}>
                          <View>
                            <Text style={styles.ranking}>#25</Text>
                            <Text style={styles.location}>DMV</Text>
                          </View>
                          <View>
                            <Text style={styles.ranking}>#8</Text>
                            <Text style={styles.location}>NOVA</Text>
                          </View>
                          <View>
                            <Text style={styles.ranking}>#2</Text>
                            <Text style={styles.location}>Arlington</Text>
                          </View>
                        </View>
                      </View>

                      {/* FOLLOWERS COUNT AND STREAMS */}
                      <View style={styles.followerInfo}>
                        <View style={styles.followersContainer}>
                          <Feather name="users" size={16} color={Colors.white} />
                          <TouchableOpacity onPress={() => setFollowersModalVisible(true)}>
                            <Text style={styles.followers}>{formatCount(userData.followers_count)} followers</Text>
                          </TouchableOpacity>
                          <FollowersModal
                            visible={followersModalVisible}
                            onClose={() => setFollowersModalVisible(false)}
                            userId={userId}
                          />
                        </View>
                        <View style={styles.streamsContainer}>
                          <Ionicons name="play" size={16} color={Colors.white} />
                          <Text style={styles.streams}>2.4M streams</Text>
                        </View>
                      </View>

                      {/* ARITST SOCIAL HANDLES */}
                      <View style={styles.socialIconsContainer}>
                        <TouchableOpacity>
                          <Image source={require('../../../assets/images/UserProfile/entypo-social_instagram.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Image source={require('../../../assets/images/UserProfile/lineicons_tiktok.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Image source={require('../../../assets/images/UserProfile/uil_snapchat-square.png')} style={styles.icon} />
                        </TouchableOpacity>
                      </View>

                      {/* DESCRIPTION */}
                      <Text style={styles.description}>
                        {description.length > 0 && description}
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </Animated.View>

              {/* UPLOAD AND EDIT PROFILE BUTTONS FOR ARTIST */}
              {!isEditing && (
                <Animated.View style={[styles.buttonContainer, combinedAnimatedStyle]}>
                  {isSelfProfile ? (
                    <>
                      <TouchableOpacity style={styles.uploadButton} onPress={() => router.push("/uploadScreen")}>
                        <Text style={styles.buttonText}>Upload</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={() => {
                          setIsEditing(true);
                          handleEnterEditMode();
                        }}
                      >
                        <Text style={styles.buttonText}>Edit Profile</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    // FOLLOW AND MESSAGE BUTTONS FOR LISTENER VIEWING ARTIST PROFILE
                    <>
                      <TouchableOpacity 
                      style={styles.followButton}
                      onPress={() => isFollowing ? follow(false) : follow(true)}
                      >
                        { isFollowing ? 
                        (<Text style={styles.buttonText}>Unfollow</Text>) :
                        (<Text style={styles.buttonText}>Follow</Text>)
                        }
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.messageButton}>
                        <Text style={styles.buttonText}>Message</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </Animated.View>
              )}

              {/* TAB SELECTION */}
              <View style={styles.container}>
                {/* SWITCH TABS */}
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

                {/* TABS CONTENT FOR MUSIC, EVENTS, POSTS, DASHBOARD */}
                <View style={{ width: '100%', marginTop: -20 }}>
                  <View key={`${selectedTab}`}>
                    {selectedTab === 'music' && <Music name={name} isSelfProfile={isSelfProfile} />}
                  </View>
                  <View>
                    {selectedTab === 'events' && <Events isSelfProfile={isSelfProfile} />}
                  </View>
                  <View>
                    {selectedTab === 'posts' && <Posts currentUserId={userId} avatarUri={avatarUri} name={name} isSelfProfile={isSelfProfile} />}
                  </View>
                  <View>
                    {selectedTab === 'dashboard' && <Dashboard />}
                  </View>
                </View>
              </View>
            </Animated.ScrollView>
            <View style={styles.musicPlayerContainer}>
              <MusicPlayer />
            </View>
          </>
        )}
      </View >
    </GestureHandlerRootView >
  );
};

export default ArtistProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    position: 'absolute',
    top: -20,
    right: 0,
  },
  header: {
    backgroundColor: '#2F2F30',
    height: 105,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 63,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.white,
  },
  profileOverlay: {
    display: 'flex',
    position: "absolute",
    left: 0,
    right: 0,
    top: -78,
    alignItems: "center",
  },
  avatarContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundRepeat: 'no-repeat',
    marginBottom: 10,
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
  artistName: {
    color: Colors.white,
    fontFamily: 'Open Sans',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: 'bold',
    lineHeight: 26,
    marginTop: 8,
    zIndex: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    opacity: 0.7
  },
  otherUserProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  profileDetailsContainer: {
    flex: 1,
    gap: 3,
  },
  profileDetailsView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  otherUserProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    // marginRight: 16,
  },
  artistHandleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  artistHandle: {
    color: Colors.white,
    fontFamily: "Open Sans",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 20,
  },
  artistStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 36,
  },
  ranking: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
  },
  location: {
    color: Colors.white,
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
  },
  followerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  followersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  followers: {
    color: Colors.white,
    fontFamily: "Open Sans",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  streamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  streams: {
    color: Colors.white,
    fontFamily: "Open Sans",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
  },
  socialIconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 0,
    marginHorizontal: 24,
    marginTop: 6,
  },
  description: {
    color: 'white',
    fontFamily: "Open Sans",
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    marginVertical: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    alignItems: 'center',
    gap: 10,
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
    width: 176,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    borderRadius: 24,
    backgroundColor: Colors.themeColor,
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
  editProfileButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 176,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 24,
    backgroundColor: '#3C3C3C',

  },
  followButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 176,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
    borderRadius: 24,
    backgroundColor: Colors.themeColor,
  },
  messageButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 176,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderRadius: 24,
    backgroundColor: '#3C3C3C',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginVertical: 10,
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
    height: 35,
  },
  searchInput: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 15,
    flex: 1,
  },
  cancelText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    marginLeft: 10,
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
    borderBottomWidth: 3,
    borderColor: "transparent",
  },
  activeButton: {
    borderColor: Colors.themeColor,
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
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay background
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    height: 265,
    backgroundColor: '#222',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    marginTop: 72,
    paddingVertical: 8,
  },
  actionModalIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  topBar: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBar: {
    width: 40,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 2.5,
  },
  option: {
    paddingVertical: 15,
    paddingHorizontal: 18,
    width: '100%',
  },
  optionText: {
    color: '#FF5151',
    fontFamily: "Open Sans",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#423f3f',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: Colors.white,
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
});