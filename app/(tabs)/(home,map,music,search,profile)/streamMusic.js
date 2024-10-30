import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";

const StreamMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [message, setMessage] = useState("");
  const [isLike, setIsLike] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [sound, setSound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trackInfo, setTrackInfo] = useState(null);
  const progressUpdateInterval = useRef(null);
  const isSeeking = useRef(false);

  const TRACK_ID = "d599e983-9996-4b70-bb90-0f338ae55ee1";
  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    setupAudio();
    return () => {
      cleanupAudio();
    };
  }, []);

  const setupAudio = async () => {
    try {
      // Configure audio session
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      // Fetch track info
      const response = await fetch(`${BASE_URL}/tracks?track_id=${TRACK_ID}`);
      const data = await response.json();
      const track = data.tracks[0];
      setTrackInfo(track);

      // Create sound object
      const { sound } = await Audio.Sound.createAsync(
        { uri: `${BASE_URL}/tracks/stream/${TRACK_ID}` },
        {
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          shouldPlay: false,
          volume: volume,
        },
        onPlaybackStatusUpdate
      );

      setSound(sound);
      setIsLoading(false);
    } catch (error) {
      console.error("Error setting up audio:", error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    if (!isSeeking.current) {
      setCurrentTime(status.positionMillis / 1000);
    }
    setDuration(status.durationMillis / 1000);

    if (status.didJustFinish) {
      handleTrackFinish();
    }
  };
  const handleTrackFinish = async () => {
    try {
      setIsPlaying(false);

      // Check if sound object exists before using it
      if (sound) {
        // Wrap in try-catch to handle any potential errors
        try {
          await sound.setPositionAsync(0);
          setCurrentTime(0);
        } catch (error) {
          console.error("Error resetting position:", error);
        }
      }
    } catch (error) {
      console.error("Error handling track finish:", error);
    }
  };

  const cleanupAudio = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    if (progressUpdateInterval.current) {
      clearInterval(progressUpdateInterval.current);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = async (value) => {
    if (!sound) return;

    isSeeking.current = true;
    try {
      await sound.setPositionAsync(value * 1000);
      setCurrentTime(value);
    } finally {
      isSeeking.current = false;
    }
  };

  const handleVolumeChange = async (value) => {
    if (!sound) return;

    try {
      await sound.setVolumeAsync(value);
      setVolume(value);
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  const forward = async () => {
    if (!sound) return;
    const newPosition = Math.min(currentTime + 10, duration);
    await sound.setPositionAsync(newPosition * 1000);
    setCurrentTime(newPosition);
  };

  const backward = async () => {
    if (!sound) return;
    const newPosition = Math.max(currentTime - 10, 0);
    await sound.setPositionAsync(newPosition * 1000);
    setCurrentTime(newPosition);
  };

  // Keep your existing UI-related functions
  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const closeModal = () => setIsModalVisible(false);
  const navigatePlaylist = () => {
    router.push("./playlistScreen");
    closeModal();
  };

  const handleLikeToggle = () => {
    setIsLike(!isLike);
    setMessage(isLike ? "You unliked the song" : "You liked the song");
    setTimeout(() => setMessage(""), 3000);
  };

  // Your existing JSX with updated values
  return (
    <View style={styles.mainConatiner}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {trackInfo?.album_id || "Loading..."}
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artView}>
        <TouchableOpacity onPress={handleLikeToggle}>
          <Image
            source={{
              uri:
                trackInfo?.cover_image_url || "https://via.placeholder.com/200",
            }}
            style={styles.artImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "absolute", right: 2, top: 5 }}
          onPress={handleLikeToggle}
        >
          <Ionicons
            name={isLike ? "heart" : "heart-outline"}
            size={30}
            color={isLike ? "purple" : "white"}
          />
        </TouchableOpacity>
      </View>

      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {/* Song Info */}
      <View style={styles.songView}>
        <Text style={styles.songText}>{trackInfo?.title || "Loading..."}</Text>
        <View style={styles.songView}>
          <Text style={styles.songInnerText}>
            {trackInfo?.artist_name || "Unknown Artist"}
          </Text>
          <View style={{ position: "absolute", left: "55%" }}>
            <TouchableOpacity>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginTop: 50 }}>
        <Slider
          style={{ width: "100%" }}
          minimumValue={0}
          maximumValue={duration}
          value={currentTime}
          onValueChange={handleSeek}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
          disabled={isLoading}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "white" }}>{formatTime(currentTime)}</Text>
          <Text style={{ color: "white" }}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.playBackView}>
        <TouchableOpacity onPress={backward} disabled={isLoading}>
          <Ionicons
            name="play-back"
            size={30}
            color={isLoading ? "gray" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause} disabled={isLoading}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={50}
            color={isLoading ? "gray" : "purple"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={forward} disabled={isLoading}>
          <Ionicons
            name="play-forward"
            size={30}
            color={isLoading ? "gray" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeView}>
        <Ionicons name="volume-mute" size={24} color="white" />
        <Slider
          style={{ flex: 1, marginHorizontal: 10 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
          disabled={isLoading}
        />
        <Ionicons name="volume-high" size={24} color="white" />
      </View>

      <Text style={styles.currentDevice}>Device 1</Text>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {/* Keep your existing modal content */}
      </Modal>
    </View>
  );
};

// Helper function to format time in mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
  },
  headerText: { color: "white", fontSize: 16 },
  artView: { alignItems: "center", marginTop: 30 },
  artImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#333",
  },
  messageContainer: {
    position: "absolute",
    top: 400,
    width: "100%",
    alignItems: "center",
    z: 9999,
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  messageText: {
    backgroundColor: "white",
    color: "black",
    padding: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
  songView: {
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  songText: { color: "white", fontSize: 20, fontWeight: "bold" },
  songInnerView: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  songInnerText: { color: "#888", fontSize: 14 },
  playBackView: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  volumeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
  },
  currentDevice: {
    color: "purple",
    textAlign: "center",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderTopEndRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  modalText: {
    color: "white",
    fontSize: 16,
    marginLeft: 18,
  },
});

export default StreamMusic;
