import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AudioContext } from "../../../contexts/AudioContext";
import { useQueue } from "../../../contexts/QueueContext";

const { width } = Dimensions.get("window");

const QueueList = () => {
  const router = useRouter();
  const { trackInfo } = useContext(AudioContext);
  const { queue, removeFromQueue, clearQueue, message } = useQueue();

  const renderItem = ({ item, index }) => (
    <View style={styles.trackItem}>
      <Image
        source={{
          uri: item.cover_image_url || "https://via.placeholder.com/50",
        }}
        style={styles.trackImage}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.artistName}>{item.artist_name}</Text>
      </View>
      <TouchableOpacity
        onPress={() => removeFromQueue(item.track_id)}
        style={styles.removeButton}
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Queue</Text>
        <TouchableOpacity onPress={clearQueue}>
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
          <View style={styles.trackItem}>
            <Image
              source={{
                uri:
                  trackInfo.cover_image_url || "https://via.placeholder.com/50",
              }}
              style={styles.trackImage}
            />
            <View style={styles.trackInfo}>
              <Text style={styles.trackTitle}>{trackInfo.title}</Text>
              <Text style={styles.artistName}>{trackInfo.artist_name}</Text>
            </View>
          </View>
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
          <FlatList
            data={queue}
            renderItem={renderItem}
            keyExtractor={(item) => item.track_id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
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
  messageContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 999,
  },
  messageText: {
    backgroundColor: "rgba(128, 0, 128, 0.9)", // Purple with opacity
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
