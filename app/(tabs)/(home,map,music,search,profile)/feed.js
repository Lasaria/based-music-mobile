// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   View,
//   FlatList,
//   RefreshControl,
//   ActivityIndicator,
//   Modal,
//   TouchableOpacity,
//   Image,
//   ScrollView,
//   Dimensions,
// } from 'react-native';
// import { Text } from 'react-native-elements';
// import { Ionicons } from '@expo/vector-icons';
// import { tokenManager } from '../../../utils/tokenManager';
// import { useLocalSearchParams, useRouter } from 'expo-router';

// import { LikesModal } from '../../../components/LikesModal';
// import { CommentCard } from '../../../components/CommentCard';
// import { CommentsSection } from '../../../components/CommentsSection';
// import { PostCard } from '../../../components/PostCard';
// import { SERVER_URL, AUTHSERVER_URL } from '@env';

// const API_URL = SERVER_URL;
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width } = Dimensions.get('window');

// // Helper function to format dates
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//   });
// };

// const FeedScreen = () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [likesModalVisible, setLikesModalVisible] = useState(false);
//   const [selectedPostLikes, setSelectedPostLikes] = useState([]);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     // Only fetch on initial mount
//     if (isInitialLoad) {
//       fetchInitialData();
//       setIsInitialLoad(false);
//     }
//   }, [isInitialLoad]);

//   const fetchInitialData = async () => {
//     try {
//       await Promise.all([
//         fetchPosts(1),
//         fetchCurrentUser()
//       ]);
//     } catch (error) {
//       console.error('Error in initial data fetch:', error);
//       setError('Failed to load initial data');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handlePostDeleted = (postId) => {
//     // Remove the deleted post from state
//     setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
//   };

//   const handleEditPost = (post) => {
//     // Navigate to edit screen with post data
//     console.log(post);
//     router.push({ pathname: 'editPost', params: {
//         post_id: post.post_id,
//         content: post.content,
//         image_urls: JSON.stringify(post.image_urls), // Arrays need to be stringified
//         tags: JSON.stringify(post.tags),  // Arrays need to be stringified
//         // any other attributes you need
//       } });

//   };

//   const getAuthToken = async () => {
//     try {
//       const token = await tokenManager.getAccessToken();
//       if (!token) throw new Error('No auth token found');
//       return token;
//     } catch (error) {
//       console.error('Error getting auth token:', error);
//       throw error;
//     }
//   };

//   const fetchCurrentUser = async () => {
//     try {
//       const id = await tokenManager.getUserId();
//       // Implement your user info fetching logic here
//       // For example:
//       // const response = await fetch(`${API_URL}/user/profile`, {
//       //   headers: { 'Authorization': `Bearer ${token}` }
//       // });
//       // const data = await response.json();
//       // setCurrentUserId(data.user_id);
//       setCurrentUserId(id); // Replace with actual user ID
//     } catch (error) {
//       console.error('Error fetching user:', error);
//       setError('Failed to fetch user information');
//     }
//   };

//   const fetchPosts = async (pageNum = 1) => {
//     // Prevent fetching if already loading or refreshing
//     if (loading || refreshing) return;

//     if (!hasMore && pageNum > 1) return;

//     try {
//       const response = await fetch(`${API_URL}/posts?page=${pageNum}&limit=10`);
//       if (!response.ok) throw new Error('Failed to fetch posts');

//       const data = await response.json();

//       // Check if we've reached the end of the posts
//       if (data.length < 10) {
//         setHasMore(false);
//       }

//       // Check like status for each post
//       const postsWithLikeStatus = await Promise.all(
//         data.map(async (post) => {
//           //const likeStatus = await checkPostLikeStatus(post.post_id);
//           return { ...post };
//         })
//       );

//       // If refreshing or first page, replace posts
//       // If loading more, append posts
//       setPosts(prevPosts => {
//         if (pageNum === 1) {
//           return postsWithLikeStatus;
//         } else {
//           // Filter out any duplicates based on post_id
//           const existingPostIds = new Set(prevPosts.map(post => post.post_id));
//           const newPosts = postsWithLikeStatus.filter(post => !existingPostIds.has(post.post_id));
//           return [...prevPosts, ...newPosts];
//         }
//       });

//       setPage(pageNum);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       setError(error.message || 'Failed to load posts');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };



//   const handleRefresh = () => {
//     if (refreshing) return;
//     setRefreshing(true);
//     setPage(1);
//     setHasMore(true);
//     setError(null);
//     setPosts([]); // Clear existing posts before refresh
//     fetchPosts(1);
//   };

//   const handleLoadMore = () => {
//     if (!loading && hasMore && !refreshing && !error) {
//       const nextPage = page + 1;
//       setLoading(true);
//       fetchPosts(nextPage);
//     }
//   };

//   const renderFooter = () => {
//     if (!hasMore) return null;
//     return (
//       <View style={styles.footerLoader}>
//         <ActivityIndicator size="small" color="#0000ff" />
//       </View>
//     );
//   };

//   if (loading && page === 1) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {error && (
//         <View style={styles.errorContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <FlatList
//         data={posts}
//         keyExtractor={(item) => item.post_id}
//         renderItem={({ item }) => (
//           <PostCard
//             post={item}
//             currentUserId={currentUserId}
//             onPostDeleted={handlePostDeleted}
//             onEditPost={handleEditPost}
//           />
//         )}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//           />
//         }
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={renderFooter}
//         showsVerticalScrollIndicator={false}
//       />

