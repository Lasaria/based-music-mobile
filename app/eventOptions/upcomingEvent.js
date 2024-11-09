import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  StyleSheet, 
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { EventService } from '../../services/EventService';
import RNBlobUtil from 'react-native-blob-util';
import { tokenManager } from '../../utils/tokenManager';

const serverURL = 'http://10.3.65.248:3000';

const ViewEventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageLoading, setImageLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await EventService.getAllEvents();
      const eventsWithSignedUrls = response.events.map(event => ({
        ...event,
        event_image_url: event.event_image_url
      }));
      setEvents(eventsWithSignedUrls || []);
    } catch (error) {
      setErrorMessage('Failed to load events. Please try again later.');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              
              // First delete the image from S3
              try {
                await RNBlobUtil.fetch(
                  'DELETE',
                  `${serverURL}/events/${eventId}/event-image`,
                  {
                    Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
                  }
                );
                console.log('Successfully deleted image from S3');
              } catch (imageError) {
                console.error('Error deleting image from S3:', imageError);
                // Continue with event deletion even if image deletion fails
              }

              // Then delete the event from DynamoDB
              await EventService.deleteEvent(eventId);
              
              // Remove the deleted event from the state
              setEvents(prevEvents => 
                prevEvents.filter(event => event.EventID !== eventId)
              );
              
              Alert.alert("Success", "Event and associated image deleted successfully");
            } catch (error) {
              console.error('Error deleting event:', error);
              Alert.alert(
                "Error",
                "Failed to delete event. Please try again later."
              );
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {events.map((event) => (
        <View key={event.EventID} style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
          <Text style={styles.eventInfo}>Age Limit: {event.age_limit}+</Text>
          <Text style={styles.eventInfo}>Timezone: {event.timezone}</Text>
          <Text style={styles.eventDate}>Date: {formatDate(event.date)}</Text>
          <Text style={styles.eventTime}>
            Time: {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </Text>
          {event.event_image_url && (
            <View style={styles.imageContainer}>
              {imageLoading && (
                <ActivityIndicator 
                  style={styles.imageLoader}
                  size="small" 
                  color="#0000ff" 
                />
              )}
              <Image 
                source={{ uri: event.event_image_url }} 
                style={styles.eventImage}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={(error) => {
                  console.error('Error loading image:', error);
                  setImageLoading(false);
                }}
                defaultSource={require('../../assets/icon/24x24/uploadImage.png')}
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => console.log(`Edit event ${event.EventID}`)}
            >
              <Text style={styles.buttonText}>Edit Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteButton,
                deleting && styles.disabledButton
              ]}
              onPress={() => handleDeleteEvent(event.EventID)}
              disabled={deleting}
            >
              <Text style={styles.buttonText}>
                {deleting ? 'Deleting...' : 'Delete Event'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  eventDescription: {
    fontSize: 16,
    marginBottom: 12,
    color: '#666',
  },
  eventInfo: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
    color: '#444',
    fontWeight: '500',
  },
  eventTime: {
    fontSize: 14,
    marginBottom: 16,
    color: '#444',
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ViewEventsScreen;