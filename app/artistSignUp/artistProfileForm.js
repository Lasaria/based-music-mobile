import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../constants/Color.js'
import { Ionicons } from 'react-native-vector-icons'
import InputComponent from '../../components/InputComponent.js';
import { ArtistService } from '../../services/artistService.js';


const SelectInformationPage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [genre, setGenre] = useState('');
  const router = useRouter();

  const handleNextPress = async () => {
    // Logic to handle the next button press
    console.log("Name:", name);
    console.log("Bio:", bio);
    console.log("Genre:", genre);
    try{
        await ArtistService.setArtistBasicInfo({name, bio, genre});
        router.push("./artistImageUpload");
        // For now, even if the above fails, we re route to the artist profile page
        // router.replace('(profile)/artistProfile'); // Replace with your next screen
    } catch(err) {
        console.log("Error setting artist basic info", err)
        throw(err);
    }
    
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('Image picker error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        setAvatarUri(imageUri); // Set the selected image URI
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerText}>Who are you ?</Text>

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Image source={require('../../assets/images/profile1.png')} style={styles.backgroundImage} />
        <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
        <TouchableOpacity style={styles.cameraIconContainer} onPress={openImagePicker}>
          <Ionicons name="camera-outline" size={36} color="white" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <InputComponent
          placeholder="Name"
          placeholderTextColor={Colors.secondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="none"
          style={styles.input}
        />
        <Text>{" "}</Text>
        <InputComponent
          placeholder="Bio"
          placeholderTextColor={Colors.secondary}
          value={bio}
          onChangeText={setBio}
          autoCapitalize="none"
          style={[styles.input, styles.inputMargin]}
        />
        <Text>{" "}</Text>
        <InputComponent
          placeholder="Genre"
          placeholderTextColor={Colors.secondary}
          value={genre}
          onChangeText={setGenre}
          autoCapitalize="none"
          style={[styles.input, styles.inputMargin]}
        />
      </View>

      {/* Next Button */}
      <View style={styles.buttonFrame}>
        <Text style={styles.nextButtonText}>Next</Text>
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
  },
  headerText: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 34,
    marginTop: 100,
  },
  backgroundImage: {
    width: 393,
    height: 170,
    resizeMode: 'cover',
    marginTop: 24,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    position: 'absolute',
    top: 50,
    left: 165,
    width: 70,
    height: 70,
    borderRadius: 24,
    marginTop: 100,
  },
  cameraIconContainer: {
    position: 'absolute',
    top: 85,
    left: '46%',
    padding: 8,
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 20, // Add padding for better alignment
    marginTop: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 10,
    padding: 10,
    color: 'white',
    fontSize: 16,
    backgroundColor: '#1c1c1c',
    width: '100%',
  },
  inputMargin: {
    marginTop: 16, // Adds margin between the inputs
  },
  buttonFrame: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 30,
  },
  nextButton: {
    backgroundColor: '#6e00ff',
    width: 56,
    height: 56,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SelectInformationPage;