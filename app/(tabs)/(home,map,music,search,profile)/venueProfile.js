import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
//import { VenueService } from '../../../services/VenueService';

const Dashboard = () => {
  // State to track active tabs
  const [activeTopNavTab, setActiveTopNavTab] = useState('FEED');
  const [activeNavTab, setActiveNavTab] = useState('Dashboard');
  const [activeDateTab, setActiveDateTab] = useState('1d');
  const [activeEventFilter, setActiveEventFilter] = useState('Upcoming');
  const today = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(today); // Initialize with today's date
  const [activeEventsTab, setActiveEventsTab] = useState('Upcoming events');
  const days = generateDays();

  const stats = [
    { label: 'Post mentions', value: 18 },
    { label: 'New followers', value: 54 },
    { label: 'Likes', value: 76 },
    { label: 'Comments', value: 32 },
  ];

  // Sample events data
  const events = [
    {
      title: "Summer Music Festival",
      date: "June 15, 2024",
      time: "6:00 PM",
      status: "Published",
      attendees: 234,
      ticketsSold: 189,
      revenue: "$5,670"
    },
    {
      title: "Comedy Night Special",
      date: "June 20, 2024",
      time: "8:00 PM",
      status: "Draft",
      attendees: 0,
      ticketsSold: 0,
      revenue: "$0"
    },
    {
      title: "Jazz Evening",
      date: "June 25, 2024",
      time: "7:30 PM",
      status: "Published",
      attendees: 156,
      ticketsSold: 142,
      revenue: "$4,260"
    }
  ];


  function generateDays() {
    const startDate = new Date(); // Use the current date as the starting point
    const days = [];
  
    // Generate 7 days before and 14 days after the current date (total of 21 days)
    for (let i = -7; i < 14; i++) { // Start from -7 (7 days before) to 13 (14 days after)
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
  
      // Get the month and day separately
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase(); // Get month in short form
      const day = date.toLocaleDateString('en-US', { day: 'numeric' }); // Get day as a number
  
      days.push({
        date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }), // Short weekday name
        month, // Month part (e.g., 'Oct')
        day, // Day part (e.g., '1')
      });
    }
  
    return days;
  }

  const renderEventsContent = () => (
    <ScrollView>
    <View style={styles.eventContainer}>
      <View style={styles.eventHistoryContainer}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>Event history</Text>
        <Text style={styles.showAll}>Show all</Text>
      </View>
      <FlatList
        data={days} // Assuming days is available, either from state or props
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateContainer,
              item.date === selectedDate,
            ]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text style={[styles.dayName, item.date === selectedDate && styles.selectedDateText]}>
              {item.dayName}
            </Text>
            <View style={styles.dateDetails}>
              {/* Container for Month and Day with border, color changes only for selected date */}
              <View
                style={[
                  styles.dateWithBorder,
                  item.date === selectedDate && styles.selectedDateBorder, // Apply selected style to the border container
                ]}
              >
                <Text
                  style={[styles.month, item.date === selectedDate && styles.selectedDateText]}
                >
                  {item.month} {/* Month part */}
                </Text>
                <Text
                  style={[styles.day, item.date === selectedDate && styles.selectedDateText]}
                >
                  {item.day} {/* Day part */}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      </View>
      <View style={styles.createContainer} />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/createEvent')}
      >
        <Text style={styles.createButtonText}>Create Event</Text>
      </TouchableOpacity>
      <View style={styles.eventsNavBar}>
  {['Upcoming events', 'Past events'].map((tab, index) => (
    <TouchableOpacity
      key={index}
      onPress={() => setActiveEventsTab(tab)}
      style={[
        styles.eventsTab,
        activeEventsTab === tab
          ? styles.eventsActiveTab
          : styles.eventsInactiveTab,
      ]}>
      <Text
        style={[
          styles.eventsTabText,
          activeEventsTab === tab
            ? styles.eventsActiveTabText
            : styles.eventsInactiveTabText,
        ]}>
        {tab}
      </Text>
    </TouchableOpacity>
  ))}
  
