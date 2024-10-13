// HomeScreen.js

import React, {useState, useEffect} from 'react';
import  { axiosGet } from '../utils/axiosCalls';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';
import { Audio } from 'expo-av';

const HomeScreen = ({ navigation }) => {
  const handleSignOut = async () => {
    await AuthService.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading sound');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleRefreshTokens = async () => {
    await AuthService.refreshTokens();
  };

  const streamMusic = async () => {
    const res = await axiosGet({
      url: 'http://localhost:3000/stream/8648c36a-5efc-495f-95fe-8c2a305a5bd2',  
      body: {}
  })
  console.log('res: ', res);
  
   await playSound(res.url); 
     
  }

  const [sound, setSound] = useState(null);
  const [loadingTime, setLoadingTime] = useState(null);
  const musicFileUrl = 'https://testingbm.s3.amazonaws.com/file_example_WAV_10MG.wav';

  const playSound = async (url) => {
    console.log('Play button clicked');
    const playClickTime = new Date().getTime(); // Time when play is clicked
    setLoadingTime(playClickTime);

    try {
      console.log('Loading sound...');
      const { sound } = await Audio.Sound.createAsync(
        { uri: url }
      );
      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isPlaying) {
          const startPlayingTime = new Date().getTime(); // Time when sound starts playing
          const latency = startPlayingTime - playClickTime; // Calculate latency
          console.log('Sound started playing');
        }
      });

      await sound.playAsync(); // Explicitly start playing
    } catch (error) {
      console.error('Error loading or playing sound:', error);
    }
  };


  const playMusic = () => {
     navigation.navigate('StreamMusic');
  }

  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Based Music!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Refresh Tokens" onPress={handleRefreshTokens} />
      {/* Listener Profile Button */}
      <Button title="Listener Profile" onPress={() => navigation.navigate('ListenerProfile')} />
         <Button title="music" onPress={streamMusic} />
         <Button  title='Stream music' onPress={playMusic}/>
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

