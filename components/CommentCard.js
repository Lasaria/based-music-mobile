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
import { ReplyCard } from './ReplyCard';
import { ReplyInput } from './ReplyInput';
import { confirmDelete } from './DeleteConfirmDialog';
import { deleteComment, deleteReply } from './DeleteActions';
import { formatDate } from '../utils/functions';
import { LikesModal } from './LikesModal';

import { tokenManager } from "../utils/tokenManager";
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { Colors } from '../constants/Color';

const API_URL = SERVER_URL;

// CommentCard.js - Component for individual comments
export const CommentCard = ({ onCommentDeleted, isDeleting, comment, comments, postId, currentUserId, setComments, commentCount, setCommentCount }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.like_count || 0);
  const [replyCount, setReplyCount] = useState(comment.reply_count || 0);
  const [isReplyDeleting, setIsReplyDeleting] = useState(false);
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [selectedLikes, setSelectedLikes] = useState([]);


  // const handleDeleteComment = async () => {
  //     if (isDeleting) return;
  //     console.log("COMMENT IN COMMENT CARD: ", comment)

  //     confirmDelete('comment', async () => {
  //       setIsDeleting(true);
  //       try {
  //         await deleteComment(postId, comment.comment_id);
  //         setCommentCount(commentCount - 1);
  //         setComments(prevComments => prevComments.filter(c => c.comment_id !== comment.comment_id));
  //       } catch (error) {
  //         onError('Failed to delete comment');
  //       } finally {
  //         setIsDeleting(false);
  //       }
  //     });
  //   };

  // Add this handler
  const handleReplyAdded = (newReply) => {
    setReplies([newReply, ...replies]);
    // Update reply count in comment
    setReplyCount(replyCount + 1);
    // Hide reply input after successful submission
    setShowReplyInput(false);
    if (!showReplies) {
      setShowReplies(true);
    }
  };

  useEffect(() => {
    fetchReplies()
  }, []);

  useEffect(() => {
    checkLikeStatus();
    // getLikeCount();
    // getReplyCount();
  }, [isLiked]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}/like-status`,
        {
          headers: {
            'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
          }
        }
      );
      const data = await response.json();
      setIsLiked(data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const getLikeCount = async () => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}`,
        {
          headers: {
            'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
          }
        }
      );
      const data = await response.json();
      console.log(data);
      setLikeCount(data.like_count);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const getReplyCount = async () => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}`,
        {
          headers: {
            'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
          }
        }
      );
      const data = await response.json();
      console.log(data);
      console.log(data.reply_count);
      setReplyCount(data.reply_count);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const toggleLike = async () => {
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const endpoint = isLiked ? 'unlike' : 'like';

      await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}/${endpoint}`,
        {
          method,
          headers: {
            'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
          }
        }
      );

      setIsLiked(!isLiked);
      // Update like count in UI
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setLikeCount(newLikeCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchReplies = async () => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}/replies`
      );
      const data = await response.json();
      console.log(data.replies[0]);
      setReplies(data.replies);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleShowReplies = () => {
    if (!showReplies) {
      fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const handleDeleteReply = async (reply) => {
    if (isReplyDeleting) return;
    console.log("REPLY IN REPLY CARD: ", reply);

    confirmDelete('reply', async () => {
      setIsReplyDeleting(true);
      try {
        console.log(postId, comment.comment_id, reply.reply_id)
        await deleteReply(postId, comment.comment_id, reply.reply_id);
        //onReplyDeleted(reply.reply_id);
        setReplyCount(replyCount - 1);
        setReplies(prevReplies => prevReplies.filter(r => r.reply_id !== reply.reply_id));
      } catch (error) {
      } finally {
        setIsReplyDeleting(false);
      }
    });
  };

  const handlePressLikes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${comment.comment_id}/likes`,
        {
          headers: {
            'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch likes');

      const data = await response.json();
      console.log(data);
      setSelectedLikes(data.likes);
      setLikesModalVisible(true);
    } catch (error) {
      console.error('Error fetching likes:', error);
      Alert.alert('Error', 'Failed to load likes');
    }
  };


  const isAuthor = currentUserId === comment.author_id;

  return (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={styles.authorContainer}>
          <Image
            source={{ uri: comment.profile_image_url }}
            style={styles.profileImage}
          />
          <Text style={styles.authorText}>{comment.username}</Text>
          <Text style={styles.dateText}>{formatDate(comment.created_at)}</Text>
        </View>

        {isAuthor && (
          <TouchableOpacity
            onPress={() => onCommentDeleted(comment)}
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

      <Text style={styles.commentContent}>{comment.content}</Text>

      <View style={styles.commentActions}>
        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "red" : "#A9A9A9"}
          />
          <Text style={styles.likeCount}>{likeCount}</Text>
        </TouchableOpacity>
        {replyCount > 0 && (
          <TouchableOpacity onPress={handleShowReplies}>
            <Text style={styles.replyButton}>
              {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setShowReplyInput(true)}
          style={{ flexDirection: 'row' }}
        >
          <Ionicons name="chatbubble-outline" size={16} color="#666" />
          <Text style={styles.replyText}>Reply</Text>
        </TouchableOpacity>

        {/* Add LikesModal */}
        <LikesModal
          visible={likesModalVisible}
          onClose={() => setLikesModalVisible(false)}
          likes={selectedLikes}
        />
      </View>


      {
        showReplies && replies.length > 0 && (
          <View style={styles.repliesContainer}>
            {replies.map(reply => (
              <ReplyCard
                key={reply.reply_id}
                onReplyDeleted={handleDeleteReply}
                reply={reply}
                comment={comment}
                comments={comments}
                setComments={setComments}
                postId={postId}
                commentId={comment.comment_id}
                currentUserId={currentUserId}
              />
            ))}
          </View>
        )
      }
      {
        showReplyInput && (
          <ReplyInput
            postId={postId}
            currentUserId={currentUserId}
            commentId={comment.comment_id}
            onReplyAdded={handleReplyAdded}
            onCancel={() => setShowReplyInput(false)}
          />
        )
      }
    </View >
  );
};


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 38,
    height: 38,
    borderRadius: 16,
    marginRight: 8,
  },
  authorText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
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
    color: Colors.white,
  },
  dateText: {
    fontSize: 12,
    color: Colors.white,
    opacity: 0.7
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
    // backgroundColor: '#f8f9fa',
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
  commentCard: {
    backgroundColor: '#363636', // Darker background for comment
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
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
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 12,
    color: '#A9A9A9',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  commentContent: {
    fontSize: 15,
    color: '#E0E0E0',
    lineHeight: 20,
    marginVertical: 4,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16, // Space between like and reply
  },
  likeCount: {
    marginLeft: 4,
    fontSize: 13,
    color: '#A9A9A9',
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#A9A9A9',
  },
});