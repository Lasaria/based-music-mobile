import React from 'react';
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
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import useProfileStore from '../zusStore/userFormStore';

const MAX_PHOTOS = 6;

const AdditionalPhotosScreen = () => {
  const { 
    additionalPhotos,
    profileImage,
    updateField
  } = useProfileStore();

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant photo library permissions to add photos.',
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
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        if (additionalPhotos.length >= MAX_PHOTOS) {
          Alert.alert('Maximum Photos', `You can only add up to ${MAX_PHOTOS} photos`);
          return;
        }
        
        const newPhotoUri = result.assets[0].uri;
        updateField('additionalPhotos', [...additionalPhotos, newPhotoUri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removePhoto = (indexToRemove) => {
    const newPhotos = additionalPhotos.filter((_, index) => index !== indexToRemove);
    
    if (additionalPhotos[indexToRemove] === profileImage) {
      updateField('profileImage', null);
    }
    
    updateField('additionalPhotos', newPhotos);
  };

  const toggleProfileImage = (photoUri) => {
    updateField('profileImage', profileImage === photoUri ? null : photoUri);
  };

  const handleNext = () => {
    if (additionalPhotos.length === 0) {
      Alert.alert('Error', 'Please add at least one photo');
      return;
    }

    if (!profileImage) {
      Alert.alert('Error', 'Please select a profile photo by starring one of the images');
      return;
    }

    router.push('coverImageSelectionForm');
  };

  const renderPhotoSlot = (photo, index) => {
    if (photo) {
      const isProfilePhoto = profileImage === photo;

      return (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo }} style={styles.photo} />
          <View style={styles.photoOverlay}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removePhoto(index)}
            >
              <MaterialIcons name="close" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.starButton, isProfilePhoto && styles.starButtonActive]}
              onPress={() => toggleProfileImage(photo)}
            >
              <MaterialIcons 
                name={isProfilePhoto ? "star" : "star-border"} 
                size={24} 
                color={isProfilePhoto ? "#FFD700" : "white"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Add Photos</Text>
        <Text style={styles.subHeader}>
          Add up to {MAX_PHOTOS} photos and star one as your profile photo
        </Text>

        <View style={styles.photoGrid}>
          {additionalPhotos.map((photo, index) => (
            <View key={index} style={styles.photoSlot}>
              {renderPhotoSlot(photo, index)}
            </View>
          ))}
          
          {additionalPhotos.length < MAX_PHOTOS && (
            <View style={styles.photoSlot}>
              <View style={styles.photoPlaceholder}>
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={pickImage}
                >
                  <MaterialIcons name="photo-library" size={32} color="#666" />
                  <Text style={styles.addPhotoText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <Text style={styles.tip}>
          Tip: Star your favorite photo to set it as your profile picture
        </Text>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (additionalPhotos.length === 0 || !profileImage) && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={additionalPhotos.length === 0 || !profileImage}
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  photoSlot: {
    width: '48%',
    aspectRatio: 4/5,
    marginBottom: 12,
  },
  photoContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#e1e1e1',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#e1e1e1',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoButton: {
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButtonActive: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  tip: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
  submitButton: {
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
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdditionalPhotosScreen;