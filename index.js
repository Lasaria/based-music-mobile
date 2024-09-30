import 'react-native-gesture-handler';  // Must be the first import
import { registerRootComponent } from 'expo';
import App from './App';  // Importing your main App component

// Register the main component of the app
registerRootComponent(App);