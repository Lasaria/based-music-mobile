import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { UserService } from "../services/UserService"

const UserTypeChoiceScreen = ({ navigation }) => {
  const handleUserTypeSelection = async (userType) => {
    console.log(userType)
    // Here you would typically save the user type to your app's state or backend
    await UserService.setUserType(userType)
    // For now, we'll just navigate to a hypothetical 'Main' screen
    navigation.navigate('Home', { userType });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUserTypeSelection('listener')}
      >
        <Text style={styles.buttonText}>Listener</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUserTypeSelection('artist')}
      >
        <Text style={styles.buttonText}>Artist</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleUserTypeSelection('venue')}
      >
        <Text style={styles.buttonText}>Venue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserTypeChoiceScreen;