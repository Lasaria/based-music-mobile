import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AudioContext } from "../../../contexts/AudioContext";
import { useQueue } from "../../../contexts/QueueContext";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");
const ITEM_HEIGHT = 70;

const QueueList = () => {
  console.log("[QueueList] Rendering QueueList component");
  const router = useRouter();
  const { trackInfo, isPlaying, togglePlayPause, updateCurrentTrack } =
    useContext(AudioContext);
  const { queue, removeFromQueue, clearQueue, message, reorderQueue } =
    useQueue();

  // Handle playing a track
  const handlePlay = async (item) => {
    try {
      console.log("[QueueList] Playing track:", item.track_id);

      // If this is the currently playing track, just toggle play/pause
      if (trackInfo?.track_id === item.track_id) {
        console.log("[QueueList] Toggling current track");
        await togglePlayPause();
        return;
      }

      // Otherwise, start playing the new track
      console.log("[QueueList] Starting new track");
      await updateCurrentTrack(item.track_id);
    } catch (err) {
      console.error("[QueueList] Error playing track:", err);
    }
  };

  const renderItem = ({ item, drag, isActive, index }) => {
    console.log(`[TrackItem] Rendering item at index ${index}:`, item);

    // Check if this is the currently playing track
    const isCurrentTrack = trackInfo?.track_id === item.track_id;
    const showPlayingState = isCurrentTrack && isPlaying;

    return (
      <View
        style={[
          styles.trackItem,
          {
            backgroundColor: isActive ? "#2c2c2c" : "#1c1c1c",
            elevation: isActive ? 8 : 0,
            shadowColor: "#000",
            shadowOffset: {
              width: isActive ? 0 : 0,
              height: isActive ? 4 : 0,
            },
            shadowOpacity: isActive ? 0.3 : 0,
            shadowRadius: isActive ? 8 : 0,
          },
        ]}
      >
        <TouchableOpacity
          onLongPress={drag}
          style={styles.dragHandle}
          disabled={isActive}
        >
          <Ionicons name="menu" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trackContent}
          onPress={() => handlePlay(item)}
        >
          <Image
            source={{
              uri: item.cover_image_url || "https://via.placeholder.com/50",
            }}
            style={styles.trackImage}
          />

          <View style={styles.trackInfo}>
            <Text
              style={[
                styles.trackTitle,
                isCurrentTrack && styles.activeTrackTitle,
              ]}
            >
              {item.title}
            </Text>
            <Text style={styles.artistName}>{item.artist_name}</Text>
          </View>

          <View style={styles.playStateContainer}>
            {isCurrentTrack && (
              <Ionicons
                name={showPlayingState ? "pause-circle" : "play-circle"}
                size={24}
                color="purple"
              />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log(`[TrackItem] Removing track at index ${index}`);
            removeFromQueue(item.track_id);
          }}
          style={styles.removeButton}
          disabled={isActive}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Queue</Text>
        <TouchableOpacity
          onPress={() => {
            console.log("[QueueList] Clearing queue");
            clearQueue();
          }}
        >
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}

      {trackInfo && (
        <View style={styles.nowPlaying}>
          <Text style={styles.sectionTitle}>Now Playing</Text>
          <TouchableOpacity
            style={styles.trackItem}
            onPress={() => handlePlay(trackInfo)}
          >
            <Image
              source={{
                uri:
                  trackInfo.cover_image_url || "https://via.placeholder.com/50",
              }}
              style={styles.trackImage}
            />
            <View style={styles.trackInfo}>
              <Text style={[styles.trackTitle, styles.activeTrackTitle]}>
                {trackInfo.title}
              </Text>
              <Text style={styles.artistName}>{trackInfo.artist_name}</Text>
            </View>
            <View style={styles.playStateContainer}>
              <Ionicons
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={24}
                color="purple"
              />
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.queueContainer}>
        <Text style={styles.sectionTitle}>Next in Queue</Text>
        {queue.length === 0 ? (
          <View style={styles.emptyQueue}>
            <Text style={styles.emptyText}>Your queue is empty</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push("/music")}
            >
              <Text style={styles.browseButtonText}>Browse Music</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <DraggableFlatList
            data={queue}
            renderItem={renderItem}
            keyExtractor={(item) => item.track_id}
            onDragEnd={({ from, to }) => {
              console.log(
                "[QueueList] Drag ended, reordering from:",
                from,
                "to:",
                to
              );
              reorderQueue(from, to);
            }}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    color: "purple",
    fontSize: 16,
  },
  nowPlaying: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  sectionTitle: {
    color: "#888",
    fontSize: 14,
    marginBottom: 10,
  },
  queueContainer: {
    flex: 1,
    padding: 20,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    backgroundColor: "#1c1c1c",
    height: ITEM_HEIGHT,
  },
  dragHandle: {
    padding: 10,
    marginRight: 5,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 15,
  },
  trackTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  trackContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  playStateContainer: {
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  activeTrackTitle: {
    color: "purple",
    fontWeight: "bold",
  },
  messageContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  messageText: {
    backgroundColor: "rgba(128, 0, 128, 0.9)",
    color: "white",
    padding: 10,
    borderRadius: 20,
    fontSize: 14,
  },
  artistName: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  removeButton: {
    padding: 10,
  },
  emptyQueue: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "purple",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  browseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  listContainer: {
    paddingBottom: 100,
  },
});

export default QueueList;
