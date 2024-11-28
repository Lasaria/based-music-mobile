import React, { useState, useEffect, useRef, useMemo, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  Pressable,
  ScrollView,
  Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-deck-swiper';
import { Colors } from '../../../constants/Color';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { tokenManager } from "../../../utils/tokenManager";
import { SERVER_URL } from '@env';
import FilterScreen from '../../../components/FilterScreen';
import { fetchGet, fetchPost } from "../../../utils/fetchCalls";


const API_URL = SERVER_URL;
const { width, height } = Dimensions.get('window');

// Photo navigation reducer
const photoReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PHOTO':
      return {
        ...state,
        currentPhotoIndex: state.currentPhotoIndex === action.totalPhotos - 1
          ? 0
          : state.currentPhotoIndex + 1
      };
    case 'PREV_PHOTO':
      return {
        ...state,
        currentPhotoIndex: state.currentPhotoIndex === 0
          ? action.totalPhotos - 1
          : state.currentPhotoIndex - 1
      };
    case 'RESET':
      return {
        ...state,
        currentPhotoIndex: 0
      };
    default:
      return state;
  }
};

// CardContainer component
const CardContainer = ({ user, isModalVisible, setIsModalVisible }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = useMemo(() => [
    user.profile_image_url,
    ...(user.additional_images || [])
  ], [user]);

  const handlePhotoTap = (direction) => {
    setCurrentPhotoIndex(prev => {
      if (direction === 'left') {
        return prev === 0 ? photos.length - 1 : prev - 1;
      } else {
        return prev === photos.length - 1 ? 0 : prev + 1;
      }
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Update parent state
  };

  const handleToggle = () => {
    setShowDetails(!showDetails);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const BottomSheetModal = () => (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseModal}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleCloseModal}
      >
        <View style={styles.bottomSheet}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.modalOption}>
                <Text style={styles.modalOptionText}>Block</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalOption, styles.reportOption]}>
                <Text style={[styles.modalOptionText, styles.reportText]}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={handleCloseModal}
              >
                <Text style={styles.modalOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );


  return (
    <Pressable style={styles.container} pointerEvents={isModalVisible ? "none" : "auto"}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={handleOpenModal}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </TouchableOpacity>

        {/* Profile Image */}
        <Image source={{ uri: photos[currentPhotoIndex] }} style={styles.profileImage} />

        {/* Photo Navigation */}
        {photos.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.touchArea, styles.leftTouchArea]}
              onPress={() => handlePhotoTap('left')}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.touchArea, styles.rightTouchArea]}
              onPress={() => handlePhotoTap('right')}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}

        {/* Info Overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.actionRow}>
            <Text style={styles.nameText}>{user.username || 'Unknown'}, 34</Text>
            <TouchableOpacity onPress={toggleModal} style={styles.arrowButton}>
              <Ionicons
                name={showDetails ? 'arrow-down' : 'arrow-up'}
                size={14}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.locationContainer, styles.sameRow]}>
            <Ionicons name="location-outline" size={16} color="#fff" />
            <Text style={styles.distanceText}>7 miles away</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.tagRow}>
              <Text style={[styles.tag, styles.primaryTag]}>Big bad Event</Text>
              <Text style={styles.tag}>Non-drinker</Text>
              <Text style={styles.tag}>Likes Pop music</Text>
            </View>
            <View style={styles.tagRow}>
              <Text style={styles.tag}>+2</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Bottom Sheet Modal */}
      <BottomSheetModal />
    </Pressable>
  );
}

export default function SwipeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State moved to SwipeScreen
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const swiperRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const photoNavigationRef = useRef(null);
  const [photoState, dispatch] = useReducer(photoReducer, { currentPhotoIndex: 0 });
  const [cardStates, setCardStates] = useState({});

  const handleOpenFilter = () => {
    setShowFilter(true);
  };

  const handleCloseFilter = () => {
    setShowFilter(false);
  };

  // Get photos for current card
  const currentPhotos = useMemo(() => {
    const currentUser = users[currentCardIndex];
    if (!currentUser) return [];
    return [
      currentUser.profile_image_url,
      ...(Array.isArray(currentUser.additional_images) ? currentUser.additional_images : [])
    ];
  }, [users, currentCardIndex]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      const initialStates = users.reduce((acc, user) => {
        acc[user.id] = {
          photoIndex: 0,
          photos: [user.profile_image_url, ...(user.additional_images || [])]
        };
        return acc;
      }, {});
      setCardStates(initialStates);
    }
  }, [users]);

  // Reset photo index when card changes
  useEffect(() => {
    dispatch({ type: 'RESET' });
  }, [currentCardIndex]);

  const handlePhotoNavigation = (userId, direction) => {
    setCardStates(prev => {
      const currentState = prev[userId];
      if (!currentState) return prev;

      const totalPhotos = currentState.photos.length;
      let newIndex;

      if (direction === 'left') {
        newIndex = currentState.photoIndex === 0 ? totalPhotos - 1 : currentState.photoIndex - 1;
      } else {
        newIndex = currentState.photoIndex === totalPhotos - 1 ? 0 : currentState.photoIndex + 1;
      }

      return {
        ...prev,
        [userId]: {
          ...currentState,
          photoIndex: newIndex
        }
      };
    });
  };

  const fetchUsers = async () => {
    try {
      const token = await tokenManager.getAccessToken();
      const response = await fetchGet({
        url: `${API_URL}/match/people`
      });

      // if (!response.ok) throw new Error('Failed to fetch users');
      const data = response;
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, swipedUser) => {
    dispatch({ type: 'RESET' });
    try {
      const token = await tokenManager.getAccessToken();
      const action = direction === 'right' ? 'like' : 'dislike';

      const response = await fetchPost({
        url: `${API_URL}/match`,
        body: {
          swiped_user_id: swipedUser.id,
          action: action
        }
      });

      const data = response;
      if (data.message === "It's a match!") {
        Alert.alert(
          "It's a Match! 🎉",
          "You've made a new connection!",
          [
            {
              text: "Keep Swiping",
              style: "cancel"
            },
            {
              text: "View Matches",
              onPress: () => router.push("/swipe/matches")
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      Alert.alert('Error', 'Failed to record swipe');
    }
  };

  const renderCard = useCallback((user) => {
    if (!user) return null;
    return <CardContainer
      user={user}
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
    />;
  }, [isModalVisible, setIsModalVisible]);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Update parent state
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <Image source={require('../../../assets/images/Group.png')} style={styles.logo} />

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10
        }}>
          <TouchableOpacity onPress={handleOpenFilter} style={styles.circleButton}>
            <Image source={require('../../../assets/images/Feed/filters.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/swipe/matches")}
            style={styles.circleButton}
          >
            <Ionicons name="heart" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>


      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseFilter}
      >
        <FilterScreen onClose={handleCloseFilter} />
      </Modal>

      {/* Main Swiper Section */}
      <Swiper
        ref={swiperRef}
        cards={users}
        renderCard={renderCard}
        onSwipedLeft={(index) => handleSwipe('left', users[index])}
        onSwipedRight={(index) => handleSwipe('right', users[index])}
        onSwipedAll={() => {
          dispatch({ type: 'RESET' });
          setCurrentCardIndex(0);
        }}
        onSwiped={(cardIndex) => {
          setCurrentCardIndex(cardIndex);
          dispatch({ type: 'RESET' });
        }}
        cardIndex={0}
        backgroundColor={Colors.background}
        stackSize={3}
        cardVerticalMargin={20}
        cardHorizontalMargin={20}
        stackSeparation={15}
        swipeEnabled={!isModalVisible} // Disable swiping when modal is visible
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={toggleModal}>
              <View style={styles.dragHandle} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <View style={styles.detailsContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>I'm looking for</Text>
                  <View style={styles.sameRow}>
                    <Feather name='music' color={Colors.white} size={18} />
                    <Text style={styles.sectionContent}>Concert buddy</Text>
                  </View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Bio</Text>
                  <Text style={styles.sectionContent}>
                    "Hello! I'm a music lover based in DC who's always up for
                    discovering new sounds and connecting with people who share the
                    same vibe. Let's connect if you're down for exploring the local
                    music scene, swapping playlists, or hitting up the next big event
                    together!"
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Music Preferences</Text>
                  <Text style={styles.sectionContent}>
                    Favorite Genre: Indie{'\n'}
                    Favorite Artist: Arcade Fire{'\n'}
                    Most listened tracks: Dog Days Are Over, Blinding Lights
                  </Text>
                </View>
                <View style={styles.section}>
                  <View style={styles.actionRow}>
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={[styles.locationIconContainer, styles.sameRow]}>
                      <Ionicons name='location-outline' color={Colors.white} size={18} />
                      <Text style={[styles.sectionTitle, { marginBottom: 0, }]}>7 mi</Text>
                    </View>
                  </View>
                  <View style={styles.sameRow}>
                    <Feather name='home' color={Colors.white} size={18} />
                    <Text style={styles.sectionContent}>Lives in Arlington, VA</Text>
                  </View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Lifestyle</Text>
                  <View style={styles.lifestyleContainer}>
                    <View style={styles.lifestyleItem}>
                      <Ionicons name="wine" size={20} color="white" />
                      <Text style={styles.lifestyleText}>Social drinker</Text>
                    </View>
                    <View style={styles.lifestyleItem}>
                      <MaterialIcons name="smoke-free" size={20} color="white" />
                      <Text style={styles.lifestyleText}>Non-smoker</Text>
                    </View>
                    <View style={styles.lifestyleItem}>
                      <Ionicons name="star-outline" size={20} color="white" />
                      <Text style={styles.lifestyleText}>Silent Disco</Text>
                    </View>
                    <View style={styles.lifestyleItem}>
                      <Ionicons name="happy-outline" size={20} color="white" />
                      <Text style={styles.lifestyleText}>No children</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Venue Preference</Text>
                  <View style={styles.venueContainer}>
                    <Image
                      source={{ uri: 'https://s3-alpha-sig.figma.com/img/47c8/94b7/40a7761e0a1b32dd7a7c558bdefcc8cf?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=JbhsGq6fZn4dQsFCyC-mK1R~nRknBWPtUOmTavQtKCu7qiShsLKHAw6F9-d3MZwlijYjQ-cHqiH3nJTuTlYU~IYW1XndRtI74V7mDgwx9XKdZTW5wbk55UoD7aL3wLBkjB6fQIZRN0HT5n1f5Ii2LMet8qxxqb0wx-ykC7r1GAWgsh7R2RIidpJyaKJ0ZOUSqOT7zLvaBFJ55FVIGDMrsujlSNs7yhYpUraUeYAyTUk0AgFZJWA9yJmMfw8goYyBDZS7WiMYrVnXu7vyaBF7ORc8VkRmwONW5lfyypKL4O83r3seXMOUhwf36L1lePtZ3RGxrMBWkzK1qz42fVYq1A__' }}
                      style={[styles.venueImage, { width: 69, height: 69 }]}
                    />
                    <Image
                      source={{ uri: 'https://s3-alpha-sig.figma.com/img/0ca3/b796/7d55a72da009f99c2167e4fb6ae0a083?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=YnlkToL4AGr7Fxr5~qQEOgc9lZ8SX6a7Q2LYWZPWWgN~L9e6yeplhkdT8uSRFBw1nBDUtHMjuvbdCNpAEZqlUHOXQ7T~V4idYxNvJ~mjx8rPp4o9EAbJKM4U0yEehjRwL-HlHGPRMGt~8zFgsmVQOs4LBkXjY0ob7FxDi5BRtb4FdOyisv7e5N814tCyS4cF9Kz2wlwWXdL6FIuZxfzkbRvcfZIUPSsediC6pBoQ6v8M8h92jlCJqpFRQDDtyjzZ9QDHjJ~sOCiM~5aoFUes7js-K-nwObcLC~f~XfZOIiREMJ2gvmtemm2gck4tL-Oy0UiUKGVK4lAYuWKjwhpS1w__' }}
                      style={[styles.venueImage, { width: 104.384, height: 25 }]}
                    />
                    <Image
                      source={{ uri: 'https://s3-alpha-sig.figma.com/img/2323/19a3/47748154f5c6d6a7445b1939e5007147?Expires=1732492800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=qjMoY85H8Ao-pvV2tHQfqROD49tiZwuXgNyaI9Fp6sW2Sf89SY7eSl5D8cBDKOg7xg5VrURt8FKqaCesZz7pZn3h~rkVCuNwZD~xc-iOF-uCEcGK0N0ftzdS8PUXWvQqZeemN3pNC2uJPU71FeITQ5f-6zHRe649GaRD-8C4XXz5V1OUNAlxtfyCMVYd96BnagKj-35Ow8A9rd9oNQDCUA2t8PTFKpdwR5hmvyRn4B-Kzbrw6cD-RSquFar2Z9ux84YY0Edy6CsH8cZLc56n-L6jzqp~vWC-koM9n1X18KWIQpWZzfNpvARary-fdMQ16vThpncfnowwORRloIYNkw__' }}
                      style={[styles.venueImage, { backgroundColor: Colors.white, width: 98.691, height: 69 }]}
                    />
                  </View>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Upcoming Events</Text>
                  <Text style={styles.sectionContent}>
                    Oct 28th - The Big Bad concert at The Grand Hall{'\n'}
                    Nov 10th - Local Talent Night at Rosebar Lounge
                  </Text>
                </View>
              </View>
              {/* Add more sections */}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Bottom Action Buttons */}

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => swiperRef.current.swipeLeft()}>
          <View style={[styles.circle, styles.redCircle]}>
            <Ionicons name="close" size={32} color="#FF2C2C" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => swiperRef.current.swipeRight()}>
          <View style={[styles.circle, styles.greenCircle]}>
            <Ionicons name="heart-outline" size={32} color="#44FF2C" />
          </View>
        </TouchableOpacity>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 130,
    backgroundColor: '#1f2120',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2F2F30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    marginLeft: 48,
    resizeMode: 'contain',
    tintColor: 'white',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 44,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 135,
    position: 'relative',
  },
  profileImage: {
    width: 343,
    height: 458,
    borderRadius: 14,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: -18,
    right: 0,
    paddingHorizontal: 40,
    paddingBottom: 30,
    background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 4,
  },
  tagsContainer: {
    width: '100%',
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    width: 140,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    color: Colors.white,
    fontSize: 10,
  },
  primaryTag: {
    backgroundColor: '#FFD074',
    color: Colors.black,
    fontWeight: '600',
  },
  arrowButton: {
    padding: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: 50,
    marginRight: -20
  },
  bottomDetails: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  detailsScrollView: {
    flex: 1,
    marginTop: 'auto',
    paddingHorizontal: 16,
    marginBottom: 100, // Space for action buttons
  },
  detailsContent: {
    position: 'absolute',
    top: 500,
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#4E5970CC',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    color: 'white',
    fontSize: 14,
  },
  locationIconContainer: {
    backgroundColor: '#666',
    padding: 6,
    borderRadius: 12,
  },
  sameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionContent: {
    color: 'white',
    fontSize: 14,
  },
  detailText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 16,
  },
  lifestyleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  lifestyleItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    padding: 10,
    marginBottom: 10,
    borderRadius: 12,
  },
  lifestyleText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  venueImage: {
    borderRadius: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    zIndex: 20, // Ensures the buttons stay above other elements
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  redCircle: {
    borderWidth: 2,
    borderColor: '#FF2C2C',
  },
  greenCircle: {
    borderWidth: 2,
    borderColor: '#44FF2C',
  },
  menuButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1F1F1F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: height * 0.8, // Default to 60% of screen height
  },
  dragHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginVertical: 8,
  },
  modalContent: {
    paddingBottom: 20,
  },
  bottomSheet: {
    backgroundColor: '#2F2F30',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.white,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalView: {
    // backgroundColor: '#454545',
    borderRadius: 14,
    margin: 24,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  modalOptionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  reportOption: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)'
  },
  reportText: {
    color: '#FF2C2C',
  },
  cancelOption: {
    borderBottomWidth: 0,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  expandScroll: {
    paddingBottom: 80,
  },
  detailsContainer: {
    // backgroundColor: '#4E5970CC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
});