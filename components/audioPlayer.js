// components/AudioPlayer.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AudioContext } from "../contexts/AudioContext";
import { useRouter, usePathname } from "expo-router";

const AudioPlayer = () => {
  const { isPlaying, togglePlayPause, trackInfo, error, isPlayerReady, skipBackward, skipForward } =
    useContext(AudioContext);
  const router = useRouter();
  const pathname = usePathname();
  const handleNavigateToStream = () => {
    router.push("/streamMusic");
  };

  // Do not render the AudioPlayer if the player is not ready
  if (
    (!isPlayerReady && !trackInfo) ||
    pathname === "/streamMusic" ||
    pathname === "/signIn"
  ) {
    return null;
  }
  console.log("trackInfo details", trackInfo);
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
        <Text style={styles.artist_name}>
          {trackInfo?.artist_name || "Unknown Artist"}{" "}
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
      <TouchableOpacity onPress={skipBackward} >
      <Ionicons name="play-back" size={20} color="grey" />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // Prevent navigation when pressing play/pause
          togglePlayPause();
        }}
        disabled={!isPlayerReady}
        style={styles.playButton}
      >
        <Ionicons
          name={isPlaying ? "pause" : isPlayerReady ? "play" : "sync"}
          size={22}
          color="white"
        />
      </TouchableOpacity>
      <TouchableOpacity  onPress={skipForward} >
      <Ionicons name="play-forward" size={20} color="grey" />
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
    backgroundColor: "black",
    borderRadius: 10,
    borderColor: "grey",
    borderWidth: 1,
    padding: 5,
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
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#444",
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  artist_name: {
    color: "grey",
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
