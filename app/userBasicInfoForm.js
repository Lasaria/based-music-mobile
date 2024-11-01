import React, { useState } from 'react';
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
} from 'react-native';
import useProfileStore from '../zusStore/userFormStore';

const ProfileSetupScreen = () => {
  const { 
    username,
    displayname,
    description,
    location,
    selectedGenres,
    updateField
  } = useProfileStore();
  
  // Keep errors in local state as they're UI-specific
  const [errors, setErrors] = useState({});

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
    if (description.length > 150) {
      newErrors.description = 'Description must be less than 150 characters';
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>Create Your Profile</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username*</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Enter username"
              value={username}
              onChangeText={(text) => {
                updateField('username', text);
                if (errors.username) {
                  setErrors({ ...errors, username: null });
                }
              }}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
            <Text style={styles.helperText}>
              This will be your unique identifier
            </Text>
          </View>

          {/* Display Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display Name*</Text>
            <TextInput
              style={[styles.input, errors.displayname && styles.inputError]}
              placeholder="Enter display name"
              value={displayname}
              onChangeText={(text) => {
                updateField('displayname', text);
                if (errors.displayname) {
                  setErrors({ ...errors, displayname: null });
                }
              }}
              maxLength={50}
            />
            {errors.displayname && (
              <Text style={styles.errorText}>{errors.displayname}</Text>
            )}
            <Text style={styles.helperText}>
              This is how others will see you
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                errors.description && styles.inputError
              ]}
              placeholder="Tell us about yourself"
              value={description}
              onChangeText={(text) => {
                updateField('description', text);
                if (errors.description) {
                  setErrors({ ...errors, description: null });
                }
              }}
              multiline
              numberOfLines={4}
              maxLength={150}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
            <Text style={styles.helperText}>
              {description.length}/150 characters
            </Text>
          </View>

          {/* Location Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              value={location}
              onChangeText={(text) => updateField('location', text)}
              maxLength={100}
            />
            <Text style={styles.helperText}>
              Optional: City, Country
            </Text>
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Space for the bottom button
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    color: '#333',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
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

export default ProfileSetupScreen;