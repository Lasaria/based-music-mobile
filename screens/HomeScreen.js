// HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from '../services/AuthService';

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    await signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Based Music!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
});
