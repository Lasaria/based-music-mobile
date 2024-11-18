import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNBlobUtil from 'react-native-blob-util';
import { EventService } from '../../services/EventService';
import { tokenManager } from '../../utils/tokenManager';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Font from 'expo-font';
import arrowleftevent from '../../assets/icon/24x24/arrowleftevent.png';
import uploadImage from '../../assets/icon/24x24/uploadImage.png';
import calendar from '../../assets/icon/24x24/calendar.png';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const serverURL = 'http://localhost:3000';

const VenueEventsScreen = () => {
  // State for event details
  const params = useLocalSearchParams();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: new Date(),
    start_time: new Date(),
    end_time: new Date(),
    timezone: '',
    age_limit: '',
  });

  // State for image and UI
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loadingFonts, setLoadingFonts] = useState(true);

  const loadFonts = async () => {
    await Font.loadAsync({
      'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'), // Adjust the path accordingly
      'OpenSans-Bold': require('../../assets/fonts/OpenSans-Bold.ttf'), // Adjust the path accordingly
    });
    setLoadingFonts(false); // Set loading to false after fonts are loaded
  };

  useEffect(() => {
    loadFonts();
    
    // Check if event data was passed from the EventsHomeScreen
    if (params.eventData) {
      try {
        const parsedEventData = JSON.parse(params.eventData);
        setEventData({
          title: parsedEventData.title || '',
          description: parsedEventData.description || '',
          date: new Date(parsedEventData.date),
          start_time: new Date(parsedEventData.start_time),
          end_time: new Date(parsedEventData.end_time),
          timezone: parsedEventData.timezone || '',
          age_limit: parsedEventData.age_limit || '',
          eventId: parsedEventData.EventID,
        });
        if (parsedEventData.event_image_url) {
          setImageUri(parsedEventData.event_image_url);
        }
      } catch (error) {
        console.error('Error parsing event data:', error);
      }
    }
  }, [params.eventData]);

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setEventData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to pick image
  const pickImage = async () => {
    try {
      // Request permission first (required for iOS)
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        console.log('Permission to access media library was denied');
        setErrorMessage('Permission to access photos was denied');
        return;
      }
  
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: false,
      });
  
      if (!result.canceled) {
        // In Expo's Image Picker, selected asset is in result.assets[0]
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setImageUri(imageUri);
      } else {
        console.log('User cancelled image picker');
      }
    } catch (error) {
      console.error('Image picker error: ', error);
      setErrorMessage('Image picker error. Please try again.');
    }
  };

  const createEvent = async () => {
    if (!imageUri || !eventData.title) {
      setErrorMessage('Please fill in all required fields and select an image');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
   //   const userId = await tokenManager.getUserId();

      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date.toISOString(),
        start_time: eventData.start_time.toISOString(),
        end_time: eventData.end_time.toISOString(),
        timezone: eventData.timezone,
        age_limit: eventData.age_limit,
        event_image_url: null, // Store the S3 URL in DynamoDB
      };
      let response;
      let eventIdToUse;
      if (eventData.eventId) {
        // Update existing event
        console.log(eventData.eventId);
        response = await EventService.updateEvent(eventData.eventId, eventPayload);
        console.log("Event updated with ID:", eventData.eventId);
        eventIdToUse = eventData.eventId;

        if (imageUri !== null && !imageUri.includes('amazonaws')) {
        
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
            `${serverURL}/events/${eventData.eventId}/update-event-image`,
            {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
            },
            formData
          );
  
          console.log('Image updated successfully');
        }
      } else {
        // Create a new event
        response = await EventService.createEvent(eventPayload);
        console.log("Event created successfully with ID:", response.event.EventID);
        eventIdToUse = response.event.EventID;
      
      // Create the event in DynamoDB
     /* const response = await EventService.createEvent(eventPayload);
      console.log("Uploaded to dynamo with null image");
      // Extract the EventID
      const eventId = response.event.EventID;
      console.log('Created Event ID:', eventId);
      // First, upload the image to S3 through your backend*/
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
            `${serverURL}/events/${eventIdToUse}/event-image`,
            {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
            },
            formData
          );
  
          console.log('Image uploaded successfully');
      }
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

  const cancelImage = () => {
    setImageUri(null);
  };

  const clearForm = () => {
    setImageUri(null);
    setEventData({
      title: '',
      description: '',
      date: new Date(),
      start_time: new Date(),
      end_time: new Date(),
      timezone: '',
      age_limit: ''
    });
  };
  
  if (loadingFonts) {
    return null; // or a loading spinner
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header container */}
<View style={styles.headerContainer}>
  {/* Back Arrow Button */}
  <TouchableOpacity onPress={() => router.back()}>
    <Image source={arrowleftevent} style={styles.backButton} />
  </TouchableOpacity>

  <Text style={[styles.title, { fontFamily: 'OpenSans-Bold' }]}>Create event</Text>
