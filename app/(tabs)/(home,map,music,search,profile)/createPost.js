import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import { Text } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { tokenManager } from '../../../utils/tokenManager';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const API_URL = SERVER_URL;

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Request permissions for iOS
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission required',
          'Sorry, we need camera roll permissions to upload images!'
        );
        return false;
      }
      return true;
    }
  };

  // Pick images from gallery
  const pickImage = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        // Limit to 4 images
        const newImages = result.assets.slice(0, 4 - images.length);
        setImages([...images, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Error picking image:', error);
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // Create post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags));

      // Append images with the correct field name 'files'
      images.forEach((image, index) => {
        const imageUri = image.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg'; // Default to jpeg if no extension

        formData.append('files', {
          uri: imageUri,
          name: filename,
          type,
        });
      });

      // Get the authentication token
      const token = await tokenManager.getAccessToken();

      // Make API request
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      Alert.alert('Success', 'Post created successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create post. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get auth token - implement based on your storage method
  const getAuthToken = async () => {
    try {
      // Example using AsyncStorage:
      // return await AsyncStorage.getItem('userToken');
      
      // Or if you're using a secure store:
      // return await SecureStore.getItemAsync('userToken');
      
      // Replace this with your actual token retrieval logic
      return 'your-auth-token';
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  };

  // Validate file type
  const validateFileType = (uri) => {
    const allowedTypes = ['jpg', 'jpeg', 'png', 'heic'];
    const extension = uri.split('.').pop().toLowerCase();
    return allowedTypes.includes(extension);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Content Input */}
        <TextInput
          style={styles.input}
          multiline
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          maxLength={1000} // Add a reasonable character limit
        />

        {/* Character Count */}
        <Text style={styles.charCount}>
          {content.length}/1000
        </Text>

        {/* Image Preview */}
        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Image Upload Button */}
        {images.length < 4 && (
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={pickImage}
          >
            <Ionicons name="image" size={24} color="#007AFF" />
            <Text style={styles.uploadButtonText}>
              Add Images ({images.length}/4)
            </Text>
          </TouchableOpacity>
        )}

        {/* Tags Input */}
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={styles.tag}
              onPress={() => removeTag(index)}
            >
              <Text style={styles.tagText}>{tag}</Text>
              <Ionicons name="close-circle" size={16} color="white" />
            </TouchableOpacity>
          ))}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addTag}
              maxLength={20}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!content.trim() || isLoading) && styles.submitButtonDisabled
          ]}
          onPress={handleCreatePost}
          disabled={!content.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Create Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  input: {
    minHeight: 100,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  charCount: {
    textAlign: 'right',
    color: '#666',
    marginBottom: 16,
    fontSize: 12,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageWrapper: {
    width: '48%',
    aspectRatio: 1,
    margin: '1%',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#007AFF',
    marginLeft: 8,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    minHeight: 40,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: 'white',
    marginRight: 4,
  },
  tagInputContainer: {
    flex: 1,
    minWidth: 100,
  },
  tagInput: {
    padding: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreatePostScreen;