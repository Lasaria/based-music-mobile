// deleteActions.js
import { tokenManager } from "../utils/tokenManager"; 
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

export const deleteComment = async (postId, commentId) => {
  try {
    const token = await tokenManager.getAccessToken();
    const response = await fetch(
      `${API_URL}/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }

    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const deleteReply = async (postId, commentId, replyId) => {
  try {
    const token = await tokenManager.getAccessToken();
    const response = await fetch(
      `${API_URL}/posts/${postId}/comments/${commentId}/replies/${replyId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete reply');
    }

    return true;
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
};