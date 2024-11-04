// components/AudioPlayer.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";
import { useRouter, usePathname } from "expo-router";

const AudioPlayer = () => {
  const { isPlaying, togglePlayPause, trackInfo, error, isPlayerReady } =
    useContext(AudioContext);
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigateToStream = () => {
    router.push("/streamMusic");
  };

  // Do not render the AudioPlayer if the player is not ready
  if ((!isPlayerReady && !trackInfo) || pathname === "/streamMusic"|| pathname === "/signIn") {
    return null;
  }
console.log("trackInfo CoverURL", trackInfo?.cover_image_url);
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigateToStream}>
      <Image
        source={{
          uri: trackInfo?.cover_image_url || "https://via.placeholder.com/50",
        }}
        style={styles.coverImage}
      />
      <View style={styles.trackInfo}>
        <Text style={styles.title}>{trackInfo?.title || "Loading..."}</Text>
        <Text style={styles.genre}>Genre: {trackInfo?.genre || "Unknown"}</Text>
        <Text style={styles.genre}>
          Artist ID: {trackInfo?.artist_id || "Unknown"}
        </Text>
        <Text style={styles.genre}>
          Track ID: {trackInfo?.track_id || "Unknown"}
        </Text>
        {error && (
          <View>
            <Text style={styles.errorText}>Error: {error.message}</Text>
            {error.details && (
              <Text style={styles.errorDetails}>{error.details}</Text>
            )}
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent navigation when pressing play/pause
          togglePlayPause();
        }}
        disabled={!isPlayerReady}
        style={styles.playButton}
      >
        <Ionicons
          name={
            isPlaying ? "pause-circle" : isPlayerReady ? "play-circle" : "sync"
          }
          size={32}
          color="white"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  coverImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  genre: {
    color: "gray",
    fontSize: 12,
    marginTop: 4,
  },
  playButton: {
    padding: 8,
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 4,
  },
  errorDetails: {
    color: "#ff6b6b",
    fontSize: 8,
    marginTop: 2,
  },
});

export default AudioPlayer;
