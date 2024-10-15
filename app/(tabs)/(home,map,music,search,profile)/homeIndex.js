// HomeScreen.js

import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthService } from '../../../services/AuthService';
import { axiosGet } from '../../../utils/axiosCalls';
import { router } from 'expo-router';

const HomeScreen = ({  }) => {
  const handleSignOut = async () => {
    await AuthService.signOut();
    router.replace('/welcome');
  };

  const handleRefreshTokens = async () => {
    await AuthService.refreshTokens();
  };

  const playMusic = async () => {
    const res = await axiosGet({
        url: "http://localhost:3000/get-user-type/f48824d8-9011-7014-8f35-dfeb5f8f3f69",
        body: {}
    })

    console.log(res)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Based Music!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Refresh Tokens" onPress={handleRefreshTokens} />
      {/* Listener Profile Button */}
      <Button title="Listener Profile" onPress={() => router.push("/listenerProfile")} />
      <Button title="Music" onPress={playMusic} />
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

