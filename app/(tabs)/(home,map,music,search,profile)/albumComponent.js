import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { axiosGet } from "../../../utils/axiosCalls";
import { AudioContext } from "../../../contexts/AudioContext";
import { SERVER_URL } from "@env";

const albumComponent = () => {
  const [tracks, setTracks] = useState([]);
  const [album, setAlbum] = useState(null);
  const [shuffledTracks, setShuffledTracks] = useState([]);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const router = useRouter();
  const { album_id } = useLocalSearchParams();

  const { trackInfo, isPlaying, togglePlayPause, isPlayerReady, updateCurrentTrack } =
    useContext(AudioContext);

  useEffect(() => {
    const fetchAlbumData = async () => {
      if (!album_id) return;
      try {
        const response = await axiosGet({
          url: `${SERVER_URL}/albums?album_id=${album_id}`,
        });

        console.log("Album data:", response.album);
        console.log("Tracks:", response.tracks);
        setAlbum(response.album);
        setTracks(response.tracks);
        setShuffledTracks(response.tracks); // Initialize shuffled tracks
      } catch (error) {
        console.error("Error fetching album data:", error);
      }
    };

    fetchAlbumData();
  }, [album_id]);

  const handlePlayPause = async (track) => {
    const trackId = track.id;
    if (trackInfo?.track_id === trackId && isPlayerReady) {
      await togglePlayPause();
    } else {
      await updateCurrentTrack(trackId);
      if (isPlayerReady) {
        await togglePlayPause();
      }
    }
  };

  // Function to play all tracks sequentially
  const playAll = async () => {
    if (tracks.length === 0) return;
    
    const firstTrack = isShuffleMode ? shuffledTracks[0] : tracks[0];
    await updateCurrentTrack(firstTrack.id);
    if (isPlayerReady && !isPlaying) {
      await togglePlayPause();
    }
  };

  // Function to shuffle tracks
  const shuffleTracks = () => {
    const shuffled = [...tracks];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledTracks(shuffled);
    setIsShuffleMode(true);
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    if (!isShuffleMode) {
      shuffleTracks();
    } else {
      setIsShuffleMode(false);
    }
  };

  const renderTrack = ({ item }) => {
    const isCurrentTrack = trackInfo?.track_id === item.id;
    const showPlayingState = isCurrentTrack && isPlaying;

    return (
      <View style={styles.trackItem}>
        <Text style={styles.trackNumber}>{item.track_number}</Text>
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <Text style={styles.trackDuration}>{formatSecondsToMinutes(item.duration)}</Text>
        </View>
        <TouchableOpacity onPress={() => handlePlayPause(item)} style={styles.playButton}>
          <Ionicons
            name={showPlayingState ? "pause" : "play"}
            size={24}
            color={isCurrentTrack ? "purple" : "white"}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (!album) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Album</Text>
      </View>

      <View style={styles.albumHeader}>
        <Image source={{ uri: album.cover_image_url }} style={styles.albumCover} />
        <Text style={styles.albumTitle}>{album.title}</Text>
        <Text style={styles.albumArtist}>{album.artist_id}</Text>
        <Text style={styles.albumYear}>{album.release_date}</Text>
        
        <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={playAll} style={styles.controlButton}>
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={40}
              color="purple"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleShuffle} style={styles.controlButton}>
            <Ionicons
              name="shuffle"
              size={30}
              color={isShuffleMode ? "purple" : "grey"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={isShuffleMode ? shuffledTracks : tracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.track_id}
        ListEmptyComponent={<Text style={styles.noTracksText}>No tracks found</Text>}
      />
    </View>
  );
};

const formatSecondsToMinutes = (seconds) => {
  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${formattedSeconds}`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: "15%", paddingLeft: 10 },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
  },
  albumHeader: { alignItems: "center", marginVertical: 16 },
  albumCover: { width: 150, height: 150, borderRadius: 8 },
  albumTitle: { color: "white", fontSize: 22, fontWeight: "bold", marginTop: 10 },
  albumArtist: { color: "grey", fontSize: 16, marginTop: 5 },
  albumYear: { color: "grey", fontSize: 14, marginTop: 5 },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    gap: 20,
  },
  controlButton: {
    padding: 10,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  trackNumber: { color: "white", fontSize: 16, marginRight: 10 },
  trackInfo: { flex: 1 },
  trackTitle: { color: "white", fontSize: 16 },
  trackDuration: { color: "grey", fontSize: 12 },
  playButton: { padding: 10 },
  noTracksText: { color: "grey", textAlign: "center", marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default albumComponent;