import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from "../utils/tokenManager";
import { router } from 'expo-router';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

export const FollowersModal = ({ visible, onClose, userId }) => {
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (visible && userId) {
      fetchFollowers();
    }
  }, [visible, userId]);

  const fetchFollowers = async (key = null) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await tokenManager.getAccessToken();
      const queryParams = new URLSearchParams({
        limit: '20',
        ...(key && { lastKey: key })
      }).toString();
      
      const response = await fetch(
        `${API_URL}/follow/listFollowers/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch followers');
      
      const data = await response.json();
      
      setFollowers(prev => key ? [...prev, ...data.followers] : data.followers);
      setLastKey(data.lastEvaluatedKey);
      setHasMore(!!data.lastEvaluatedKey);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchFollowers(lastKey);
    }
  };

  const navigateToProfile = (followerId) => {
    onClose(); // Close the modal first
    router.push({ pathname: 'profileIndex', params: { userId: followerId } });
  };

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footerContainer}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <TouchableOpacity onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Followers</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchFollowers()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={followers}
              keyExtractor={(item) => item.follower_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.followItem}
                  onPress={() => navigateToProfile(item.follower_id)}
                >
                  <View style={styles.followUserInfo}>
                    <Image 
                      source={{ uri: item.profile_image_url }}
                      style={styles.followUserImage}
                    />
                    <View style={styles.followUserText}>
                      <Text style={styles.followUsername}>{item.username}</Text>
                      {item.display_name && (
                        <Text style={styles.followName}>{item.display_name}</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.followersList}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                !isLoading && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No followers yet</Text>
                  </View>
                )
              }
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  followersList: {
    paddingHorizontal: 16,
  },
  followItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  followUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  followUserImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  followUserText: {
    flex: 1,
  },
  followUsername: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  followName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  retryButtonText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});