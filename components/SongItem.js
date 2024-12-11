import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";

/**
 * A universal song component that can be used across different screens
 * @param {Object} props
 * @param {Object} props.item - The song item data
 * @param {Function} props.onPress - Optional callback for when the song is pressed
 * @param {boolean} props.disablePlay - Optional flag to disable play functionality
 * @param {string} props.variant - Optional display variant ('compact', 'detailed', 'search')
 * @param {Object} props.style - Optional additional styles
 * @param {boolean} props.showArtist - Optional flag to show/hide artist info
 * @param {boolean} props.showDuration - Optional flag to show/hide duration
 * @param {boolean} props.showPlayCount - Optional flag to show/hide play count
 */
const SongItem = ({
  item,
  onPress,
  disablePlay = false,
  variant = "detailed",
  style = {},
  showArtist = true,
  showDuration = true,
  showPlayCount = false,
}) => {
  const {
    trackInfo,
    isPlaying,
    togglePlayPause,
    updateCurrentTrack,
    currentTrackId,
  } = useContext(AudioContext);

  // Utility function to format duration
  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format large numbers for play count
  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Handle play/pause functionality
  const handlePlayPress = async (e) => {
    e.stopPropagation(); // Prevent event bubbling

    // Since we already have access to item from props, we use it directly
    if (isCurrentTrack) {
      await togglePlayPause();
    } else {
      await updateCurrentTrack(item.track_id);
      await togglePlayPause();
    }
  };

  // Handle main container press
  const handleContainerPress = async () => {
    if (onPress) {
      onPress(item);
    } else if (!disablePlay) {
      await handlePlayPress({ stopPropagation: () => {} });
    }
  };

  // Check if this is the current playing track
  const isCurrentTrack = item.track_id === currentTrackId;
  const showPlayingState = isCurrentTrack && isPlaying;

  // Get image URL with fallback
  const imageUrl =
    item.image_url || item.cover_image_url || "https://via.placeholder.com/50";

  // Render subtitle based on variant and available data
  const renderSubtitle = () => {
    const parts = [];

    if (showArtist && item.artist_name) {
      parts.push(item.artist_name);
    }

    if (showDuration && item.duration) {
      parts.push(formatDuration(item.duration));
    }

    if (showPlayCount && item.play_count) {
      parts.push(`${formatCount(item.play_count)} plays`);
    }

    return parts.join(" • ");
  };

  // Get container style based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case "compact":
        return styles.compactContainer;
      case "search":
        return styles.searchContainer;
      default:
        return styles.container;
    }
  };

  return (
    <TouchableOpacity
      style={[
        getContainerStyle(),
        isCurrentTrack && styles.currentTrackContainer,
        style,
      ]}
      onPress={handleContainerPress}
    >
      <Image
        source={{
          uri: imageUrl,
          headers: { "Cache-Control": "max-age=31536000" },
        }}
        style={[
          styles.image,
          variant === "compact" && styles.compactImage,
          variant === "search" && styles.searchImage,
        ]}
      />

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            isCurrentTrack && styles.currentTrackText,
            variant === "compact" && styles.compactTitle,
          ]}
          numberOfLines={1}
        >
          {item.title || item.name || "Untitled"}
        </Text>

        {renderSubtitle() ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {renderSubtitle()}
          </Text>
        ) : null}
      </View>

      {!disablePlay && (
        <TouchableOpacity
          onPress={handlePlayPress}
          style={styles.playButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPlayingState ? "pause" : "play"}
            size={24}
            color={isCurrentTrack ? "purple" : "white"}
          />
        </TouchableOpacity>
      )}
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
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#1a1a1a",
    marginVertical: 2,
    borderRadius: 6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a1a",
    marginVertical: 4,
    borderRadius: 12,
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
  compactImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  searchImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
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
  compactTitle: {
    fontSize: 14,
  },
  currentTrackText: {
    color: "purple",
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    marginTop: 4,
  },
  playButton: {
    padding: 8,
  },
});

export default SongItem;
