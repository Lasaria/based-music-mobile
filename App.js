// App.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './services/NavigationService';

import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import MusicScreen from "./screens/MusicScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

import SignUpScreen from './screens/SignUpScreen';
import ConfirmSignUpScreen from './screens/ConfirmSignUpScreen';
import SignInScreen from './screens/SignInScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import UserTypeChoiceScreen from './screens/UserTypeChoiceScreen';

import VenueProfileScreen from './screens/VenueProfileScreen';
import VenueInfoScreen from './screens/VenueInfoScreen';
import VenueEventsScreen from './screens/VenueEventsScreen';
import VenueBookingsScreen from './screens/VenueBookingsScreen';


import ListenerProfileScreen from './screens/ListenerProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import InboxScreen from './screens/InboxScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export default function App() {

  function Tabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Music" component={MusicScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
      </Tab.Navigator>
    )
  }



  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="UserTypeChoice" component={UserTypeChoiceScreen} />

          {/* Listener Profile Screens */}
          <Stack.Screen name='ListenerProfile' component={ListenerProfileScreen} options={{ headerTitle: 'Listener Profile' }} />
          <Stack.Screen name='Favorites' component={FavoritesScreen} options={{ headerTitle: 'Favorites' }} />
          <Stack.Screen name='Settings' component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
          <Stack.Screen name='Inbox' component={InboxScreen} options={{ headerTitle: 'Inbox' }} />

          {/* Venue Profile screens */}
          <Stack.Screen name='VenueProfileScreen' component={VenueProfileScreen} />
          <Stack.Screen name="VenueInfo" component={VenueInfoScreen} />
          <Stack.Screen name="Events" component={VenueEventsScreen} />
          <Stack.Screen name="VenueBookings" component={VenueBookingsScreen} />
          {/* Add other screens as needed */}

          <Stack.Screen name="Tabs" children={() => <Tabs />} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
