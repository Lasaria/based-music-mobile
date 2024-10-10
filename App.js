// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './screens/SignUpScreen';
import ConfirmSignUpScreen from './screens/ConfirmSignUpScreen';
import SignInScreen from './screens/SignInScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ListenerProfileScreen from './screens/ListenerProfileScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import SettingsScreen from './screens/SettingsScreen';
import InboxScreen from './screens/InboxScreen';
import WelcomeScreen from './screens/WelcomeScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
<<<<<<< HEAD
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Listener Profile Screens */}
        <Stack.Screen name='ListenerProfile' component={ListenerProfileScreen} options={{ headerTitle: 'Listener Profile' }} />
        <Stack.Screen name='Favorites' component={FavoritesScreen} options={{ headerTitle: 'Favorites' }} />
        <Stack.Screen name='Settings' component={SettingsScreen} options={{ headerTitle: 'Settings' }} />
        <Stack.Screen name='Inbox' component={InboxScreen} options={{ headerTitle: 'Inbox' }} />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
=======
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
>>>>>>> a2cf52b (Ensure WelcomeScreen is rendered in App.js)
  );
};

export default App;
