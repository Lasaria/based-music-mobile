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
import { fetchGet } from "../utils/fetchCalls";

const API_URL = SERVER_URL;

export const FolloweesModal = ({ visible, onClose, userId }) => {
  const [followees, setFollowees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (visible && userId) {
      fetchFollowees();
    }
  }, [visible, userId]);

  const fetchFollowees = async (key = null) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = await tokenManager.getAccessToken();
      const queryParams = new URLSearchParams({
        limit: '20',
        ...(key && { lastKey: key })
      }).toString();
      
      const response = await fetchGet({
        url: `${API_URL}/follow/listFollowees/${userId}`
        }
      );
      
      // if (!response.ok) throw new Error('Failed to fetch followees');
      
      const data = response;
      
      setFollowees(prev => key ? [...prev, ...data.followees] : data.followees);
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
      fetchFollowees(lastKey);
    }
  };

  const navigateToProfile = (followeeId) => {
    onClose(); // Close the modal first
    router.push({ pathname: 'profileIndex', params: { userId: followeeId } });
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
            <Text style={styles.modalTitle}>Following</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => fetchFollowees()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={followees}
              keyExtractor={(item) => item.followee_id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.followItem}
                  onPress={() => navigateToProfile(item.followee_id)}
                >
                  <View style={styles.followUserInfo}>
                    <Image 
                      source={{ uri: item.profile_image_url }}
                      style={styles.followUserImage}
                    />
                    <View style={styles.followUserText}>
                      <Text style={styles.followUsername}>{item.username}</Text>
                      {item.display_name ? (
                        <Text style={styles.followName}>{item.display_name}</Text>
                      ): 
                      (
                        <Text style={styles.followName}>{item.first_name}</Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.followeesList}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={
                !isLoading && (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Not following anyone yet</Text>
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
  followeesList: {
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