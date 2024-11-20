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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";
import { useQueue } from "../contexts/QueueContext";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider";
import { StatusBar } from "expo-status-bar";
import { axiosPost, axiosGet, axiosDelete } from "../utils/axiosCalls";
import { tokenManager } from "../utils/tokenManager";

const { width, height } = Dimensions.get("window");
const MAIN_SERVER_URL = "http://localhost:3000";

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
    formatTime,
    isInitializing,
  } = useContext(AudioContext);

  const { addToQueue } = useQueue();
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [isLike, setIsLike] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlistModal, setPlaylistModal] = useState(false);
  const [localSliderValue, setLocalSliderValue] = useState(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [isFetchingPlaylists, setIsFetchingPlaylists] = useState(false);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  // Debug status effect
  useEffect(() => {
    console.log("StreamMusic Status:", {
      isPlayerReady,
      isPlaying,
      hasTrackInfo: !!trackInfo,
      trackId: trackInfo?.track_id,
      audioUrl: trackInfo?.audio_url,
      error: playerError,
    });
  }, [isPlayerReady, isPlaying, trackInfo, playerError]);
  useEffect(() => {
    if (!isInitializing && trackInfo) {
      setIsLoading(false);
    }
  }, [isInitializing, trackInfo]);

  // Effect: Fetch User ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        // First check if userId was passed via navigation
        const params = router.params || {};
        if (params.userId) {
          setUserId(params.userId);
          return;
        }

        // Fallback to getting from tokenManager
        const userid = await tokenManager.getUserId();
        setUserId(userid);
      } catch (error) {
        console.error("[StreamMusic] Error getting user ID:", error);
      }
    };
    getUserId();
  }, [router.params]);
  console.log("[User Id Fetch]", userId);

  // Effect: Check Library Status
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

        const response = await axiosGet({
          url: `${MAIN_SERVER_URL}/library/${userId}/check?contentId=${trackId}`,
          isAuthenticated: true,
        });

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

  // Fetch Playlists
  const fetchPlaylists = async () => {
    if (!userId) return;

    setIsFetchingPlaylists(true);
    try {
      const response = await axiosGet({
        url: `${MAIN_SERVER_URL}/playlists`,
        isAuthenticated: true,
      });
      console.log("fetching the playlist:", response);

      setPlaylists(response.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setIsFetchingPlaylists(false);
    }
  };

  // Add Song to Playlist
  const handleAddToPlaylist = async (playlist_id) => {
    if (!trackInfo?.track_id || !userId) return;

    const token = await tokenManager.getAccessToken();

    try {
      const playlistResponse = await axiosGet({
        url: `${MAIN_SERVER_URL}/playlists?playlist_id=${playlist_id}`,
      });

      const existingSongs = playlistResponse?.playlist?.songs || [];

      //Append the new songs to the list
      const updatedSongs = [...new Set([...existingSongs, trackInfo.track_id])];

      const formData = new FormData();
      formData.append("songs", JSON.stringify(updatedSongs));

      setIsAddingToPlaylist(true);

      const response = await fetch(
        `${MAIN_SERVER_URL}/playlists/${playlist_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      setPlaylistModal(false);
      console.log("success adding playlis", response);
      // console.log("playlist id was", response.playlist.playlist_id);
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    } finally {
      setIsAddingToPlaylist(false);
    }
  };

  // Open Modal and Fetch Playlists
  const openModal = () => {
    setPlaylistModal(true);
    fetchPlaylists();
  };

  // Function: Handle Like Toggle
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

  // Function: Toggle Modal Visibility
  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const closeModal = () => setIsModalVisible(false);

  // Function: Handle Slider Value Change
  const handleSliderValueChange = (value) => {
    console.log("[StreamMusic] Slider value changing:", value);

    if (typeof value !== "number" || isNaN(value)) {
      console.warn("[StreamMusic] Invalid slider value received:", value);
      return;
    }

    setIsSeeking(true);
    setLocalSliderValue(value);
  };

  // Function: Handle Slider Sliding Complete
  const handleSlidingComplete = async (value) => {
    console.log("[StreamMusic] Sliding complete with value:", value);

    if (typeof value !== "number" || isNaN(value)) {
      console.warn("[StreamMusic] Invalid sliding complete value:", value);
      setIsSeeking(false);
      setLocalSliderValue(null);
      return;
    }

    try {
      // Ensure valid bounds
      const clampedValue = Math.max(0, Math.min(value, duration || 0));
      console.log("[StreamMusic] Attempting seek to:", clampedValue);

      if (clampedValue !== value) {
        console.log(
          "[StreamMusic] Value clamped from",
          value,
          "to",
          clampedValue
        );
      }

      await seekTo(clampedValue);
    } catch (err) {
      console.error("[StreamMusic] Seek error:", err);
    } finally {
      setIsSeeking(false);
      setLocalSliderValue(null);
    }
  };

  // Function: Navigate to Playlist
  const navigatePlaylist = () => {
    router.push("./playlistScreen");
    closeModal();
  };
  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.mainContainer}>
        <StatusBar style="light" />
        <View style={styles.loadingHeader}>
          <TouchableOpacity
            onPress={() => {
              console.log("Back button pressed");
              router.back();
            }}
            style={[
              styles.backButton,
              { backgroundColor: "rgba(255,255,255,0.1)" },
            ]}
            activeOpacity={0.7}
          >
            <View style={{ padding: 8 }}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="purple" />
          <Text style={styles.loadingText}>Loading track...</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <StatusBar style="light" />

      {/* Debug View */}
      {/* {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugText}>
            Ready: {isPlayerReady ? "Yes" : "No"}
            {"\n"}
            Playing: {isPlaying ? "Yes" : "No"}
            {"\n"}
            Track: {trackInfo?.title || "None"}
            {"\n"}
            Error: {playerError ? playerError.message : "None"}
          </Text>
        </View>
      )} */}

      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginTop: 70,
        }}
      >
        <Image
          source={{
            uri:
              trackInfo?.cover_image_url || "https://via.placeholder.com/200",
          }}
          style={styles.artImage}
        />
        <View style={styles.headerView}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.arrow_back}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Text style={{ color: "grey", fontSize: 16, fontWeight: 500 }}>
              Playing from
            </Text>
            <Text style={styles.headerText}>
              {trackInfo?.album_name ||
                playlists.find((p) => p.playlist_id === trackInfo?.playlist_id)
                  ?.title ||
                "Unknown"}
            </Text>
          </View>

          <TouchableOpacity onPress={toggleModal} style={styles.ellipse}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Album Art */}
      <View style={styles.artView}></View>

      {/* Message Display */}
      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {/* Song Info */}
      <View style={styles.songView}>
        <Text style={styles.songText}>{trackInfo?.title || "Loading..."}</Text>
        <View style={styles.songInnerView}>
          <TouchableOpacity style={styles.addButton} onPress={openModal}>
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
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
                size={25}
                color={isLike ? "purple" : "white"}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.songInnerText}>
        {trackInfo?.artist_name || "Unknown Artist"}
      </Text>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={playlistModal}
        onRequestClose={() => setPlaylistModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPlaylistModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>Select a Playlist</Text>
                {isFetchingPlaylists ? (
                  <ActivityIndicator size="large" color="purple" />
                ) : (
                  <FlatList
                    data={playlists}
                    keyExtractor={(item) => item.playlist_id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.playlistItem}
                        onPress={() => handleAddToPlaylist(item.playlist_id)}
                        disabled={isAddingToPlaylist}
                      >
                        <Text style={styles.playlistName}>{item.title}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setPlaylistModal(false)}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Slider
          style={styles.progressBar}
          minimumValue={0}
          maximumValue={duration || 100} // Provide a default max
          value={isSeeking ? localSliderValue : currentTime || 0}
          onValueChange={handleSliderValueChange}
          onSlidingComplete={handleSlidingComplete}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
          disabled={!isPlayerReady}
          step={1} // Add step to ensure integer values
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>-{formatTime(duration - currentTime)}</Text>
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
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    if (trackInfo) {
                      addToQueue(trackInfo);
                      setMessage("Added to queue");
                      setTimeout(() => setMessage(""), 3000);
                    }
                    closeModal();
                  }}
                >
                  <Ionicons name="add" size={24} color="white" />
                  <Text style={styles.modalText}>Add to queue</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    router.push("/queueList");
                    closeModal();
                  }}
                >
                  <Ionicons name="albums" size={24} color="white" />
                  <Text style={styles.modalText}>View queue list</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="share-social" size={24} color="white" />
                  <Text style={styles.modalText}>Share Song</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="information-circle" size={24} color="white" />
                  <Text style={styles.modalText}>View Artist</Text>
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
  debugContainer: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 10,
    zIndex: 999,
  },
  debugText: {
    color: "white",
    fontSize: 12,
  },
  headerView: {
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "space-between",
    paddingTop: 15,
    paddingHorizontal: 10,
  },
  arrow_back: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "white",
    padding: 2,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: 500,
  },
  ellipse: {
    position: "absolute",
    right: -10,
    borderWidth: 1,
    borderColor: "white",
    padding: 3,
    borderRadius: 12,
  },
  artView: {
    alignItems: "center",
    marginTop: 30,
  },
  artImage: {
    width: width,
    height: width,
    backgroundColor: "#333",
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
  songText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  songInnerText: {
    color: "#888",
    fontSize: 14,
    left:-5
  },
  progressContainer: {
    marginTop: 10,
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
  loadingHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // Move up slightly to account for header space
    marginTop: -50,
  },
  loadingText: {
    color: "white",
    marginTop: 20,
    fontSize: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 20,
  },
  songView: {
    flexDirection: "row",
    top: -10,
    left: -5,
    justifyContent: "space-between",
  },
  songInnerView: {
    flexDirection: "row",
    alignItems: "center",
    right: -10,
  },
  addButton: {
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 18,
    borderColor: "white",
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
  modalHeader: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  playlistItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  playlistName: {
    color: "white",
    fontSize: 16,
  },
  closeButton: {
    alignSelf: "center",
    marginTop: 10,
  },
});

export default StreamMusic;
