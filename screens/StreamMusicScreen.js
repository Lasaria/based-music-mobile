import React, { useState, useEffect, useRef } from 'react';
import { View, Text,  Button, Image, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const StreamMusicScreen = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [volume, setVolume] = useState(1.0); // 1.0 is max volume
  const [trackInfo, setTrackInfo] = useState({
    title: 'Track Title',
    artist: 'Artist Name',
    albumArt: 'https://via.placeholder.com/150', // Placeholder for album art
  });

  const soundRef = useRef(null);

  useEffect(() => {
    // Load and play the audio file from the server or local asset
    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync(); // Unload the sound when component unmounts
      }
    };
  }, []);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'http://localhost:3000/stream/your-track-id' }, // Replace with your backend URL
      { shouldPlay: true }
    );
    setSound(sound);
    soundRef.current = sound;

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);

      if (status.didJustFinish) {
        setIsPlaying(false); // Track finished playing
      }
    }
  };

  const handlePlayPause = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipForward = async () => {
    if (sound) {
      let newPosition = playbackPosition + 15000; // 15 seconds forward
      if (newPosition > playbackDuration) {
        newPosition = playbackDuration;
      }
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      let newPosition = playbackPosition - 15000; // 15 seconds backward
      if (newPosition < 0) {
        newPosition = 0;
      }
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleVolumeChange = async (newVolume) => {
    setVolume(newVolume);
    if (sound) {
      await sound.setVolumeAsync(newVolume);
    }
  };

  const handleSeek = async (value) => {
    if (sound) {
      const newPosition = value * playbackDuration;
      await sound.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: trackInfo.albumArt }} style={styles.albumArt} />

      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle}>{trackInfo.title}</Text>
        <Text style={styles.trackArtist}>{trackInfo.artist}</Text>
      </View>

      <View style={styles.controls}>
        <Button title="Skip Backward" onPress={handleSkipBackward} />
        <Button title={isPlaying ? 'Pause' : 'Play'} onPress={handlePlayPause} />
        <Button title="Skip Forward" onPress={handleSkipForward} />
      </View>

      <View style={styles.progressBar}>
        {/* <Slider
          minimumValue={0}
          maximumValue={1}
          value={playbackDuration ? playbackPosition / playbackDuration : 0}
          onSlidingComplete={handleSeek}
        /> */}
        <View style={styles.timeInfo}>
          <Text>{formatTime(playbackPosition)}</Text>
          <Text>{formatTime(playbackDuration)}</Text>
        </View>
      </View>

      <View style={styles.volumeControl}>
        <Text>Volume</Text>
        {/* <Slider
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  albumArt: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 18,
    color: 'gray',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressBar: {
    marginVertical: 10,
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  volumeControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default StreamMusicScreen;
