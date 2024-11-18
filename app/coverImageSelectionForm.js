import React, { useState } from 'react';
import { router } from 'expo-router';
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
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import useProfileStore from '../zusStore/userFormStore';
import { UserService } from '../services/UserService';
import ProgressBar from '../components/ProgressBar';
import { Colors } from '../constants/Color';

const { width } = Dimensions.get('window');
const COVER_ASPECT_RATIO = 16 / 9;
const COVER_HEIGHT = width / COVER_ASPECT_RATIO;

const CoverPhotoScreen = () => {
  const { coverImage, updateField } = useProfileStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      if (!result.canceled && result.assets[0]?.uri) {
        updateField('coverImage', result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = () => {
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
            onPress: submitProfile,
          },
        ]
      );
    } else {
      submitProfile();
    }
  };

  const submitProfile = async () => {
    setIsSubmitting(true);
    try {
      await UserService.setupUserProfile();
      router.replace('profileCreationSuccess');
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={4} />
      <Text style={styles.header}>Add Cover Image</Text>
      <Text style={styles.subHeader}>
        Add photo from your camera roll or file to add to your profile.
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
                <MaterialIcons name="edit" size={20} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.placeholderContainer} onPress={pickImage}>
            <FontAwesome name="image" size={100} color="#ccc" />
            <Text style={styles.placeholderSubText}>
              Recommended size: 1920 x 1080
            </Text>
            {!coverImage && (
              <View style={styles.addIcon}>
                <FontAwesome name="plus" size={16} color="#000" />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {coverImage && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => updateField('coverImage', null)}
        >
          <MaterialIcons name="delete-outline" size={24} color="#ff3b30" />
          <Text style={styles.removeButtonText}>Remove Photo</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Create Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  header: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 8,
  },
  subHeader: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    opacity: 0.7,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderContainer: {
    width: width - 78,
    height: COVER_HEIGHT,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    position: 'relative',
    marginTop: 56,
  },
  addIcon: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#FFFFFF',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Colors.background,
  },
  placeholderSubText: {
    color: Colors.white,
    opacity: 0.8
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
  coverPreviewContainer: {
    width: width - 78,
    height: COVER_HEIGHT,
    borderRadius: 12,
    marginTop: 56,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  bottomContainer: {
    marginTop: 24,
    paddingBottom: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 30,
    marginVertical: 20,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CoverPhotoScreen;