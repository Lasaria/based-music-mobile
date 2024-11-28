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
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from "../utils/tokenManager"; 
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { confirmDelete } from '../components/DeleteConfirmDialog';
import { deleteReply } from '../components/DeleteActions';
import { formatDate } from '../utils/functions';
import { LikesModal } from './LikesModal';
import { fetchGet, fetchDelete, fetchPost } from "../utils/fetchCalls";

const API_URL = SERVER_URL;

// ReplyCard.js - Component for individual replies
export const ReplyCard = ({ onReplyDeleted, reply, comment, comments, setComments, postId, commentId, currentUserId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reply.like_count);
    const [isDeleting, setIsDeleting] = useState(false);
    const [likesModalVisible, setLikesModalVisible] = useState(false);
    const [selectedLikes, setSelectedLikes] = useState([]);
  
    useEffect(() => {
      checkLikeStatus();
      //getLikeCount();
    }, [isLiked]);

    
    
      const isAuthor = currentUserId === reply.author_id;
  
    const checkLikeStatus = async () => {
      try {
        const response = await fetchGet({
          url: `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}/like-status`
          }
        );
        const data = response;
        console.log(data);
        setIsLiked(data.liked);
      } catch (error) {
        console.error('Error checking reply like status:', error);
      }
    };

    const getLikeCount = async () => {
        try {
          const response = await fetchGet({
            url: `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}`
            }
          );
          const data = response;
          console.log(data);
          setLikeCount(data.reply.like_count);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
  
    const toggleLike = async () => {
      try {
        const method = isLiked ? 'DELETE' : 'POST';
        const endpoint = isLiked ? 'unlike' : 'like';
        
        // await fetch(
        //   `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}/${endpoint}`,
        //   {
        //     method,
        //     headers: {
        //       'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
        //     }
        //   }
        // );

        if (isLiked){
            await fetchDelete({
                url: `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}/unlike`,
                }
              );
          } else {
            await fetchPost({
                url: `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}/like`,
                }
              );
          }
        
        setIsLiked(!isLiked);
        const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
        setLikeCount(newLikeCount);
      } catch (error) {
        console.error('Error toggling reply like:', error);
      }
    };

    const handlePressLikes = async () => {
        try {
          const response = await fetchGet({
            url: `${API_URL}/posts/${postId}/comments/${commentId}/replies/${reply.reply_id}/likes`
            }
          );
          
          //if (!response.ok) throw new Error('Failed to fetch likes');
          
          const data = response;
          setSelectedLikes(data.likes);
          setLikesModalVisible(true);
        } catch (error) {
          console.error('Error fetching likes:', error);
          Alert.alert('Error', 'Failed to load likes');
        }
      };
  
    return (
      <View style={styles.replyCard}>
        <View style={styles.replyHeader}>
        <View style={styles.authorContainer}>
        <Image
            source={{ uri: reply.profile_image_url }}
            style={styles.profileImage}
          />
          <Text style={styles.authorText}>{reply.username}</Text>
          <Text style={styles.dateText}>{formatDate(reply.created_at)}</Text>
        </View>

        {isAuthor && (
          <TouchableOpacity 
            onPress={() => onReplyDeleted(reply)}
            disabled={isDeleting}
            style={styles.deleteButton}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#FF0000" />
            ) : (
              <Ionicons name="trash-outline" size={20} color="#FF0000" />
            )}
          </TouchableOpacity>
        )}
      </View>
  
        <Text style={styles.replyContent}>{reply.content}</Text>
  
        <View style={styles.replyActions}>
          <TouchableOpacity onPress={toggleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={16}
              color={isLiked ? "red" : "black"}
            />
          </TouchableOpacity>
          {/* <Text style={styles.likeCount}>{likeCount}</Text> */}
          <TouchableOpacity onPress={handlePressLikes}>
            <Text style={styles.likeCount}>{likeCount}</Text>
            </TouchableOpacity>

            {/* Add LikesModal */}
            <LikesModal
            visible={likesModalVisible}
            onClose={() => setLikesModalVisible(false)}
            likes={selectedLikes}
            />
        </View>
      </View>
    );
  };


  const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      profileImage: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
      },
      authorText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
      },
  // PostCard Styles
  postCard: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1a1a1a',
    padding: 12,
  },
  imageScrollView: {
    height: width * 0.7,
  },
  postImage: {
    width: width - 24,
    height: width * 0.7,
    resizeMode: 'cover',
  },
  interactionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  countText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },

  // CommentsSection Styles
  commentsSection: {
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  loadMoreButton: {
    padding: 8,
  },
  loadMoreText: {
    color: '#007AFF',
    fontSize: 14,
  },

  // CommentCard Styles
  commentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  commentDate: {
    fontSize: 11,
    color: '#666',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    marginRight: 16,
  },
  replyButton: {
    fontSize: 12,
    color: '#007AFF',
  },

  // RepliesSection Styles
  repliesSection: {
    marginLeft: 24,
    marginTop: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 12,
  },

  // ReplyCard Styles
  replyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  replyAuthor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  replyDate: {
    fontSize: 10,
    color: '#666',
  },
  replyContent: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1a1a1a',
    marginBottom: 6,
  },
  replyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyLikeCount: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },

  // LikesModal Styles
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
    paddingHorizontal: 16,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  likeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  likeAuthor: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  likeDate: {
    fontSize: 12,
    color: '#666',
  },

  // Common Interaction Styles
  interactionIcon: {
    marginRight: 4,
  },
  interactionText: {
    fontSize: 12,
    color: '#666',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },

  // Loading States
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },

  // Error States
  errorContainer: {
    padding: 16,
    backgroundColor: '#fff3f3',
    marginVertical: 8,
    borderRadius: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d32f2f',
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },

  // Empty States
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },

  // Image Viewer Styles
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  imageViewerHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  closeImageButton: {
    padding: 8,
  },
  imageCounter: {
    color: '#fff',
    fontSize: 16,
  },

  // Input Styles
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  inputText: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },

  // Tag Styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
});