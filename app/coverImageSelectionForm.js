import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const COVER_ASPECT_RATIO = 16 / 9;
const COVER_HEIGHT = width / COVER_ASPECT_RATIO;

const CoverPhotoScreen = ({ route, navigation }) => {
  const { profileData, selectedGenres, profileImage } = useLocalSearchParams();
  const [coverImage, setCoverImage] = useState(null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant photo library permissions to upload a cover photo.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setCoverImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleNext = () => {
    if (!coverImage) {
      Alert.alert(
        'No Cover Photo',
        'Are you sure you want to continue without a cover photo?',
        [
          {
            text: 'Add Photo',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: () => navigateNext(),
          },
        ]
      );
    } else {
      navigateNext();
    }
  };

  const navigateNext = () => {
    router.push({ 
      pathname: 'addMultipleProfileImagesForm',
      params: {
        profileData,
        selectedGenres,
        profileImage,
        coverImage,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add Cover Photo</Text>
      <Text style={styles.subHeader}>
        Choose a photo to display at the top of your profile
      </Text>
      
      <View style={styles.imageContainer}>
        {coverImage ? (
          <TouchableOpacity onPress={pickImage}>
            <View style={styles.coverPreviewContainer}>
              <Image 
                source={{ uri: coverImage }} 
                style={styles.coverPreview}
                resizeMode="cover"
              />
              <View style={styles.editOverlay}>
                <MaterialIcons name="edit" size={24} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="photo-library" size={48} color="#666" />
            <Text style={styles.placeholderText}>
              Add a cover photo
            </Text>
            <Text style={styles.placeholderSubText}>
              Recommended size: 1920 x 1080
            </Text>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={pickImage}
        >
          <MaterialIcons name="photo-library" size={24} color="white" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {coverImage && (
        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => setCoverImage(null)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#ff3b30" />
          <Text style={styles.removeButtonText}>Remove Photo</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderContainer: {
    width: width - 32,
    height: COVER_HEIGHT,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  placeholderSubText: {
    marginTop: 4,
    fontSize: 14,
    color: '#999',
  },
  coverPreviewContainer: {
    width: width - 32,
    height: COVER_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#1DB954',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  buttonContainer: {
    gap: 16,
  },
  uploadButton: {
    backgroundColor: '#1DB954',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    marginTop: 16,
  },
  removeButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  nextButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CoverPhotoScreen;