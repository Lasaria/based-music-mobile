import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as VideoThumbnails from 'expo-video-thumbnails';
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
  const [media, setMedia] = useState([]); // Changed from images to media to handle both
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputHeight = useSharedValue(70);

  const suggestedTags = ['Creative', 'DJ', 'LiveMusic', 'Vibes', 'Beat', 'Studio', 'Concert', 'Instrument'];

  // Request permissions for iOS
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaStatus !== 'granted') {
        Alert.alert(
          'Permission required',
          'Sorry, we need media library permissions to upload photos and videos!'
        );
        return false;
      }
      return true;
    }
  };

  // Validate file size
  const validateFileSize = async (uri) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const maxSize = 100 * 1024 * 1024; // 100MB limit
      if (fileInfo.size > maxSize) {
        Alert.alert('Error', 'File size must be less than 100MB');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking file size:', error);
      return false;
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Toggle tags
  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  // Pick media from gallery
  const pickMedia = async () => {
    if (!(await requestPermissions())) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        videoMaxDuration: 60, // 60 second limit
      });

      if (!result.canceled) {
        // Process and validate selected media
        const processedMedia = await Promise.all(
          result.assets.map(async (asset) => {
            if (!(await validateFileSize(asset.uri))) return null;

            return {
              ...asset,
              type: asset.type || (asset.uri.endsWith('.mp4') ? 'video' : 'image'),
              thumbnail: asset.type === 'video' ? await generateThumbnail(asset.uri) : null
            };
          })
        );

        // Filter out invalid media and limit to 4 items
        const validMedia = processedMedia
          .filter(item => item !== null)
          .slice(0, 4 - media.length);

        setMedia([...media, ...validMedia]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick media');
      console.error('Error picking media:', error);
    }
  };

  // Generate video thumbnail
  const generateThumbnail = async (videoUri) => {
    try {
      const thumbnail = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 0,
        quality: 0.5,
      });
      return thumbnail.uri;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };

  // Remove media
  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  // Render media item
  const renderMediaItem = (item, index) => {
    if (item.type === 'video') {
      return (
        <View style={styles.mediaContainer} key={index}>
          <Video
            source={{ uri: item.uri }}
            style={styles.media}
            useNativeControls
            resizeMode="cover"
            isLooping
            shouldPlay={false}
          />
          <View style={styles.videoBadge}>
            <Feather name="video" size={16} color="white" />
          </View>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeMedia(index)}
          >
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer} key={index}>
        <Image source={{ uri: item.uri }} style={styles.media} />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeMedia(index)}
        >
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  // Create post
  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('tags', JSON.stringify(tags));

      // Append media files
      media.forEach((item, index) => {
        const uri = item.uri;
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = item.type === 'video' 
          ? 'video/mp4'
          : match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('files', {
          uri: uri,
          name: filename,
          type,
        });
      });

      const response = await fetchPost({
        url: `${API_URL}/posts`,
        body: formData,
      });

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

  // [Previous animation and other helper functions remain the same]
  // ... [Keep all the animation setup code from the original file]
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

  const isPostEnabled = content.trim() && media.length > 0;

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
        <View style={styles.header}>
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
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <Text style={styles.wordCount}>
              {content.length} / 1000
            </Text>
          </Animated.View>
        </Animated.View>

        <Animated.View style={[styles.containerBox, containerTwoStyle]}>
          <View style={styles.sectionHeader}>
            <Feather name="image" size={24} color='#8c8e96' />
            <Text style={styles.sectionTitle}>Upload Media</Text>
            <Text style={styles.imageLimit}>{media.length}/4</Text>
          </View>
          <View style={styles.mediaGrid}>
            {media.map((item, index) => renderMediaItem(item, index))}
            {media.length < 4 && (
              <TouchableOpacity 
                style={[styles.mediaContainer, styles.addMediaButton]} 
                onPress={pickMedia}
              >
                <Ionicons name="add-circle-outline" size={28} color="#8c8e96" />
                <Text style={styles.addMediaText}>Add Photo or Video</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.note}>
            Add up to 4 photos or videos (max 60 seconds each)
          </Text>
        </Animated.View>

        {/* Tags section remains the same */}
        <Animated.View style={[styles.containerBox, containerThreeStyle]}>
          {/* ... [Keep the existing tags section code] */}
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
  // ... [Keep all existing styles]
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
  // Add new styles for media handling
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  mediaContainer: {
    width: '48%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  media: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
  addMediaButton: {
    borderWidth: 2,
    borderColor: '#8c8e96',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 142, 150, 0.1)',
  },
  addMediaText: {
    color: '#8c8e96',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CreatePostScreen;