</View>
<View style={styles.searchBar}>
      <Ionicons name="search" size={20} color="#181727" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="search"
        placeholderTextColor="#828796"
      />
    </View>
    </View>
    </ScrollView>
  );
  

  // Function to render Dashboard content
  const renderDashboardContent = () => (
    <>
      {/* Welcome Back Section */}
      <View style={styles.venueName}>
        <View style={styles.textSection}>
          <Text style={styles.greeting}>Hi Venue name</Text>
          <Text style={styles.welcome}>Welcome back</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarPlaceholder} />
          <TouchableOpacity onPress={() => router.push('(profile)')}>
            <Text style={styles.profileLink}>View profile</Text>
          </TouchableOpacity>

          <View style={styles.badge}>
            <Text style={styles.stars}>★★★</Text>
            <Text style={styles.badgeText}>Gold</Text>
          </View>
        </View>
      </View>

      {/* Suggested Actions */}
      <Text style={styles.suggestionsTitle}>Suggested</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.suggestions}>
        <View style={styles.suggestionsWrapper}>
          {[
            {
              title: 'Create event',
              subtitle: 'Kickstart something big',
              image: require('../../../assets/images/Venues/createEvent.png'),
              action: () => router.push('/createEvent'),
            },
            {
              title: 'Promote event',
              subtitle: 'Reach a wider audience',
              image: require('../../../assets/images/Venues/promoteEvent.png'),
              action: () => router.push('/promoteEvent'),
            },
            {
              title: 'Manage event',
              subtitle: 'Stay on track',
              image: require('../../../assets/images/Venues/manageEvent.png'),
              action: () => router.push('/manageEvent'),
            },
          ].map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionCard}
              onPress={action.action}>
              <Image source={action.image} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{action.title}</Text>
              <Text style={styles.cardSubtitle}>{action.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.suggestionsTitle}>Stats</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsFilters}>
          {['1d', '7d', '30d', '60d'].map((filter, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveDateTab(filter)}
              style={[
                styles.timeFilter,
                activeDateTab === filter && styles.activeDateTab,
              ]}>
              <Text
                style={[
                  styles.timeFilterText,
                  activeDateTab === filter && styles.activeDateTabText,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.statsRow}>
          {[
            { label: 'RSVP total', value: '50' },
            { label: 'Impressions', value: '3000' },
            { label: 'Revenue', value: '$12,330' },
          ].map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statistics}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statisticsRow}>
              <Text style={styles.statisticsLabel}>{stat.label}</Text>
              <Text style={styles.statisticsValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Rank Section */}
      <View style={styles.rankSection}>
        <Image
          source={require('../../../assets/images/Venues/ranking.png')}
          style={styles.rankImage}
        />
        <Text style={styles.rankHeading}>Learn to rank higher as a venue</Text>
      </View>
    </>
  );

  const renderPromotionsContent = () => (
    <View style={styles.promotionsCreateContainer} >
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/createPromotions')}
      >
        <Text style={styles.createButtonText}>Create Promotion</Text>
      </TouchableOpacity>
      </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Top Navigation Tabs */}
      <View style={styles.topNavBar}>
        {['TRENDING', 'FEED', 'RANKINGS'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTopNavTab(tab)}
            style={[activeTopNavTab === tab && styles.topActiveTab]}>
            <Text
              style={[
                styles.topNavTabText,
                activeTopNavTab === tab && styles.topActiveTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main Navigation Bar */}
      <View style={styles.navBar}>
        {['Dashboard', 'Events', 'Mentions', 'Promotions'].map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveNavTab(tab)}
            style={[
              styles.navTab,
              activeNavTab === tab && styles.activeTab,
            ]}>
            <Text
              style={[
                styles.navTabText,
                activeNavTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditional Content Rendering */}
      {activeNavTab === 'Dashboard' && renderDashboardContent()}
      {activeNavTab === 'Events' && renderEventsContent()}

      {activeNavTab === 'Promotions' && renderPromotionsContent()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    padding: 10,
  },
  // Top Nav Bar
  topNavBar: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  topNavTabText: { color: '#fff', fontSize: 14, paddingHorizontal: 24 },
  topActiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
    marginBottom: -2,
  },
  topActiveTabText: {
    color: '#fff',
    fontWeight: 'bold',
    paddingBottom: 10,
  },

  // Nav Bar
  navBar: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  navTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#fff'
  },
  activeTab: { backgroundColor: '#5321BF', borderColor: '#5321BF' },
  navTabText: { color: '#fff', fontSize: 14 },
  activeTabText: { color: '#fff' },

  // Welcome Section
  avatarPlaceholder: {
    width: 55,
    height: 55,
    backgroundColor: '#ED9191',
    borderRadius: 30,
    marginBottom: 5,
  },
  venueName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#000',
  },
  textSection: {
    flex: 1,
  },
  greeting: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
  welcome: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
  },
  profileSection: {
    alignItems: 'center',
  },
  profileLink: {
    color: '#5585FF',
    textDecorationLine: 'underline',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '400',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FFA600',
    paddingHorizontal: 7,
  },
  stars: {
    fontSize: 14,
    color: '#000',
    marginRight: 2,
  },
  badgeText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
  },

  // Suggestions
  suggestionsTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  suggestions: { marginBottom: 60 },
  suggestionsWrapper: {
    flexDirection: 'row',
  },
  suggestionCard: {
    borderRadius: 8,
    marginRight: 25,
    width: 160,
    alignItems: 'flex-start',
  },
  cardImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 1,
    alignSelf: 'flex-start',
  },
  cardSubtitle: {
    color: '#aaa',
    fontSize: 12,
    alignSelf: 'flex-start',
  },

  // Stats Section
  statsSection: { marginBottom: 20 },
  statsFilters: { marginBottom: 10 },
  timeFilter: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#818181',
    borderRadius: 10,
    marginRight: 15,
  },
  timeFilterText: { color: '#fff', fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 8, marginTop: 5 },
  statCard: {
    backgroundColor: '#222',
    padding: 17,
    width: '32%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4D4D4D',
    alignItems: 'left',
  },
  statValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  statLabel: { color: '#aaa', fontSize: 12 },
  activeDateTab: { backgroundColor: '#ACACAC', borderColor: '#818181' },
  activeDateTabText: { color: '#000', fontWeight: '700' },
  statistics: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 15
  },
  statisticsRow: {
    flexDirection: 'row', // Row layout
    justifyContent: 'space-between', // Space between label and value
    marginBottom: 5, // Space between each row
    borderBottomWidth: 1, // Bottom border for separation
    padding: 10, // Padding inside the row
    paddingHorizontal: 20,
    borderBottomColor: '#4D4D4D', // Bottom border color
    borderLeftWidth: 1, // Left border width
    borderRightWidth: 1, // Right border width
    borderRadius: 20,
    borderLeftColor: '#4D4D4D', // Left border color
    borderRightColor: '#4D4D4D', // Right border color
  },
  statisticsLabel: {
    color: '#fff', // White color for label text
    fontSize: 14, // Font size for label
  },
  statisticsValue: {
    color: '#fff', // White color for value text
    fontSize: 14, // Font size for value
    fontWeight: '700', // Bold the value for emphasis
  },

  // Rank Section
  rankSection: { alignItems: 'flex-start', marginTop: -40, paddingLeft: 15 },
  rankHeading: { color: '#fff', fontSize: 16, marginBottom: 50, marginTop: -90 },
  rankImage: {
    width: 350, // Set the width of the image
    height: 350, // Set the height of the image
    resizeMode: 'contain', // Ensures the image scales proportionally
  },
  eventContainer: {
    marginTop: 40
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderRadius: 10,
    borderBottomColor: '#fff'
  },
  eventTitle: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 15
  },
  showAll: {
    fontSize: 12,
    color: '#ccc',
    marginRight: 10,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderRadius: 8,
  },
  dayName: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8, // Space between day name and month/day
  },
  dateDetails: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  month: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 4, // Space between month and day
  },
  day: {
    fontSize: 13,
    color: '#fff'
  },
  selectedDateText: {
    color: '#fff',
  },
  dateWithBorder: {
    borderWidth: 1,             // Add border width
    borderColor: 'gray',        // Add border color (change as needed)
    paddingHorizontal: 10,                 // Add padding around the text
    paddingVertical: 6,
    alignItems: 'center',       // Center the text horizontally
    justifyContent: 'center',   // Center the text vertically
    borderRadius: 7,            // Optional: round the corners of the border
  },
  selectedDateBorder: {
    backgroundColor: '#9747FF', // Optional: Change background when selected
  },
  eventHistoryContainer: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    paddingBottom: 13
  },
  createButton: {
    backgroundColor: '#6F2CFF',
    padding: 16,
    borderRadius: 48,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  createContainer: {
    marginTop: 300,
    marginBottom: 50
  },
  eventsNavBar: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  eventsTabText: { color: '#828796', fontSize: 14, paddingHorizontal: 65 },
  eventsActiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  eventsInactiveTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#828796'
  },
  eventsActiveTabText: {
    color: '#fff',
    paddingBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
    borderWidth: 1,
    borderColor: '#828796', // Border color
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 55,
    marginTop: 20,
    marginBottom: 100
  },
  icon: {
    marginRight: 8, // Space between icon and input
  },
  input: {
    flex: 1,
    color: '#fff', // White text color
    fontSize: 16,
  },
  promotionsCreateContainer: {
    marginTop: 30
  }
});

export default Dashboard;
