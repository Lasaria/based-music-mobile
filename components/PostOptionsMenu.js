// PostOptionsMenu.js
import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { tokenManager } from '../utils/tokenManager';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

const PostOptionsMenu = ({ post, currentUserId, onPostDeleted, onEditPost }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthor = post.author_id === currentUserId;

  const handleDeletePost = async () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setMenuVisible(false)
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const token = await tokenManager.getAccessToken();
              const response = await fetch(`${API_URL}/posts/${post.post_id}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });

              if (!response.ok) throw new Error('Failed to delete post');

              setMenuVisible(false);
              onPostDeleted(post.post_id);
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Only show menu if user is author
  if (!isAuthor) return null;

  return (
    <View>
      {/* Three dots icon */}
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.menuIcon}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
      </TouchableOpacity>

      {/* Options Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setMenuVisible(false);
                onEditPost(post);
              }}
            >
              <Ionicons name="pencil" size={24} color="#007AFF" />
              <Text style={styles.optionText}>Edit Post</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, styles.deleteOption]}
              onPress={handleDeletePost}
              disabled={loading}
            >
              <Ionicons name="trash" size={24} color="#FF3B30" />
              <Text style={[styles.optionText, styles.deleteText]}>
                {loading ? 'Deleting...' : 'Delete Post'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, styles.cancelOption]}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  menuIcon: {
    padding: 8,
    marginLeft: 'auto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 12,
    color: '#007AFF',
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  deleteText: {
    color: '#FF3B30',
  },
  cancelOption: {
    marginTop: 8,
    borderBottomWidth: 0,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default PostOptionsMenu;