import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { AudioContext } from "../contexts/AudioContext";
import { Ionicons } from "@expo/vector-icons";

const SongList = ({
  songs,
  loading = false,
  onEndReached,
  ListHeaderComponent,
  ListEmptyComponent,
}) => {
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
  };

  const getSubtitle = (item) => {
    switch (item.content_type) {
      case "playlist":
        return `${item.track_count} songs • ${formatDuration(
          item.total_duration
        )}`;
      case "song":
        return `${item.artist_name} • ${formatDuration(item.duration)}`;
      case "album":
        return `${item.artist_name} • ${item.track_count || 0} tracks`;
      case "artist":
        return `${item.total_albums || 0} albums • ${
          item.total_tracks || 0
        } tracks`;
      default:
        return "";
    }
  };

  const handlePlay = async (song) => {
    if (trackInfo?.track_id === song.track_id && isPlayerReady) {
      await togglePlayPause();
      return;
    }

    try {
      await updateCurrentTrack(song.track_id);
      await togglePlayPause();
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  const renderItem = ({ item }) => {
    const isCurrentTrack = trackInfo?.track_id === item.track_id;
    const showPlayingState = isCurrentTrack && isPlaying;

    return (
      <View style={styles.libraryItem}>
        <Image
          source={{
            uri: item.cover_image_url || "https://via.placeholder.com/50",
            headers: { "Cache-Control": "max-age=31536000" },
          }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title || "Untitled"}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {getSubtitle(item)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handlePlay(item)}
          style={styles.playButton}
        >
          <Ionicons
            name={showPlayingState ? "pause" : "play"}
            size={24}
            color={isCurrentTrack ? "purple" : "white"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && songs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={songs}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.content_type}-${item.content_id}`}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator color="purple" style={styles.loader} />
        ) : null
      }
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
  libraryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    color: "white",
    fontSize: 16,
    marginBottom: 4,
  },
  itemSubtitle: {
    color: "gray",
    fontSize: 14,
  },
  playButton: {
    paddingHorizontal: 10,
  },
  loader: {
    marginVertical: 20,
  },
});

export default SongList;
