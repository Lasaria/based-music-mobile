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
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from "../../../utils/tokenManager";
import { SERVER_URL } from '@env';

const API_URL = SERVER_URL;
const { width } = Dimensions.get('window');

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
const CardContainer = ({ user }) => {
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
  
    return (
      <View style={styles.card}>
        <View style={styles.photoProgressContainer}>
          {photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressBar,
                {
                  backgroundColor: index === currentPhotoIndex ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  width: `${100 / photos.length}%`
                }
              ]}
            />
          ))}
        </View>
  
        <View style={styles.photoContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: photos[currentPhotoIndex] }}
              style={styles.cardImage}
            />
          </View>
  
          {photos.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.touchArea, styles.leftTouchArea]}
                onPress={() => handlePhotoTap('left')}
              >
                <View style={[styles.navIndicator, styles.leftIndicator]}>
                  <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.7)" />
                </View>
              </TouchableOpacity>
  
              <TouchableOpacity 
                style={[styles.touchArea, styles.rightTouchArea]}
                onPress={() => handlePhotoTap('right')}
              >
                <View style={[styles.navIndicator, styles.rightIndicator]}>
                  <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.7)" />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
  
        <View style={styles.cardInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userBio}>{user.bio || 'No bio available'}</Text>
        </View>
      </View>
    );
  };

export default function SwipeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const photoNavigationRef = useRef(null);
  const [photoState, dispatch] = useReducer(photoReducer, { currentPhotoIndex: 0 });
  const [cardStates, setCardStates] = useState({});
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
      const response = await fetch(`${API_URL}/match/people`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
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
      
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          swiped_user_id: swipedUser.id,
          action: action
        })
      });

      const data = await response.json();
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
    return <CardContainer user={user} />;
  }, []);


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Matches</Text>
        <TouchableOpacity 
          onPress={() => router.push("/swipe/matches")}
          style={styles.matchesButton}
        >
          <Ionicons name="heart" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

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
        backgroundColor="white"
        stackSize={3}
        cardVerticalMargin={20}
        cardHorizontalMargin={20}
        stackSeparation={15}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button]}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <Ionicons name="close-circle" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button]}
          onPress={() => swiperRef.current.swipeRight()}
        >
          <Ionicons name="heart-circle" size={30} color="green" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  matchesButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: '100%',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  photoProgressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    padding: 10,
    gap: 4,
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
  },
  imageContainer: {
    height: '70%',
    position: 'relative',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  leftTouchArea: {
    left: 0,
  },
  rightTouchArea: {
    right: 0,
  },
  navIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  leftIndicator: {
    marginLeft: 10,
  },
  rightIndicator: {
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
    padding: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 16,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  button: {
    padding: 15,
    borderRadius: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoContainer: {
    height: '70%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  touchArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '33%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  leftTouchArea: {
    left: 0,
    zIndex: 2,
  },
  rightTouchArea: {
    right: 0,
    zIndex: 2,
  },
});