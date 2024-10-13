import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, StyleSheet} from 'react-native';
import { Audio } from 'expo-av';

const StreamMusicScreen = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Cleanup on component unmount
        }
      : undefined;
  }, [sound]);

  const loadAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://your-music-url.com/song.mp3' },
      { shouldPlay: false, volume: 1.0 },
      onPlaybackStatusUpdate
    );
    setSound(sound);
    soundRef.current = sound;
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis);
      setPosition(status.positionMillis);
      setIsPlaying(status.isPlaying);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const handleSkipForward = async () => {
    if (sound) {
      let newPosition = position + 10000; // Skip 10 seconds forward
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleSkipBackward = async () => {
    if (sound) {
      let newPosition = position - 10000; // Skip 10 seconds backward
      await sound.setPositionAsync(newPosition);
    }
  };

  const handleVolumeChange = async (newVolume) => {
    setVolume(newVolume);
    await soundRef.current.setVolumeAsync(newVolume);
  };

  const handleSeek = async (newPosition) => {
    await sound.setPositionAsync(newPosition);
  };

  useEffect(() => {
    loadAudio();
  }, []);

  return (
    <View style={styles.container}>
      {/* Track Information */}
      <Image
        source={{ uri: 'https://your-music-url.com/artwork.jpg' }}
        style={styles.artwork}
      />
      <Text style={styles.trackInfo}>Track Title - Artist Name</Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="Back 10s" onPress={handleSkipBackward} />
        <Button title={isPlaying ? "Pause" : "Play"} onPress={handlePlayPause} />
        <Button title="Forward 10s" onPress={handleSkipForward} />
      </View>

      {/* Progress Bar */}
      {/* <Slider
        style={styles.progress}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={handleSeek}
      /> */}

      {/* Volume Control */}
      <Text>Volume</Text>
      {/* <Slider
        style={styles.volume}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  artwork: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  trackInfo: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progress: {
    width: '100%',
    height: 40,
  },
  volume: {
    width: '100%',
    height: 40,
  },
});

export default StreamMusicScreen;
