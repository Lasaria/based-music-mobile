import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
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
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
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
    </Tabs>
  );
}