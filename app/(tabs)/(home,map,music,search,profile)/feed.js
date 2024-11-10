import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from '../../../utils/tokenManager';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { LikesModal } from '../../../components/LikesModal';
import { CommentCard } from '../../../components/CommentCard';
import { CommentsSection } from '../../../components/CommentsSection';
import { PostCard } from '../../../components/PostCard';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts(1);
    fetchCurrentUser();
  }, []);
  

  const handlePostDeleted = (postId) => {
    // Remove the deleted post from state
    setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
  };

  const handleEditPost = (post) => {
    // Navigate to edit screen with post data
    console.log(post);
    router.push({ pathname: 'editPost', params: {
        post_id: post.post_id,
        content: post.content,
        image_urls: JSON.stringify(post.image_urls), // Arrays need to be stringified
        tags: JSON.stringify(post.tags),  // Arrays need to be stringified
        // any other attributes you need
      } });
    
  };

  const getAuthToken = async () => {
    try {
      const token = await tokenManager.getAccessToken();
      if (!token) throw new Error('No auth token found');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const id = await tokenManager.getUserId();
      // Implement your user info fetching logic here
      // For example:
      // const response = await fetch(`${API_URL}/user/profile`, {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });
      // const data = await response.json();
      // setCurrentUserId(data.user_id);
      setCurrentUserId(id); // Replace with actual user ID
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Failed to fetch user information');
    }
  };

  const fetchPosts = async (pageNum = 1) => {
    if (!hasMore && pageNum > 1) return;
  
    try {
      const response = await fetch(`${API_URL}/posts?page=${pageNum}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      
      // Check if we've reached the end of the posts
      if (data.length < 10) {
        setHasMore(false);
      }
  
      // Check like status for each post
      const postsWithLikeStatus = await Promise.all(
        data.map(async (post) => {
          //const likeStatus = await checkPostLikeStatus(post.post_id);
          return { ...post };
        })
      );
      
      // If refreshing or first page, replace posts
      // If loading more, append posts
      setPosts(prevPosts => {
        if (pageNum === 1) {
          return postsWithLikeStatus;
        } else {
          // Filter out any duplicates based on post_id
          const existingPostIds = new Set(prevPosts.map(post => post.post_id));
          const newPosts = postsWithLikeStatus.filter(post => !existingPostIds.has(post.post_id));
          return [...prevPosts, ...newPosts];
        }
      });
      
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    setError(null);
    setPosts([]); // Clear existing posts before refresh
    fetchPosts(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && !refreshing) {
      const nextPage = page + 1;
      setLoading(true);
      fetchPosts(nextPage);
    }
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => item.post_id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={currentUserId}
            onPostDeleted={handlePostDeleted}
            onEditPost={handleEditPost}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      <LikesModal
        visible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
        likes={selectedPostLikes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#fee',
    alignItems: 'center',
  },
  errorText: {
    color: '#c00',
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#c00',
  },
  retryButtonText: {
    color: '#c00',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  imageScrollView: {
    height: 200,
    marginBottom: 12,
  },
  postImage: {
    width: width - 64,
    height: 200,
    marginRight: 8,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  likeButton: {
    marginRight: 16,
  },
  countText: {
    marginRight: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  likeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  likeAuthor: {
    fontSize: 16,
  },
  likeDate: {
    color: '#666',
    fontSize: 12,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default FeedScreen;