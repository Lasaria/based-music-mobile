import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNBlobUtil from 'react-native-blob-util';
import { EventService } from '../../services/EventService';
import { tokenManager } from '../../utils/tokenManager';
import { FontAwesome6 } from 'react-native-vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const serverURL = 'http://10.3.65.223:3000';

const VenueEventsScreen = () => {
  // State for event details
  const [eventData, setEventData] = useState({
    title: '',
    StartDate: new Date(),
    time: new Date(),
    location: '',
    description: '',
    type: '',
    category: '',
  });

  // State for image and UI
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to pick image
  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('Image picker error: ', response.errorMessage);
        setErrorMessage('Image picker error. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const imageUri = response.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        if (imageUri) {
          setImageUri(imageUri);
        }
      }
    });
  };

  const createEvent = async () => {
    if (!imageUri || !eventData.title || !eventData.StartDate) {
      setErrorMessage('Please fill in all required fields and select an image');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
   //   const userId = await tokenManager.getUserId();

      const eventPayload = {
        title: eventData.title,
        StartDate: eventData.StartDate.toISOString(),
        time: eventData.time.toISOString(),
        location: eventData.location,
        description: eventData.description,
        type: eventData.type,
        category: eventData.category,
        eventImageUrl: null, // Store the S3 URL in DynamoDB
      };

      // Create the event in DynamoDB
      const response = await EventService.createEvent(eventPayload);
      console.log("Uploaded to dynamo with null image");
      // Extract the EventID
      const eventId = response.event.EventID;
      console.log('Created Event ID:', eventId);
      // First, upload the image to S3 through your backend
      if (imageUri) {
        
          const formData = [
            {
              name: 'eventImage',
              filename: 'event.jpg',
              type: 'image/jpeg',
              data: RNBlobUtil.wrap(decodeURIComponent(imageUri.replace('file://', ''))),
            },
          ];
  
          // Upload image to S3
          const imageResponse = await RNBlobUtil.fetch(
            'PATCH',
            `${serverURL}/events/${eventId}/event-image`,
            {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
            },
            formData
          );
  
          if (!imageResponse.ok) {
            throw new Error('Failed to upload image');
          }
  
          console.log('Image uploaded successfully');
      }

      alert('Event created successfully!');
      clearForm();
    } catch (error) {
      console.error('Error creating event:', error);
      setErrorMessage('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setImageUri(null);
    setEventData({
      title: '',
      StartDate: new Date(),
      time: new Date(),
      location: '',
      description: '',
      type: '',
      category: '',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Event</Text>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>Select Event Image</Text>
          </View>
        )}
        <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
          <FontAwesome6 name="camera" size={24} color="black" style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        value={eventData.title}
        onChangeText={(value) => handleInputChange('title', value)}
      />

      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Date: {eventData.StartDate.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={eventData.StartDate}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) handleInputChange('startDate', selectedDate);
          }}
        />
      )}

      <TouchableOpacity 
        style={styles.dateButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>Time: {eventData.time.toLocaleTimeString()}</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={eventData.time}
          mode="time"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) handleInputChange('startTime', selectedTime);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={eventData.location}
        onChangeText={(value) => handleInputChange('location', value)}
      />

      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={eventData.description}
        onChangeText={(value) => handleInputChange('description', value)}
        multiline={true}
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Event Type"
        value={eventData.type}
        onChangeText={(value) => handleInputChange('type', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={eventData.category}
        onChangeText={(value) => handleInputChange('category', value)}
      />

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={createEvent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Create Event</Text>
        )}
      </TouchableOpacity>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#6e00ff',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default VenueEventsScreen;