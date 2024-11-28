import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../../constants/Color';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  withSpring
} from 'react-native-reanimated';
import { useNavigation } from 'expo-router';
import { tokenManager } from '../../../utils/tokenManager';
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { fetchPost } from "../../../utils/fetchCalls";

const { width } = Dimensions.get('window');
const API_URL = SERVER_URL;

const CreatePostScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputHeight = useSharedValue(70); // Initial height of the TextInput container

  const suggestedTags = ['Creative', 'DJ', 'LiveMusic', 'Vibes', 'Beat', 'Studio', 'Concert', 'Instrument'];

  //  Request permissions for iOS
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

  // Toggle tags
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
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
      const response = await fetchPost({
        url: `${API_URL}/posts`,
        body: formData,
      });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    //   }

    //   const data = await response.json();

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

  const handleFocus = () => {
    setIsFocused(true);
    inputHeight.value = withSpring(175);  // Target height when focused
  };

  // Handle blur event (when the input field loses focus)
  const handleBlur = () => {
    setIsFocused(false);
    inputHeight.value = withSpring(120);  // Original height when blurred
  };

  // Animated style for the text area container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: inputHeight.value,  // Apply the animated height
    };
  });


  const wordCount = content.trim().split(/\s+/).filter(Boolean).join('').length;

  const handleTagTextChange = (text) => {
    setTagInput(text);
    setShowAddIcon(text.trim().length >= 3); // Add icon if user types at least 3 letters
  };

  const isPostEnabled = content.trim() && images.length > 0;

  // Animation Scroll Handling
  const scrollY = useSharedValue(0);
  const containerOneOffset = useSharedValue(0);
  const containerTwoOffset = useSharedValue(0);
  const containerThreeOffset = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;

      containerOneOffset.value = interpolate(
        scrollY.value,
        [0, 200],
        [0, -50],
        Extrapolate.CLAMP
      );

      containerTwoOffset.value = interpolate(
        scrollY.value,
        [200, 400],
        [0, -50],
        Extrapolate.CLAMP
      );

      containerThreeOffset.value = interpolate(
        scrollY.value,
        [400, 600],
        [0, -50],
        Extrapolate.CLAMP
      );
    },
  });

  const containerOneStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: containerOneOffset.value }],
      zIndex: containerOneOffset.value === 0 ? 3 : 1,
    };
  });

  const containerTwoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: containerTwoOffset.value }],
      zIndex: containerTwoOffset.value === 0 ? 3 : 2,
    };
  });

  const containerThreeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: containerThreeOffset.value }],
      zIndex: containerThreeOffset.value === 0 ? 3 : 1,
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={headerStyle}>
        <View
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity onPress={handleCreatePost}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[styles.postButtonText, (!isPostEnabled || isLoading) && styles.disabledPostButton]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.containerBox, containerOneStyle]}>
          <Animated.View style={[styles.textAreaContainer, animatedStyle]}>
            <TextInput
              style={styles.textArea}
              placeholder="What's on your mind?"
              placeholderTextColor="#8c8e96"
              multiline
              value={content}
              onChangeText={setContent}
              onFocus={handleFocus}  // Trigger the focus function
              onBlur={handleBlur}    // Trigger the blur function
            />
            <Text style={styles.wordCount}>
              {content.length} / 1000
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.containerBox, containerTwoStyle]}>
          <View style={styles.sectionHeader}>
            <Feather name="image" size={24} color='#8c8e96' />
            <Text style={styles.sectionTitle}>Upload Photos</Text>
            <Text style={styles.imageLimit}>{images.length}/4</Text>
          </View>
          <View style={styles.imageGrid}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image.uri }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            ))}
            {images.length < 4 && (
              <TouchableOpacity style={[styles.imageContainer, styles.addImageButton]} onPress={pickImage}>
                <Ionicons name="add-circle-outline" size={28} color="#8c8e96" />
              </TouchableOpacity>
            )}
            <Text style={styles.note}>
              Add up to 4 images to make your post more engaging
            </Text>

          </View>
        </Animated.View>

        <Animated.View style={[styles.containerBox, containerThreeStyle]}>
          <View style={styles.sectionHeader}>
            <Feather name="tag" size={20} color='#8c8e96' />
            <Text style={styles.sectionTitle}>Add Tags</Text>
            <Text style={styles.imageLimit}>optional</Text>
          </View>

          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a new tag"
              placeholderTextColor="#666"
              value={tagInput}
              onChangeText={handleTagTextChange}
              onSubmitEditing={addTag}
            />
            {showAddIcon && (
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={addTag}
              >
                <Feather name="check" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tags}>
            {tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={styles.tagChip}
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
                <Ionicons name="close" size={16} color="white" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.suggestedTitle}>Suggested Tags</Text>
          <View style={styles.suggestedTags}>
            {suggestedTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.suggestedChip,
                  tags.includes(tag) && styles.selectedSuggestedChip
                ]}
                onPress={() => toggleTag(tag)}
              >
                <Text style={[
                  styles.suggestedText,
                  tags.includes(tag) && styles.selectedSuggestedText
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
    marginTop: 120,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  postButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  disabledPostButton: {
    color: '#666',
  },
  containerBox: {
    backgroundColor: '#222329',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  textAreaContainer: {
    width: '100%',
    backgroundColor: '#222329',
    borderRadius: 16,
    paddingHorizontal: 4,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden', // Ensure content doesn't overflow when animating
    position: 'relative', // To allow absolute positioning inside
  },
  textArea: {
    color: 'white',
    fontSize: 14,
    textAlignVertical: 'top',
    flex: 1,
    minHeight: 120, // Make sure there is space to show content
  },
  wordCount: {
    color: '#8c8e96',
    fontSize: 12,
    position: 'absolute',
    bottom: 8, // Position from the bottom
    right: 16, // Position from the right
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 8,
  },
  imageLimit: {
    color: '#8c8e96',
    marginLeft: 'auto',
  },
  note: {
    color: '#8c8e96',
    fontSize: 12,
    marginBottom: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: '48%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#8c8e96',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 142, 150, 0.1)',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tagInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#8c8e96',
    borderRadius: 8,
    color: 'white',
    backgroundColor: '#1E1E1E',
    marginRight: 8,
  },
  addTagButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 14,
  },
  suggestedTitle: {
    color: '#8c8e96',
    fontSize: 14,
    marginBottom: 12,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8c8e96',
  },
  selectedSuggestedChip: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8c8e96',
  },
  suggestedText: {
    color: '#8c8e96',
    fontSize: 14,
  },
  selectedSuggestedText: {
    color: 'white',
  },
});

export default CreatePostScreen;








