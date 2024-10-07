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
import VenueProfileScreen from './screens/VenueProfileScreen';
import VenueInfoScreen from './screens/VenueInfoScreen';
import VenueEventsScreen from './screens/VenueEventsScreen';
import VenueBookingsScreen from './screens/VenueBookingsScreen';
import InboxScreen from './screens/InboxScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        {/* <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} /> */}
        {/* Add other screens as needed */}

        {/* Venue Profile screens */}
        <Stack.Screen name='VenueProfileScreen' component={VenueProfileScreen} />
        <Stack.Screen name="VenueInfo" component={VenueInfoScreen} />
        <Stack.Screen name="Events" component={VenueEventsScreen} />
        <Stack.Screen name="VenueBookings" component={VenueBookingsScreen} />
        <Stack.Screen name="Inbox" component={InboxScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
