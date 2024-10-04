// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeStack from './screens/BottomTabNav/HomeTabNav/HomeStack';
import ArtistStack from './screens/BottomTabNav/ArtistTabNav/ArtistStack';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const App = () => {
  return (
    <NavigationContainer>
     <Tab.Navigator>
      <Tab.Screen name='HomeStack' component={HomeStack}/>
      <Tab.Screen name='ArtistStack' component={ArtistStack} />
     </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

