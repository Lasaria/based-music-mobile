import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { tokenManager } from "../utils/tokenManager";
import { Colors } from '../constants/Color';

const API_URL = SERVER_URL;
// ReplyInput.js
export const ReplyInput = ({ postId, currentUserId, commentId, onReplyAdded, onCancel }) => {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      const token = await tokenManager.getAccessToken();
      const response = await fetch(
        `${API_URL}/posts/${postId}/comments/${commentId}/replies`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            content: reply.trim()
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const data = await response.json();
      console.log("REPLY ADdED DATA: ", data)

      const userResponse = await fetch(`${API_URL}/users/${currentUserId}`, {
        method: 'GET'
      });

      if (!userResponse.ok) {
        throw new Error('Failed to add comment');
      }

      const userData = await userResponse.json();
      console.log(userData);

      setReply('');
      const newReply = {
        post_id: postId,
        reply_id: data.reply_id,
        content: reply.trim(),
        author_id: currentUserId,
        username: userData.username,  // Add these as props to CommentInput
        profile_image_url: userData.profile_image_url,  // Add these as props to CommentInput
        created_at: new Date().toISOString(),
        like_count: 0,
        likes: [],
        liked_by_user: false
      };


      if (onReplyAdded) {
        onReplyAdded(newReply);
      }
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error adding reply:', error);
      Alert.alert('Error', 'Failed to add reply. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.replyInputContainer}>
      <View style={styles.replyInputWrapper}>
        <TextInput
          style={styles.replyInput}
          placeholder="Write a reply..."
          placeholderTextColor={'#fff'}
          value={reply}
          onChangeText={setReply}
          multiline
          maxLength={500}
          editable={!isSubmitting}
          autoFocus
        />
        <View style={styles.replyButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.replyButton,
              (!reply.trim() || isSubmitting) && styles.replyButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!reply.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.replyButtonText}>Reply</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  // Comment Input Styles
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 40,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  sendButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },

  // Reply Input Styles
  replyInputContainer: {
    // backgroundColor: '#f8f9fa',
    padding: 12,
    color: '#fff'
    // borderTopWidth: 1,
  },
  replyInputWrapper: {
    // backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  replyInput: {
    minHeight: 40,
    maxHeight: 80,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
    color: 'white'
  },
  replyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    marginRight: 12,
    padding: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7
  },
  replyButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    minWidth: 70,
    alignItems: 'center',
  },
  replyButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});