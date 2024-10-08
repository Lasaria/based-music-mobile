import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import MusicScreen from "./screens/MusicScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

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
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Tabs" children={() => <Tabs />} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>
  );
}