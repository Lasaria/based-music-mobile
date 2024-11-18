import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import useProfileStore from '../zusStore/userFormStore';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import ProgressBar from '../components/ProgressBar';
import InputComponent from '../components/InputComponent';
import { Colors } from '../constants/Color';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { UserService } from '../services/UserService';
import { ActivityIndicator } from 'react-native';

const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXV0cjcwNG9zMmxwdnlxZWdoMjc5In0.NoBtaBj9cNvdemNp52pxGQ' });

const ProfileSetupScreen = () => {
  const {
    username,
    displayname,
    description,
    location,
    selectedGenres,
    updateField
  } = useProfileStore();

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [locationSelected, setLocationSelected] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null); // null means not checked


  const handleLocationChange = async (text) => {
    updateField('location', text);
    setLocationSelected(false); // Reset when typing
    if (text.length > 2) {
      try {
        const response = await geocodingClient.forwardGeocode({
          query: text,
          autocomplete: true,
          limit: 5,
        }).send();
        setSuggestions(response.body.features.map((feature) => feature.place_name));
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };


  const validateForm = () => {
    let newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 6) {
      newErrors.username = 'Username must be at least 6 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Display name validation
    if (!displayname.trim()) {
      newErrors.displayname = 'Display name is required';
    } else if (displayname.length < 2) {
      newErrors.displayname = 'Display name must be at least 2 characters';
    }

    // Location validation
    if (!locationSelected) {
      newErrors.location = 'Please select a valid location from the suggestions.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = () => {
    if (validateForm()) {
      router.push('addMultipleProfileImagesForm');
    } else {
      Alert.alert(
        "Invalid Information",
        "Please check the form for errors and try again."
      );
    }
  };

  useEffect(() => {
    const isValid =
      Object.values(errors).every((err) => !err) &&
      username &&
      displayname &&
      location &&
      locationSelected;
    setIsFormValid(isValid);
  }, [errors, username, displayname, location, locationSelected]);

  const handleUsernameChange = async (text) => {
    updateField('username', text);
    setErrors((prevErrors) => ({ ...prevErrors, username: null }));
    setIsUsernameAvailable(null);
    setIsCheckingAvailability(true);
    setSuggestedUsernames([]); // Clear suggestions when typing

    if (!text.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username is required' }));
      setIsCheckingAvailability(false);
      return;
    } else if (text.length < 6) {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username must be at least 6 characters' }));
      setIsCheckingAvailability(false);
      return;
    } else if (!/^[a-zA-Z0-9_]+$/.test(text)) {
      setErrors((prevErrors) => ({ ...prevErrors, username: 'Username can only contain letters, numbers, and underscores' }));
      setIsCheckingAvailability(false);
      return;
    }

    // Check username availability and generate suggestions
    try {
      const isAvailable = await UserService.checkUsernameAvailability(text, false);
      setIsUsernameAvailable(isAvailable);
      setTimeout(() => {
        setIsCheckingAvailability(false);
      }, 800);

      if (!isAvailable) {
        // Generate suggestions if username is taken
        const suggestions = await generateUsernameSuggestions(text);
        setSuggestedUsernames(suggestions);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Error checking username availability. Please try again.',
      }));
      setIsCheckingAvailability(false);
    }
  };

  // Function to generate unique username suggestions
  const generateUsernameSuggestions = async (baseUsername) => {
    const suggestions = [];
    for (let i = 0; i < 5; i++) {
      const suggestedUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
      const isAvailable = await UserService.checkUsernameAvailability(suggestedUsername);
      if (isAvailable) {
        suggestions.push(suggestedUsername);
      }
    }
    return suggestions;
  };

  const handleDisplaynameChange = (text) => {
    updateField('displayname', text);
    setErrors((prevErrors) => ({ ...prevErrors, displayname: null }));

    // Live validation
    if (!text.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, displayname: 'Display name is required' }));
    } else if (text.length < 2) {
      setErrors((prevErrors) => ({ ...prevErrors, displayname: 'Display name must be at least 2 characters' }));
    }
  };

  const handleDescriptionChange = (text) => {
    updateField('description', text);
  };

  const handleLocationSelect = (selectedLocation) => {
    updateField('location', selectedLocation);
    setSuggestions([]);
    setLocationSelected(true);
    setErrors((prevErrors) => ({ ...prevErrors, location: null })); // Clear location error
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <ProgressBar currentStep={1} totalSteps={4} />
          <Text style={styles.header}>Set Up Profile</Text>

          <View style={styles.iconContainer}>
            <Image source={require('../assets/images/ArtistSignUpFlow/Glow.png')} style={styles.glowImage} />
            <Image source={require('../assets/images/ArtistSignUpFlow/user.png')} style={styles.userImage} />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <InputComponent
                placeholder="Username"
                placeholderTextColor={Colors.secondary}
                value={username}
                onChangeText={handleUsernameChange}
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={30}
                style={styles.input}
                error={!!errors.username || (isUsernameAvailable === false)}
              />

              {/* Loader or Check Icon */}
              {isCheckingAvailability ? (
                <ActivityIndicator size="small" color={Colors.secondary} style={styles.icon} />
              ) : isUsernameAvailable === true ? (
                <Ionicons name="checkmark-circle-outline" size={26} color="green" style={styles.icon} />
              ) : null}
            </View>

            {isUsernameAvailable === false && (
              <Text style={styles.errorText}>The username {username} is not available.</Text>
            )}

            {suggestedUsernames.length > 0 && (
              <View style={styles.usernameSuggestionsContainer}>
                {suggestedUsernames.map((suggestion, index) => (
                  <View key={index}>
                    <TouchableOpacity key={index} onPress={() => handleUsernameChange(suggestion)} style={styles.usernameSuggestionItem}>
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                      <Ionicons name="checkmark-circle-outline" size={26} color="green" />
                    </TouchableOpacity>
                    {index < suggestedUsernames.length - 1 && <View style={styles.usernameDivider} />}
                  </View>
                ))}
              </View>
            )}

            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>



          <View style={styles.inputContainer}>
            <InputComponent
              placeholder="Display Name"
              placeholderTextColor={Colors.secondary}
              value={displayname}
              onChangeText={handleDisplaynameChange}
              keyboardType="default"
              autoCapitalize="none"
              maxLength={50}
              style={styles.input}
              error={!!errors.displayname}
            />
            {errors.displayname && <Text style={styles.errorText}>{errors.displayname}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.textAreaContainer}>
              <TextInput
                placeholder="Tell us more about you..."
                placeholderTextColor={Colors.secondary}
                style={[
                  styles.textArea,
                  descriptionFocused && styles.textAreaFocused,
                ]}
                value={description}
                onChangeText={handleDescriptionChange}
                maxLength={120}
                multiline
                numberOfLines={4}
                onFocus={() => setDescriptionFocused(true)}
                onBlur={() => setDescriptionFocused(false)}
              />
              <Text style={styles.characterCount}>{description.length} / 120</Text>
            </View>
            <View style={styles.descriptionInfo}>
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
            </View>
          </View>

          {/* Location Input and Suggestion List */}
          <View style={styles.inputContainer}>
            <InputComponent
              placeholder="Location"
              placeholderTextColor={Colors.secondary}
              value={location}
              onChangeText={handleLocationChange}
              keyboardType="default"
              autoCapitalize="none"
              maxLength={100}
              style={styles.input}
              error={!!errors.location} // Show error border if location is invalid
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
            {suggestions.length > 0 && (
              <FlatList
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  const searchText = location.toLowerCase();
                  const itemText = item.toLowerCase();
                  const startIdx = itemText.indexOf(searchText);

                  const highlightedText = startIdx >= 0 ? (
                    <Text style={styles.suggestionText}>
                      <Text>{item.slice(0, startIdx)}</Text>
                      <Text style={styles.highlightedText}>{item.slice(startIdx, startIdx + searchText.length)}</Text>
                      <Text>{item.slice(startIdx + searchText.length)}</Text>
                    </Text>
                  ) : (
                    <Text style={styles.suggestionText}>{item}</Text>
                  );

                  return (
                    <View>
                      <TouchableOpacity onPress={() => handleLocationSelect(item)} style={styles.suggestionItem}>
                        <FontAwesome6 name="location-dot" size={26} color={Colors.secondary} style={styles.suggestionIcon} />
                        {highlightedText}
                      </TouchableOpacity>
                      {index < suggestions.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </View>
                  );
                }}
                scrollEnabled={false}
                style={styles.suggestionsContainer}
              />
            )}
          </View>


          {/* Bottom Container with Next Button */}
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.nextButton,
                !isFormValid && styles.nextButtonDisabled
              ]}
              onPress={handleNext}
              disabled={!isFormValid}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  glowImage: {
    width: 100,
    height: 100,
  },
  userImage: {
    position: 'absolute',
    width: 45,
    height: 45,
  },
  header: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
    marginHorizontal: 'auto'
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.white,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
    marginHorizontal: 4,
  },
  usernameSuggestionsContainer: {
    backgroundColor: '#1B1B1B',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  icon: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  textArea: {
    borderRadius: 8,
    padding: 12,
    paddingRight: 50,
    fontSize: 16,
    color: Colors.white,
    width: 343,
    height: 88,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  textAreaFocused: {
    borderColor: Colors.white,
    borderWidth: 2,
  },
  characterCount: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    color: Colors.secondary,
    fontSize: 12,
  },
  descriptionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeholderText: {
    position: 'absolute',
    left: 12,
    color: Colors.secondary,
  },
  suggestionsContainer: {
    backgroundColor: '#1B1B1B',
    width: 343,
    borderRadius: 8,
    marginTop: 12,
  },
  usernameSuggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginVertical: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1B1B1B',
    marginVertical: 10,
  },
  suggestionIcon: {
    marginLeft: 10,
  },
  suggestionText: {
    color: Colors.white,
    marginHorizontal: 18,
    fontSize: 14
  },
  highlightedText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  usernameDivider: {
    height: 1,
    backgroundColor: '#30302d',
  },
  divider: {
    height: 1,
    backgroundColor: '#30302d',
    marginHorizontal: 16,
  },
  bottomContainer: {
    padding: 10,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  nextButtonDisabled: {
    backgroundColor: '#333',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ProfileSetupScreen;
