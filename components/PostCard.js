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

import PostOptionsMenu from './PostOptionsMenu';
import { CommentsSection } from './CommentsSection';
import { CommentCard } from './CommentCard';
import { CommentInput } from './CommentInput';
import { formatDate } from '../utils/functions';
import { LikesModal } from './LikesModal';
import { confirmDelete } from './DeleteConfirmDialog';
import { deleteComment } from './DeleteActions';

import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

// PostCard.js - Component for individual posts
export const PostCard = ({ post, currentUserId, onPostDeleted, onEditPost }) => {
    const [showComments, setShowComments] = useState(false);

    const [comments, setComments] = useState([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isLiked, setIsLiked] = useState(post.liked || false);
    const [likeCount, setLikeCount] = useState(post.like_count || 0);
    const [commentCount, setCommentCount] = useState(post.comment_count || 0);
    const [likesModalVisible, setLikesModalVisible] = useState(false);
    const [selectedLikes, setSelectedLikes] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        checkLikeStatus();
      }, []);

    // Fetch comments when comments section is opened
  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

    const fetchComments = async () => {
        setIsLoadingComments(true);
        try {
          const token = await tokenManager.getAccessToken();
          const response = await fetch(`${API_URL}/posts/${post.post_id}/comments`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) throw new Error('Failed to fetch comments');
          const data = await response.json();
          setComments(data.comments);
        } catch (error) {
          console.error('Error fetching comments:', error);
        } finally {
          setIsLoadingComments(false);
        }
      };

      const checkLikeStatus = async () => {
        try {
          const token = await tokenManager.getAccessToken();
          const response = await fetch(
            `${API_URL}/posts/${post.post_id}/like-status`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (!response.ok) throw new Error('Failed to check like status');
          const data = await response.json();
          setIsLiked(data.liked);
        } catch (error) {
          console.error('Error checking like status:', error);
        }
      };
    
      const handleLike = async () => {
        try {
          const token = await tokenManager.getAccessToken();
          const response = await fetch(`${API_URL}/posts/${post.post_id}/like`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!response.ok) throw new Error('Failed to like post');
          
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
        } catch (error) {
          console.error('Error liking post:', error);
          Alert.alert('Error', 'Failed to like post');
        }
      };
    
      const handleUnlike = async () => {
        try {
          const token = await tokenManager.getAccessToken();
          const response = await fetch(`${API_URL}/posts/${post.post_id}/unlike`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
    
          if (!response.ok) throw new Error('Failed to unlike post');
          
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
        } catch (error) {
          console.error('Error unliking post:', error);
          Alert.alert('Error', 'Failed to unlike post');
        }
      };
    
      const handlePressLikes = async () => {
        try {
          const token = await tokenManager.getAccessToken();
          const response = await fetch(
            `${API_URL}/posts/${post.post_id}/likes`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );
          
          if (!response.ok) throw new Error('Failed to fetch likes');
          
          const data = await response.json();
          setSelectedLikes(data.likes);
          setLikesModalVisible(true);
        } catch (error) {
          console.error('Error fetching likes:', error);
          Alert.alert('Error', 'Failed to load likes');
        }
      };

    // Add this handler
  const handleCommentAdded = (newComment) => {
    // Add the new comment to the beginning of the comments array
    setComments(prevComments => [newComment, ...prevComments]);
    // Update comment count in post
    // post.comment_count += 1;
    setCommentCount(commentCount+ 1);
    // Show comments section if it's not already shown
    if (!showComments) {
      setShowComments(true);
    }
  };

  const handleDeleteComment = async (comment) => {
    if (isDeleting) return;
    console.log("COMMENT IN COMMENT CARD: ", comment)

    confirmDelete('comment', async () => {
      setIsDeleting(true);
      try {
        await deleteComment(post.post_id, comment.comment_id);
        setCommentCount(commentCount - 1);
        setComments(prevComments => prevComments.filter(c => c.comment_id !== comment.comment_id));
      } catch (error) {
        onError('Failed to delete comment');
      } finally {
        setIsDeleting(false);
      }
    });
  };
  
    return (
      <View style={styles.postCard}>
        {/* Author Info */}
        <View style={styles.postHeader}>
        <Image
            source={{ uri: post.profile_image_url }}
            style={styles.profileImage}
          />
          <Text style={styles.authorText}>{post.username}</Text>
          <Text style={styles.dateText}>{formatDate(post.created_at)}</Text>
        </View>

        <PostOptionsMenu
          post={post}
          currentUserId={currentUserId}
          onPostDeleted={onPostDeleted}
          onEditPost={onEditPost}
        />
  
        {/* Content */}
        <Text style={styles.contentText}>{post.content}</Text>
  
        {/* Images */}
        {post.image_urls?.length > 0 && (
          <ScrollView horizontal style={styles.imageScrollView}>
            {post.image_urls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.postImage}
              />
            ))}
          </ScrollView>
        )}
  
        {/* Like and Comment Counts */}
        <View style={styles.interactionBar}>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={() => isLiked ? handleUnlike() : handleLike()}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={isLiked ? "red" : "black"}
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handlePressLikes}>
          <Text style={styles.countText}>{likeCount} likes</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowComments(!showComments)}>
          <Text style={styles.countText}>{commentCount} comments</Text>
        </TouchableOpacity>
      </View>
  
        {/* Comments Section */}
      {showComments && (
        <>
          {isLoadingComments ? (
            <ActivityIndicator size="small" color="#0000ff" style={styles.loadingIndicator} />
          ) : (
            <CommentsSection
              onCommentDeleted={handleDeleteComment}
              isDeleting={isDeleting}
              isLoadingComments={isLoadingComments}
              postId={post.post_id} 
              comments={comments}
              commentCount={commentCount}
              setCommentCount={setCommentCount}
              currentUserId={currentUserId}
            />
          )}
          <CommentInput 
            postId={post.post_id} 
            onCommentAdded={handleCommentAdded}
          />
        </>
      )}

        <LikesModal
        visible={likesModalVisible}
        onClose={() => setLikesModalVisible(false)}
        likes={selectedLikes}
        />
        </View>
    );
  };


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    // Additional styles for author info with profile image
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
  authorInfo: {
    flex: 1,
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
  loadingIndicator: {
    padding: 20,
  },
});