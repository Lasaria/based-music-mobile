// CommentInput.js
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { tokenManager } from "../utils/tokenManager"; 

const API_URL = SERVER_URL;

export const CommentInput = ({ postId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const token = await tokenManager.getAccessToken();
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: comment.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComment('');
      if (onCommentAdded) {
        onCommentAdded(data);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
          maxLength={1000}
          editable={!isSubmitting}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!comment.trim() || isSubmitting) && styles.sendButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={!comment.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Ionicons name="send" size={24} color={comment.trim() ? "#007AFF" : "#A0A0A0"} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
      backgroundColor: '#f8f9fa',
      padding: 12,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    replyInputWrapper: {
      backgroundColor: '#fff',
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
      color: '#666',
      fontSize: 14,
    },
    replyButton: {
      backgroundColor: '#007AFF',
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