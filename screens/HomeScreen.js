// HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    await AuthService.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const handleRefreshTokens = async () => {
    await AuthService.refreshTokens();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Based Music!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Refresh Tokens" onPress={handleRefreshTokens} />
      {/* Listener Profile Button */}
      <Button title="Listener Profile" onPress={() => navigation.navigate('ListenerProfile')} />
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
