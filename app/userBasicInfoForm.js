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
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import useProfileStore from '../zusStore/userFormStore';
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding';
import ProgressBar from '../components/ProgressBar';
import InputComponent from '../components/InputComponent';
import { Colors } from '../constants/Color';
import { Ionicons } from '@expo/vector-icons';

const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoibGFzYXJpYSIsImEiOiJjbTJheXV0cjcwNG9zMmxwdnlxZWdoMjc5In0.NoBtaBj9cNvdemNp52pxGQ' });

const { width } = Dimensions.get("window");
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

  const handleLocationChange = async (text) => {
    updateField('location', text);
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

  const handleLocationSelect = (selectedLocation) => {
    updateField('location', selectedLocation);
    setSuggestions([]);
    setLocationSelected(true); // Ensuring locationSelected is set to true upon selection
  };


  const validateForm = () => {
    let newErrors = {};
    
    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Display name validation
    if (!displayname.trim()) {
      newErrors.displayname = 'Display name is required';
    } else if (displayname.length < 2) {
      newErrors.displayname = 'Display name must be at least 2 characters';
    }

    // Description validation (optional but with max length)
    if (description.length >= 120) {
      newErrors.description = 'Description must be less than 120 characters';
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
    // Only valid if there are no errors and all fields are non-empty with location selected
    const isValid =
      Object.values(errors).every((err) => !err) &&
      username &&
      displayname &&
      description &&
      location &&
      locationSelected; // Ensure location is selected
    setIsFormValid(isValid);
  }, [errors, username, displayname, description, location, locationSelected]); // Added `location` to dependency

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar currentStep={1} totalSteps={4} />
          <Text style={styles.header}>Set Up Profile</Text>

          <View style={styles.iconContainer}>
            <Image source={require('../assets/images/ArtistSignUpFlow/Glow.png')} style={styles.glowImage} />
            <Image source={require('../assets/images/ArtistSignUpFlow/user.png')} style={styles.userImage} />
          </View>

          <View style={styles.inputContainer}>
            <InputComponent
              placeholder="Username"
              placeholderTextColor={Colors.secondary}
              value={username}
              onChangeText={(text) => {
                updateField('username', text);
                console.log(text);
                if (errors.username) {
                  setErrors({ ...errors, username: null });
                }
              }}
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
              style={styles.input}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <InputComponent
              placeholder="Display Name"
              placeholderTextColor={Colors.secondary}
              value={displayname}
              onChangeText={(text) => {
                updateField('displayname', text);
                if (errors.displayname) {
                  setErrors({ ...errors, displayname: null });
                }
              }}
              keyboardType="default"
              autoCapitalize="none"
              maxLength={50}
              style={styles.input}
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
                onChangeText={(text) => {
                  updateField('description', text);
                  if (errors.description) {
                    setErrors({ ...errors, description: null });
                  }
                }}
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
                        <Ionicons name="location-sharp" size={24} color={Colors.secondary} style={styles.suggestionIcon} />
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
    marginVertical: 52,
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
  textArea: {
    backgroundColor: '#1a1a1a',
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
    backgroundColor: '#2a2a2a',
    width: 343,
    borderRadius: 8,
    marginTop: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#2a2a2a',
    marginVertical: 10,
  },
  suggestionIcon: {
    marginLeft: 10,
  },
  suggestionText: {
    color: Colors.white,
    marginLeft: 18,
  },
  highlightedText: {
    color: 'gold',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
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
