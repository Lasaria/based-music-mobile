import { Tabs, Stack, Group } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs 
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Assign icon names based on the route name and focus state
          switch (route.name) {
            case 'home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'music':
              iconName = focused ? 'musical-note' : 'musical-note-outline';
              break;
            case 'profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          // Return the Ionicon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Define active and inactive tint colors
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen 
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          // Add any tab bar icon here if needed
        }}
      />
      <Tabs.Screen 
        name="map"
        options={{
          title: 'Map',
          tabBarLabel: 'Map',
          // Add any tab bar icon here if needed
        }}
      />
      <Tabs.Screen 
        name="music"
        options={{
          title: 'Music',
          tabBarLabel: 'Music',
          // Add any tab bar icon here if needed
        }}
      />
      <Tabs.Screen 
        name="search"
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          // Add any tab bar icon here if needed
        }}
      />
      <Tabs.Screen 
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          // Add any tab bar icon here if needed
        }}
      />
    </Tabs>
    
  );
}