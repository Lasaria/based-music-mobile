import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageUploadScreen = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  // Request permissions (needed for iOS)
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission needed',
          'Sorry, we need camera roll permissions to upload images!'
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async (type) => {
    const hasPermission = await requestPermissions();
    
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        if (type === 'profile') {
          setProfileImage(result.assets[0].uri);
        } else {
          setCoverImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const handleUpload = async () => {
    try {
      // Here you would typically:
      // 1. Convert images to base64 or FormData
      // 2. Send to your server
      // 3. Handle the response
      
      Alert.alert('Success', 'Images uploaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload images');
      console.error('Upload error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile Setup</Text>

      {/* Cover Image Section */}
      <View style={styles.imageSection}>
        <Text style={styles.label}>Cover Image</Text>
        <TouchableOpacity 
          style={styles.coverImageContainer}
          onPress={() => pickImage('cover')}
        >
          {coverImage ? (
            <Image
              source={{ uri: coverImage }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.placeholderCover}>
              <Text style={styles.placeholderText}>Tap to add cover image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Profile Image Section */}
      <View style={styles.imageSection}>
        <Text style={styles.label}>Profile Image</Text>
        <TouchableOpacity 
          style={styles.profileImageContainer}
          onPress={() => pickImage('profile')}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderProfile}>
              <Text style={styles.placeholderText}>Tap to add profile image</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Upload Button */}
      <TouchableOpacity 
        style={[
          styles.uploadButton,
          (!profileImage && !coverImage) && styles.uploadButtonDisabled
        ]}
        onPress={handleUpload}
        disabled={!profileImage && !coverImage}
      >
        <Text style={styles.uploadButtonText}>Upload Images</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderCover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderProfile: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    color: '#666',
    textAlign: 'center',
    padding: 10,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadButtonDisabled: {
    backgroundColor: '#ccc',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImageUploadScreen;