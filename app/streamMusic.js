import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const StreamMusic = () => {
  const {
    isPlaying,
    togglePlayPause,
    trackInfo,
    error,
    isPlayerReady,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    skipForward,
    skipBackward,
  } = useContext(AudioContext);

  const router = useRouter();
  const [isLike, setIsLike] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);

  const handleLikeToggle = () => {
    setIsLike(!isLike);
    setMessage(isLike ? "You unliked the song" : "You liked the song");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const closeModal = () => setIsModalVisible(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  const handleSliderValueChange = (value) => {
    setLocalSliderValue(value);
  };

  const handleSlidingComplete = (value) => {
    seekTo(value);
    setLocalSliderValue(null);
  };
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {"album name or page name ?" || "Loading..."}
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
        <TouchableOpacity style={styles.likeButton} onPress={handleLikeToggle}>
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
        <View style={styles.songInnerView}>
          <Text style={styles.songInnerText}>
            {trackInfo?.artist_name || "Unknown Artist"}
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 0}
          value={isSeeking ? localSliderValue : currentTime || 0}
          onValueChange={handleSliderValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
          disabled={!isPlayerReady}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.playBackView}>
        <TouchableOpacity onPress={skipBackward} disabled={!isPlayerReady}>
          <Ionicons
            name="play-back"
            size={30}
            color={!isPlayerReady ? "gray" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} disabled={!isPlayerReady}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={50}
            color={!isPlayerReady ? "gray" : "purple"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipForward} disabled={!isPlayerReady}>
          <Ionicons
            name="play-forward"
            size={30}
            color={!isPlayerReady ? "gray" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeView}>
        <Ionicons name="volume-mute" size={24} color="white" />
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
          disabled={!isPlayerReady}
        />
        <Ionicons name="volume-high" size={24} color="white" />
      </View>

      <Text style={styles.currentDevice}>Device 1</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error.message}</Text>
          {error.details && (
            <Text style={styles.errorDetails}>{error.details}</Text>
          )}
        </View>
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Text style={styles.modalText}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalItem}>
              <Ionicons name="share-outline" size={24} color="white" />
              <Text style={styles.modalText}>Share</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
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
  headerText: {
    color: "white",
    fontSize: 16,
  },
  artView: {
    alignItems: "center",
    marginTop: 30,
  },
  artImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "#333",
  },
  likeButton: {
    position: "absolute",
    right: 2,
    top: 5,
  },
  messageContainer: {
    position: "absolute",
    top: height * 0.5,
    width: "100%",
    alignItems: "center",
    zIndex: 9999,
  },
  messageText: {
    backgroundColor: "white",
    color: "black",
    padding: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 10,
  },
  songView: {
    alignItems: "center",
    marginTop: 20,
  },
  songText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  songInnerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  songInnerText: {
    color: "#888",
    fontSize: 14,
  },
  addButton: {
    marginLeft: 10,
  },
  progressContainer: {
    marginTop: 50,
  },
  progressBar: {
    width: "100%",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "white",
  },
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
  volumeSlider: {
    flex: 1,
    marginHorizontal: 10,
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
    borderTopLeftRadius: 20,
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
  errorContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  errorDetails: {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
});

export default StreamMusic;
