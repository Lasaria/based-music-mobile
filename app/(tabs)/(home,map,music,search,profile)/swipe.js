import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from "../../../utils/tokenManager";
import { SERVER_URL } from '@env';

const API_URL = SERVER_URL;
const { width } = Dimensions.get('window');

export default function SwipeScreen() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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
      console.log(data);
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction, swipedUser) => {
    try {
      const token = await tokenManager.getAccessToken();
      const action = direction === 'right' ? 'like' : 'dislike';
      
      const response = await fetch(`${API_URL}/match/`, {
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
        renderCard={(user) => (
          <View style={styles.card}>
            <Image 
              source={{ uri: user?.profile_image_url }} 
              style={styles.cardImage}
            />
            <View style={styles.cardInfo}>
              <Text style={styles.userName}>{user?.username}</Text>
              <Text style={styles.userBio}>{user?.bio || 'No bio available'}</Text>
            </View>
          </View>
        )}
        onSwipedLeft={(index) => handleSwipe('left', users[index])}
        onSwipedRight={(index) => handleSwipe('right', users[index])}
        cardIndex={0}
        backgroundColor="white"
        stackSize={3}
        cardVerticalMargin={20}
        cardHorizontalMargin={20}
        stackSeparation={15}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.dislikeButton]}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <Ionicons name="close-circle" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.likeButton]}
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
  cardImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  cardInfo: {
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
});