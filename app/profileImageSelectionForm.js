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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ProfileImageScreen = ({ route, navigation }) => {
  const { profileData, selectedGenres } = useLocalSearchParams();
  const [image, setImage] = useState(null);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Please grant photo library permissions to upload a profile picture.',
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleNext = () => {
    if (!image) {
      Alert.alert(
        'No Profile Picture',
        'Are you sure you want to continue without a profile picture?',
        [
          {
            text: 'Add Picture',
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
      pathname: 'coverImageSelectionForm',
      params: {
        profileData,
        selectedGenres,
        profileImage: image,
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Add Profile Picture</Text>
      
      <View style={styles.imageContainer}>
        {image ? (
          <TouchableOpacity 
            style={styles.imagePreview} 
            onPress={pickImage}
          >
            <Image 
              source={{ uri: image }} 
              style={styles.imagePreview} 
            />
            <View style={styles.editOverlay}>
              <MaterialIcons name="edit" size={24} color="white" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholderContainer}>
            <MaterialIcons name="person" size={80} color="#666" />
            <Text style={styles.placeholderText}>
              Add a profile picture
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
    marginBottom: 32,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#e1e1e1',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingBottom: 34, // Extra padding for notched devices
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

export default ProfileImageScreen;