</View>

<Text style={[styles.venueTitle, { fontFamily: 'OpenSans-Bold' }]}>Select Venue</Text>
      <View style={styles.venueInputContainer}>
      <Text style={styles.label}>
        Pick venue
      </Text> 
        <TextInput
          style={[styles.input, { paddingLeft: 20 }]}
          placeholder="Pick venue..."
          placeholderTextColor="#444A5D"
        />
      </View>
      <View style={styles.imageContainer}>
      <Text style={[styles.eventTitle, { fontFamily: 'OpenSans-Bold' }]}>Add event image</Text>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={[styles.uploadText, { marginTop: 40 }]}>Tap to upload from</Text>
            <Text style={styles.uploadText}>camera roll or files</Text>
          </View>
        )}
        
         {/* Only show the upload button when no image is selected */}
      {!imageUri && (
        <TouchableOpacity onPress={pickImage} style={styles.cameraButton}>
          <Image source={uploadImage} style={styles.cameraIcon} />
        </TouchableOpacity>
      )}

      {/* Cancel button to remove the image */}
      {imageUri && (
        <TouchableOpacity onPress={cancelImage} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Remove Image</Text>
        </TouchableOpacity>
      )}
        <Text style={styles.eventSubtext}>Recommended image size: 2160 x 1080px</Text>
        <Text style={styles.eventSubtext}>Maximum file size: 10MB</Text>
        <Text style={styles.eventSubtext}>Support image files: .jPEG, .PNg</Text>
      </View>
      <View style={styles.horizontalLine} />
      <View style={styles.eventDetailsContainer}>
      <Text style={[styles.eventTitle, { fontFamily: 'OpenSans-Bold' }]}>Event Details</Text>
      <Text style={styles.eventSubtext}>Help discover your venue on Based using the name of your venue in the real world.</Text>
      <View style={styles.inputContainer}>
      <Text style={styles.label}>
        Event title
       <Text style={{ color: 'red' }}>   *</Text>
      </Text> 
        <TextInput
          style={[styles.input, { paddingLeft: 20 }]}
          placeholder="Name your event..."
          placeholderTextColor="#444A5D"
          value={eventData.title}
          onChangeText={(value) => handleInputChange('title', value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Event description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput, { paddingLeft: 20, paddingTop: 15 }]}
          placeholder="Brief description about your event..."
          placeholderTextColor="#444A5D"
          value={eventData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          multiline={true}
          numberOfLines={5}
        />
      </View>
      </View>

      <View style={styles.ageInputContainer}>
      <Text style={styles.label}>
        Age limit
      </Text> 
        <TextInput
          style={[styles.input, { paddingLeft: 20 }]}
          placeholder="Name your event..."
          placeholderTextColor="#444A5D"
          value={eventData.age_limit}
          onChangeText={(value) => handleInputChange('age_limit', value)}
        />
      </View>

      <View style={styles.datetime}>
      <Text style={[styles.eventTitle, { fontFamily: 'OpenSans-Bold', marginTop: 20 }]}>Date and Time</Text>
      <Text style={[styles.eventSubtext, { marginBottom: 10}]}>Help discover your venue on Based using the name of your venue in the real world.</Text>
      
      <TouchableOpacity 
  onPress={() => setShowDatePicker(true)}
  style={styles.datePickerContainer}
>
<Text style={styles.dateLabel}>
        Date
      </Text>
  <View style={styles.dateContent}>
    <Image source={calendar} style={styles.calendarIcon} />
    <Text style={styles.dateText}>{eventData.date.toLocaleDateString()}</Text>
  </View>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={eventData.date}
    mode="date"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) handleInputChange('date', selectedDate);
    }}
  />
)}

<View style={styles.timeContainer}>
  <TouchableOpacity
    style={[styles.timeButton, { width: '45%' }]}
    onPress={() => setShowStartTimePicker(true)}
  >
    <Text style={styles.dateLabel}>Start Time</Text>
    <View style={styles.timeContent}>
      <Text style={styles.timeText}>{eventData.start_time.toLocaleTimeString()}</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.timeButton, { width: '45%' }]}
    onPress={() => setShowEndTimePicker(true)}
  >
    <Text style={styles.dateLabel}>End Time</Text>
    <View style={styles.timeContent}>
      <Text style={styles.timeText}>{eventData.end_time.toLocaleTimeString()}</Text>
    </View>
  </TouchableOpacity>