//       <LikesModal
//         visible={likesModalVisible}
//         onClose={() => setLikesModalVisible(false)}
//         likes={selectedPostLikes}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   errorContainer: {
//     padding: 16,
//     backgroundColor: '#fee',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: '#c00',
//     marginBottom: 8,
//   },
//   retryButton: {
//     padding: 8,
//     backgroundColor: '#fff',
//     borderRadius: 4,
//     borderWidth: 1,
//     borderColor: '#c00',
//   },
//   retryButtonText: {
//     color: '#c00',
//   },
//   footerLoader: {
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   postCard: {
//     backgroundColor: '#fff',
//     marginBottom: 8,
//     padding: 16,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   postHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   authorText: {
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   dateText: {
//     color: '#666',
//     fontSize: 12,
//   },
//   contentText: {
//     fontSize: 16,
//     lineHeight: 24,
//     marginBottom: 12,
//   },
//   imageScrollView: {
//     height: 200,
//     marginBottom: 12,
//   },
//   postImage: {
//     width: width - 64,
//     height: 200,
//     marginRight: 8,
//     borderRadius: 8,
//     resizeMode: 'cover',
//   },
//   interactionBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//   },
//   likeButton: {
//     marginRight: 16,
//   },
//   countText: {
//     marginRight: 16,
//     color: '#666',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 16,
//     maxHeight: '80%',
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   likeItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   likeAuthor: {
//     fontSize: 16,
//   },
//   likeDate: {
//     color: '#666',
//     fontSize: 12,
//   },
//   closeButton: {
//     marginTop: 16,
//     padding: 12,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     fontSize: 16,
//     color: '#007AFF',
//   },
// });

// export default FeedScreen;


import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Image, Animated } from 'react-native';
import { Colors } from '../../../constants/Color';
import Home from '../../../components/Feed/Home';
import Following from '../../../components/Feed/Following';
import Local from '../../../components/Feed/Local';
import Friends from '../../../components/Feed/Friends';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FeedScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [activeNav, setActiveNav] = useState('feed');
  const translateX = useRef(new Animated.Value(70)).current; // Adjust starting position to match 'feed'
  const router = useRouter();

  const navItems = ['trending', 'feed', 'rankings'];
  const tabItems = ['Home', 'Following', 'Local', 'Friends'];

  const handleNavPress = (nav, index) => {
    setActiveNav(nav);
    Animated.spring(translateX, {
      toValue: index * 70,
      useNativeDriver: true,
    }).start();
  };

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const getCurrentComponent = () => {
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Following':
        return <Following />;
      case 'Local':
        return <Local />;
      case 'Friends':
        return <Friends />;
      default:
        return <Home />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top row */}
        <View style={styles.topRow}>
          {/* Counter Badge */}
          <View style={styles.counterContainer}>
            <View style={styles.counterCircle}>
              <Image source={require('../../../assets/images/Feed/Copy.png')} />
              <View style={styles.counterBadge}>
                <Text style={styles.counterText}>38</Text>
              </View>
            </View>
          </View>

          {/* Main Navigation */}
          <View style={styles.mainNav}>
            {navItems.map((item, index) => (
              <TouchableOpacity
                key={item}
                onPress={() => handleNavPress(item, index)}
                style={styles.navItem}
              >
                <Text style={[
                  styles.navText,
                  activeNav === item ? styles.navTextActive : styles.navTextInactive
                ]}>
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
            <Animated.View
              style={[
                styles.navIndicator,
                {
                  // Set left and width based on the activeNav value
                  left: activeNav === 'trending' ? 4 : activeNav === 'rankings' ? 18 : 26,
                  width: activeNav === 'trending' ? 62 : activeNav === 'rankings' ? 64 : 32,
                },
                {
                  transform: [{ translateX }],
                }
              ]}
            />
          </View>

          {/* Notification Icon */}
          <Image source={require('../../../assets/images/Feed/bell.png')} style={styles.notificationIcon} />
        </View>

        {/* Bottom Pills Navigation */}
        <View style={styles.pillsContainer}>
          {tabItems.map((item, index) => (
            <TouchableOpacity
              key={item}
              style={[styles.pill, activeTab === item && styles.activePill]}
              onPress={() => handleTabPress(item)}
            >
              <Text style={styles.pillText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content Area */}
        <View style={styles.contentContainer}>
          {getCurrentComponent()}
        </View>
      </View>
      {/* Floating Action Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push('/createPost')}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1A1A1A',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  container: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  counterContainer: {
    position: 'relative',
  },
  counterCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBadge: {
    position: 'absolute',
    top: -12,
    right: -16,
    backgroundColor: '#ef4444',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  mainNav: {
    flexDirection: 'row',
    gap: 8,
    position: 'relative',
  },
  navItem: {
    paddingBottom: 4,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 18,
    width: 50,
    height: 2,
    backgroundColor: Colors.white,
  },
  navText: {
    fontFamily: "Open Sans",
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    textTransform: 'uppercase',
  },
  navTextActive: {
    color: Colors.white,
  },
  navTextInactive: {
    color: '#888',
  },
  pillsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  pill: {
    width: 77,
    height: 31,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  activePill: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  pillText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '400',
  },
  notificationIcon: {
    width: 28,
    height: 28,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default FeedScreen;
