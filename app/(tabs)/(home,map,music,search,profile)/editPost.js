// app/(app)/posts/[id]/edit.js
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet
} from 'react-native';
import { Text } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { fetchPatch } from "../../../utils/fetchCalls";

const API_URL = SERVER_URL;
import { tokenManager } from '../../../utils/tokenManager';
import * as ImagePicker from 'expo-image-picker';

const EditPostScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params);
  
  // Parse the post data from params
//   const post = {
//     ...params,
//     image_urls: params.image_urls ? JSON.parse(params.image_urls) : [],
//     tags: params.tags ? JSON.parse(params.tags) : [],
//   };

//   console.log(post);

// Safely parse tags
let initialTags = [];
try {
  initialTags = params.tags ? JSON.parse(params.tags) : [];
  if (!Array.isArray(initialTags)) {
    initialTags = [];
  }
} catch (error) {
  console.error('Error parsing tags:', error);
  initialTags = [];
}


// Safely images
let initialImages = [];
try {
    initialImages = params.image_urls ? JSON.parse(params.image_urls) : [];
  if (!Array.isArray(initialImages)) {
    initialImages = [];
  }
} catch (error) {
  console.error('Error parsing image_urls:', error);
  initialImages = [];
}

  // Initialize state with parsed post data
  const [content, setContent] = useState(params.content || '');
  const [existingImages, setExistingImages] = useState(initialImages);
  const [newImages, setNewImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [tags, setTags] = useState(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Calculate total images and remaining slots
  const totalImagesCount = existingImages.length + newImages.length;
  const remainingSlots = 10 - totalImagesCount;

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Post content cannot be empty');
      return;
    }

    setIsSaving(true);

    try {
      const token = await tokenManager.getAccessToken();
      const formData = new FormData();

      // Add text content
      formData.append('content', content.trim());
      
      // Add tags
      formData.append('tags', JSON.stringify(tags));

      // Add removed images
      if (removedImages.length > 0) {
        formData.append('removed_media', JSON.stringify(removedImages));
      }

      // Add new images
      newImages.forEach((image) => {
        const imageUri = image.uri;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('files', {
          uri: imageUri,
          name: filename,
          type,
        });
      });

      const response = await fetchPatch({
        url: `${API_URL}/posts/${params.post_id}`,
        body: formData
      });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Failed to update post');
    //   }

    //   const updatedPost = await response.json();
      router.back();

    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', error.message || 'Failed to update post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    if (totalImagesCount >= 10) {
      Alert.alert('Error', 'Maximum 10 images allowed');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled) {
        const newSelectedImages = result.assets.slice(0, remainingSlots);
        setNewImages([...newImages, ...newSelectedImages]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Post',
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveButton}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#007AFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container}>
        <TextInput
          style={styles.contentInput}
          multiline
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          maxLength={1000}
        />

        <Text style={styles.characterCount}>
          {content.length}/1000
        </Text>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <View style={styles.imagesContainer}>
            {existingImages.map((imageUrl, index) => (
              <View key={`existing-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => {
                    setRemovedImages([...removedImages, imageUrl]);
                    setExistingImages(existingImages.filter((_, i) => i !== index));
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* New Images */}
        {newImages.length > 0 && (
          <View style={styles.imagesContainer}>
            {newImages.map((image, index) => (
              <View key={`new-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setNewImages(newImages.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Image Button */}
        {totalImagesCount < 10 && (
          <TouchableOpacity 
            style={styles.addImageButton}
            onPress={handlePickImage}
          >
            <Ionicons name="image" size={24} color="#007AFF" />
            <Text style={styles.addImageText}>
              Add Images ({totalImagesCount}/10)
            </Text>
          </TouchableOpacity>
        )}

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => setTags(tags.filter((_, i) => i !== index))}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Ionicons name="close-circle" size={16} color="white" />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
              maxLength={20}
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={() => {
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }}
            >
              <Ionicons name="add-circle" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
    },
    contentInput: {
      minHeight: 100,
      backgroundColor: '#f8f8f8',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      marginBottom: 4,
    },
    characterCount: {
      textAlign: 'right',
      color: '#666',
      marginBottom: 16,
      fontSize: 12,
    },
    imagesContainer: {
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
    image: {
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
    addImageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: '#007AFF',
      borderRadius: 8,
      marginBottom: 16,
    },
    addImageText: {
      color: '#007AFF',
      marginLeft: 8,
      fontSize: 16,
    },
    tagsSection: {
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 8,
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
      flexDirection: 'row',
      alignItems: 'center',
    },
    tagInput: {
      flex: 1,
      backgroundColor: '#f8f8f8',
      borderRadius: 8,
      padding: 8,
      marginRight: 8,
    },
    addTagButton: {
      padding: 4,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,  // Add extra bottom margin for scrolling space
      },
      saveButtonDisabled: {
        backgroundColor: '#A0A0A0',
      },
      saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
      },
  });

export default EditPostScreen;