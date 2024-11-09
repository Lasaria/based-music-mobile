import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput, 
  Image,
  TouchableOpacity 
} from 'react-native';
import { router } from 'expo-router';
import { EventService } from '../../services/EventService';

const EventsHomeScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleEditEvent = async (eventId) => {
    try {
      // Fetch the event details
      const response = await EventService.getEvent(eventId);
      const eventData = response.event;
      
      // Method 1: Using query parameters
      router.push({
        pathname: '/eventOptions/createEvent',
        params: {
          eventData: JSON.stringify(eventData) // Need to stringify complex objects
        }
      });
  
      // OR Method 2: Using segments
      router.push('/eventOptions/createEvent?eventData=' + encodeURIComponent(JSON.stringify(eventData)));
    } catch (error) {
      console.error('Error fetching event details:', error);
      setErrorMessage('Failed to fetch event details. Please try again later.');
    }
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

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>Good Morning</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Stats</Text>
        <View style={styles.statsBoxContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxText}>Stat 1</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxText}>Stat 2</Text>
          </View>
        </View>
      </View>

      {/* Upcoming Events Label */}
      <Text style={styles.statsText}>Your upcoming events</Text>

      {/* Search Bar with Icon */}
      <View style={styles.searchContainer}>
        <Image 
          source={require('../../assets/icon/24x24/search.png')}
          style={styles.searchIcon}
        />
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search" 
          placeholderTextColor="#444A5D"
        />
      </View>
      <View style={styles.emptyContainer} />
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => router.push('eventOptions/createEvent')}
      >
        <Text style={styles.saveButtonText}>Create event</Text>
      </TouchableOpacity>
      
      {/* Upcoming Events Label */}
      <Text style={styles.statsText}>Your upcoming events</Text>
      <Text style={styles.eventSubtext}>This is a list of your upcoming events.</Text>
      <View style={styles.emptyContainer} />

      {/* Events List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        events.map((event) => (
          <View key={event.EventID}>
            {event.event_image_url && (
              <View style={styles.imageContainer}>
                <Image 
                  source={{ uri: event.event_image_url }} 
                  style={styles.eventImage}
                  resizeMode="cover"
                />
              </View>
            )}
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{formatDate(event.date)}, {formatTime(event.start_time)}</Text>
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditEvent(event.EventID)}
              >
              <Text style={styles.editButtonText}>Edit event</Text>
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
          </View>
        ))
      )}
      <View style={styles.scrollPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 60,
    backgroundColor: '#000',
  },
  greetingContainer: {
    paddingBottom: 30,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsContainer: {
    paddingBottom: 16,
  },
  statsText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#DEDEDE',
    marginBottom: 10,
  },
  statsBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 40,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    paddingTop: 45,
    paddingBottom: 45,
    borderRadius: 16,
    marginHorizontal: 5,
  },
  statBoxText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingHorizontal: 10,
    marginVertical: 10,
    color: '#444A5D',
    width: '40%',
    marginBottom: 20
  },
  searchIcon: {
    width: 14,
    height: 14,
    tintColor: '#444A5D',
    marginRight: 8,
    marginLeft: 5
  },
  searchBar: {
    fontSize: 14,
    color: '#444A5D',
    flex: 1,
  },
  emptyContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 75,
    borderColor: '#FFFFFF',
    backgroundColor: '#000',
    width: '85%',
    marginTop: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#f44336',
    fontSize: 16,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventDescription: {
    fontSize: 16,
    color: '#DEDEDE',
    marginBottom: 12,
  },
  eventInfo: {
    fontSize: 14,
    color: '#BEBEBE',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 17,
    color: '#BEBEBE',
  },
  eventTime: {
    fontSize: 17,
    color: '#BEBEBE',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginTop: 50,
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#333', // Matching the card border color
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    backgroundColor: '#6F2CFF',
    padding: 17,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 50,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventSubtext: {
    color: '#7F7F7F',
    fontSize: 10,
    marginTop: 15,
    marginBottom: 5
  },
  editButton: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: '#6F2CFF',
    paddingVertical: 13,
    borderRadius: 20,
  },
  horizontalLine: {
    borderBottomColor: '#828282',  // Color of the line
    borderBottomWidth: 1,        // Thickness of the line
    width: '100%',               // Full width of the screen
    marginVertical: 10,          // Optional: Adds some spacing above and below the line
    paddingHorizontal: 0,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center'
  },
  scrollPadding: {
    height: 400, // Adds 100 units of empty space at the bottom
    backgroundColor: 'transparent',
  },
});

export default EventsHomeScreen;