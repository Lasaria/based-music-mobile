import React, { useContext } from "react";
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";

const SearchResultItem = ({ item, onPress,disablePlay = false }) => {
  const {
    trackInfo,
    isPlaying,
    togglePlayPause,
    isPlayerReady,
    updateCurrentTrack,
  } = useContext(AudioContext);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const handlePress = () => {
    if (disablePlay) {
      onPress(); // Only call onPress without triggering play if disablePlay is true
    } else {
      handlePlay(item);
    }
  };

  const handlePlay = async (item) => {

    console.log("\n=== [START] SearchResultItem.handlePlay ===");

    // Extract and validate track ID
    const trackId = item.track_id || item.id;
    const itemType = item.type || item.content_type;

    console.log("[SearchResultItem] Play requested:", {
      type: itemType,
      id: trackId,
      currentTrack: trackInfo?.track_id,
      isPlayerReady,
      item: item,
    });

    // Validate item type
    if (itemType !== "song") {
      console.log("[SearchResultItem] Non-song item, navigating to detail");
      onPress(item);
      return;
    }

    // Validate track ID
    if (!trackId) {
      console.error("[SearchResultItem] Invalid track ID:", trackId);
      Alert.alert(
        "Playback Error",
        "Unable to play this track. Track ID is missing."
      );
      return;
    }

    try {
      // Check if this is the current track
      if (trackInfo?.track_id === trackId && isPlayerReady) {
        console.log("[SearchResultItem] Toggling current track playback");
        await togglePlayPause();
        return;
      }

      // Load and play new track
      console.log("[SearchResultItem] Loading new track:", trackId);
      await updateCurrentTrack(trackId);

      // Only attempt to play if the track was loaded successfully
      if (isPlayerReady) {
        await togglePlayPause();
      }
    } catch (error) {
      console.error("[SearchResultItem] Playback error:", {
        message: error.message,
        stack: error.stack,
      });

      Alert.alert(
        "Playback Error",
        "Unable to play this track. Please try again later."
      );
    }
  };

  const getIcon = () => {
    const itemType = item.type || item.content_type;
    switch (itemType) {
      case "artist":
        return "person";
      case "venue":
        return "location";
      case "song":
        return "musical-notes";
      case "playlist":
        return "list";
      case "album":
        return "disc";
      default:
        return "document";
    }
  };

  const getSubtitle = () => {
    const itemType = item.type || item.content_type;
    switch (itemType) {
      case "song":
        return `${item.artist_name || "Unknown Artist"} • ${formatDuration(
          item.duration
        )}`;
      case "playlist":
        return `${item.track_count || 0} songs${
          item.total_duration ? ` • ${formatDuration(item.total_duration)}` : ""
        }`;
      case "venue":
        return item.address || "No address available";
      case "artist":
        return `${item.follower_count || item.total_albums || 0} ${
          item.follower_count ? "followers" : "albums"
        }${item.total_tracks ? ` • ${item.total_tracks} tracks` : ""}`;
      case "album":
        return `${item.artist_name || "Unknown Artist"} • ${
          item.track_count || 0
        } tracks`;
      default:
        return "";
    }
  };

  const isCurrentTrack =
    (item.type === "song" || item.content_type === "song") &&
    trackInfo?.track_id === (item.track_id || item.id);
  const showPlayingState = isCurrentTrack && isPlaying;

  const renderActionButton = () => {
    if (item.type === "song" || item.content_type === "song") {
      return (
        <TouchableOpacity
          onPress={() => handlePlay(item)}
          style={styles.playButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPlayingState ? "pause" : "play"}
            size={24}
            color={isCurrentTrack ? "purple" : "white"}
          />
        </TouchableOpacity>
      );
    }
    return <Ionicons name="chevron-forward" size={24} color="gray" />;
  };

  // Validate required item properties
  if (!item || (!item.title && !item.name)) {
    console.error("[SearchResultItem] Invalid item data:", item);
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.container, isCurrentTrack && styles.currentTrackContainer]}
      onPress={handlePress}
    >
      <Image
        source={{
          uri:
            item.image_url ||
            item.cover_image_url ||
            "https://via.placeholder.com/50",
          headers: { "Cache-Control": "max-age=31536000" },
        }}
        style={[
          styles.image,
          (item.type === "artist" || item.content_type === "artist") &&
            styles.artistImage,
        ]}
      />
      <View style={styles.content}>
        <Text
          style={[styles.title, isCurrentTrack && styles.currentTrackText]}
          numberOfLines={1}
        >
          {item.title || item.name || "Untitled"}
        </Text>
        <View style={styles.subtitleContainer}>
          <Ionicons
            name={getIcon()}
            size={14}
            color="gray"
            style={styles.subtitleIcon}
          />
          <Text style={styles.subtitle} numberOfLines={1}>
            {getSubtitle()}
          </Text>
        </View>
      </View>
      {renderActionButton()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  currentTrackContainer: {
    backgroundColor: "#2a2a2a",
    borderColor: "purple",
    borderWidth: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  artistImage: {
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  currentTrackText: {
    color: "purple",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subtitleIcon: {
    marginRight: 4,
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    flex: 1,
  },
  playButton: {
    padding: 8,
  },
});

export default SearchResultItem;
