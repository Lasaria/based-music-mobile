import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { axiosPost, axiosGet, axiosDelete } from "../utils/axiosCalls";
import { tokenManager } from "../utils/tokenManager";

const { width, height } = Dimensions.get("window");
const MAIN_SERVER_URL = "http://localhost:3000";

const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("[StreamMusic] Error decoding JWT:", error);
    return null;
  }
};

const StreamMusic = () => {
  const {
    isPlaying,
    togglePlayPause,
    trackInfo,
    error: playerError,
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
  const [userId, setUserId] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userid = await tokenManager.getUserId();
        setUserId(userid);
      } catch (error) {
        console.error("[StreamMusic] Error getting user ID:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    console.log("[StreamMusic] Track Info updated:", trackInfo);
  }, [trackInfo]);

  useEffect(() => {
    const checkLibraryStatus = async () => {
      if (!trackInfo) {
        console.log("[StreamMusic] No track info available");
        return;
      }

      const trackId = trackInfo.track_id;
      if (!trackId || !userId) {
        console.log("[StreamMusic] Missing required data:", {
          trackId,
          userId,
        });
        return;
      }

      try {
        console.log("[StreamMusic] Checking library status for:", {
          userId,
          trackId,
        });

        // Fix 1: Construct URL with query params explicitly
        const response = await axiosGet({
          url: `${MAIN_SERVER_URL}/library/${userId}/check?contentId=${trackId}`,
          isAuthenticated: true,
        });

        // Alternative Fix 2: If using params object
        /*
      const response = await axiosGet({
        url: `${MAIN_SERVER_URL}/library/${userId}/check`,
        params: {
          contentId: trackId
        },
        paramsSerializer: params => {
          return `contentId=${params.contentId}`;
        },
        isAuthenticated: true,
      });
      */

        console.log("[StreamMusic] Library check response:", response);
        setIsLike(response.exists);
      } catch (err) {
        console.error("[StreamMusic] Error checking library status:", err);
        console.error("[StreamMusic] Error details:", {
          trackId,
          userId,
          error: err.message,
        });
      }
    };

    checkLibraryStatus();
  }, [trackInfo, userId]);

  const handleLikeToggle = async () => {
    if (!trackInfo || !userId) {
      setMessage("Cannot modify library: Missing required information");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const trackId = trackInfo.track_id;

    setIsLikeLoading(true);
    try {
      if (isLike) {
        console.log("[StreamMusic] Removing track from library:", {
          userId,
          contentId: trackId,
        });

        await axiosDelete({
          url: `${MAIN_SERVER_URL}/library/${userId}`,
          body: {
            contentType: "song",
            contentId: trackId,
          },
          isAuthenticated: true,
        });
        setIsLike(false);
        setMessage("Removed from your library");
      } else {
        console.log("[StreamMusic] Adding track to library:", {
          userId,
          contentId: trackId,
          contentType: "song",
        });

        await axiosPost({
          url: `${MAIN_SERVER_URL}/library/${userId}/add`,
          body: {
            contentType: "song",
            contentId: trackId,
          },
          isAuthenticated: true,
        });
        setIsLike(true);
        setMessage("Added to your library");
      }
    } catch (err) {
      console.error("[StreamMusic] Error toggling library status:", err);
      setMessage(err?.data?.error || "Failed to update library");
    } finally {
      setIsLikeLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const closeModal = () => setIsModalVisible(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSliderValueChange = (value) => {
    setIsSeeking(true);
    setLocalSliderValue(value);
  };

  const handleSlidingComplete = (value) => {
    setIsSeeking(false);
    seekTo(value);
    setLocalSliderValue(null);
  };

  const navigatePlaylist = () => {
    router.push("./playlistScreen");
    closeModal();
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
          {trackInfo?.album_name || "Now Playing"}
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View style={styles.artView}>
        <Image
          source={{
            uri:
              trackInfo?.cover_image_url || "https://via.placeholder.com/200",
          }}
          style={styles.artImage}
        />
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLikeToggle}
          disabled={isLikeLoading || !userId}
        >
          {isLikeLoading ? (
            <ActivityIndicator color="purple" size="small" />
          ) : (
            <Ionicons
              name={isLike ? "heart" : "heart-outline"}
              size={30}
              color={isLike ? "purple" : "white"}
            />
          )}
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

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  onPress={navigatePlaylist}
                  style={styles.modalItem}
                >
                  <Ionicons name="list" size={24} color="white" />
                  <Text style={styles.modalText}>View playlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="add" size={24} color="white" />
                  <Text style={styles.modalText}>Add to queue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="albums" size={24} color="white" />
                  <Text style={styles.modalText}>View queue list</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="share-social" size={24} color="white" />
                  <Text style={styles.modalText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="heart" size={24} color="white" />
                  <Text style={styles.modalText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="information-circle" size={24} color="white" />
                  <Text style={styles.modalText}>About</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
  },
  messageContainer: {
    position: "absolute",
    top: height * 0.5,
    width: "100%",
    alignItems: "center",
    zIndex: 9999,
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
  songText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  songInnerView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    position: "relative",
    width: "100%",
    justifyContent: "center",
  },
  songInnerText: {
    color: "#888",
    fontSize: 14,
  },
  addButton: {
    position: "absolute",
    left: "90%",
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