</View>

{showStartTimePicker && (
  <DateTimePicker
    value={eventData.start_time}
    mode="time"
    onChange={(event, selectedTime) => {
      setShowStartTimePicker(false);
      if (selectedTime) handleInputChange('start_time', selectedTime);
    }}
  />
)}

{showEndTimePicker && (
  <DateTimePicker
    value={eventData.end_time}
    mode="time"
    onChange={(event, selectedTime) => {
      setShowEndTimePicker(false);
      if (selectedTime) handleInputChange('end_time', selectedTime);
    }}
  />
)}
<View style={styles.inputContainer}>
      </View>
      <Text style={[styles.label, {top : 255}]}>
        Timezone
      </Text>
      <TextInput
        style={[styles.input, { paddingLeft: 20 }]}
        placeholder="Name your event..."
        placeholderTextColor="#444A5D"
        value={eventData.timezone}
        onChangeText={(value) => handleInputChange('timezone', value)}
      />
      </View>
      <View style={[styles.horizontalLine, {marginTop: 40}]} />
      <View style={styles.ticketContainer}>
      <Text style={[styles.eventTitle, { fontFamily: 'OpenSans-Bold' }]}>Tickets</Text>
      <Text style={styles.eventSubtext}>Create tickets for your event. You can add multiple ticket categories.</Text>
      <Text style={[styles.eventSubtext, {marginTop: 30, color: '#FFFFFF', fontWeight: '400'}]}>You have not created any ticket yet. Click on "Add ticket" below.</Text>
      </View>
      <TouchableOpacity
        style={[styles.addTicketButton]}
      >
        
          <Text style={styles.saveButtonText}>Add Ticket</Text>
        
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={createEvent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Publish Event</Text>
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
    paddingHorizontal: 12,
    backgroundColor: '#000',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    // Remove paddingBottom since spacing is handled by headerContainer
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    width: 10,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    paddingBottom: 20,
  },
  venueTitle: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'left',
    paddingTop: 40,
  },
  label: {
    fontSize: 12,
    color: '#828796',
    backgroundColor: '#000',  // Black background
    left: 10,
    paddingHorizontal: 10,  // Horizontal padding for the label text
    top: 10,
    position: 'absolute',
    zIndex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#828796',
    backgroundColor: '#000',  // Black background
    left: 10,
    paddingHorizontal: 10,  // Horizontal padding for the label text
    top: -10,
    position: 'absolute',
    zIndex: 1,
  },
  imageContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  uploadText: {
    color: '#7F7F7F',
    fontSize: 12,
    marginTop: 5,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff',
    backgroundColor: '0D020D',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cameraButton: {
    position: 'absolute',
    top: 100,
    right: 190,
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  cameraIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  eventSubtext: {
    color: '#7F7F7F',
    fontSize: 10,
  },
  horizontalLine: {
    borderBottomColor: '#828282',  // Color of the line
    borderBottomWidth: 1,        // Thickness of the line
    width: '100%',               // Full width of the screen
    marginVertical: 10,          // Optional: Adds some spacing above and below the line
    paddingHorizontal: 0,
  },
  eventDetailsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  detailsTitle: {
    paddingTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#828796',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#000',
    marginTop: 20,
    color: '#FFFFFF'
  },
  multilineInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  inputContainer: {
    marginTop: 10,
    marginBottom: -20,
    width: '100%',
    color: '#000',
  },
  venueInputContainer: {
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
    color: '#000',
  },
  ageInputContainer: {
    marginTop: -5,
    marginBottom: 5,
    width: '100%',
    color: '#000',
  },
  datePickerContainer: {
    borderWidth: 1,
    borderColor: '#828796',
    borderRadius: 15,
    padding: 12,
    marginTop: 20,
    marginBottom: 5,
    backgroundColor: '#000',
    alignItems: 'center'
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    width: 17,
    height: 17,
    marginRight: 10,
    resizeMode: 'contain'
  },
  dateText: {
    color: '#EFF3F5',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  timeButton: {
    borderWidth: 1,
    borderColor: '#828796',
    borderRadius: 15,
    padding: 12,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#000',
    width: '50%',
  },
  timeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  ticketContainer: {
    marginTop: 20,
  },
  addTicketButton: {
    backgroundColor: '#6F2CFF',
    padding: 17,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 17,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#6F2CFF',
    alignItems: 'center',
    marginBottom: 400,
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
    marginTop: -350,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default VenueEventsScreen;