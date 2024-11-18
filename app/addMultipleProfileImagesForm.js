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
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Color';
import ProgressBar from '../components/ProgressBar';
import useProfileStore from '../zusStore/userFormStore';

const MAX_PHOTOS = 6;

const AdditionalPhotosScreen = () => {
  const {
    additionalPhotos,
    profileImage,
    updateField
  } = useProfileStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

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
              <AntDesign name="minuscircleo" size={16} color={Colors.white} style={styles.removeIcon} />
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

    return (
      <TouchableOpacity
        style={styles.photoPlaceholder}
        onPress={pickImage}
      >
        <Ionicons name="add-circle-outline" size={24} color={Colors.white} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar currentStep={2} totalSteps={4} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Add Photos</Text>
        <Text style={styles.subHeader}>
          Add photos from your camera roll or files to add to your profile.
        </Text>

        <View style={styles.photoGrid}>
          {Array.from({ length: MAX_PHOTOS }).map((_, index) => (
            <View key={index} style={styles.photoSlot}>
              {renderPhotoSlot(additionalPhotos[index], index)}
            </View>
          ))}
        </View>

        <View style={styles.tipContainer}>
          <Text style={styles.tip}>
            Tip: Star your favorite photo to set it as your profile picture
          </Text>
        </View>
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
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.nextButtonText}>Next</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    gap: 12,
  },
  photoSlot: {
    width: '30%',
    aspectRatio: 1,
  },
  photoContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#e1e1e1',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: 107,
    height: 103,
    borderColor: Colors.white,
  },
  photoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    gap: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 58,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
  },
  removeIcon: {
    margin: 8,
  },
  starButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 18,
    padding: 4,
  },
  starButtonActive: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  tipContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginTop: 24,
  },
  tip: {
    fontSize: 14,
    color: 'gold',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  bottomContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#333',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  skipButtonText: {
    color: '#828796',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default AdditionalPhotosScreen;
