import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";
import { axiosGet } from "../../../utils/axiosCalls";
import { tokenManager } from "../../../utils/tokenManager";
import { SERVER_URL } from "@env";
import { AudioContext } from "../../../contexts/AudioContext";

const PlaylistScreen = () => {
  const [tracks, setTracks] = useState([]);
  const [playlist, setPlaylist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const { playlist_id } = useLocalSearchParams();

  // Access audio context for play/pause functionality
  const { trackInfo, isPlaying, togglePlayPause, isPlayerReady, updateCurrentTrack } = useContext(AudioContext);

  const updatePlaylist = async (updatedTracks) => {
    const token = await tokenManager.getAccessToken();
    console.log("Updating playlist with song IDs:", updatedTracks);

    const formData = new FormData();
    formData.append(
      "songs",
      JSON.stringify(updatedTracks.map((track) => track.id))
    );

    try {
      const response = await fetch(`${SERVER_URL}/playlists/${playlist_id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("success", response);
    } catch (error) {
      console.error("Error updating playlist:", error);
    }
  };

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!playlist_id) return;
      try {
        const response = await axiosGet({
          url: `${SERVER_URL}/playlists?playlist_id=${playlist_id}`,
        });
        setPlaylist(response.playlist);
        setTitle(response.playlist.title);

        const songIds = response.playlist.songs || [];
        const initialTracks = songIds.map((id) => ({
          id,
          loading: true,
          details: null,
        }));

        setTracks(initialTracks);

        for (let track of initialTracks) {
          fetchTrackDetails(track.id);
        }
      } catch (error) {
        console.error("Error fetching playlist data:", error);
      }
    };

    const fetchTrackDetails = async (trackId) => {
      try {
        const trackResponse = await axiosGet({
          url: `${SERVER_URL}/tracks?track_id=${trackId}`,
        });

        setTracks((prevTracks) =>
          prevTracks.map((track) =>
            track.id === trackId
              ? { ...track, details: trackResponse, loading: false }
              : track
          )
        );
      } catch (error) {
        console.error(`Error fetching details for track ID ${trackId}:`, error);
      }
    };

    fetchPlaylistData();
  }, [playlist_id]);

  const handleDeleteTrack = (trackId) => {
    Alert.alert("Delete Track", "Are you sure you want to delete this track?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          const updatedTracks = tracks.filter((track) => track.id !== trackId);
          setTracks(updatedTracks);
          updatePlaylist(updatedTracks);
        },
      },
    ]);
  };

  const saveTitle = async () => {
    try {
      const token = await tokenManager.getAccessToken();
      const formData = new FormData();
      formData.append("title", title);
      try {
        const response = await fetch(`${SERVER_URL}/playlists/${playlist_id}`, {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        console.log("success", response);
      } catch (error) {
        console.error("Error updating playlist:", error);
      }
      setIsEditing(false); 
    } catch (error) {
      console.error("Error saving playlist title:", error);
    }
  };

  // Handle play/pause when a track is pressed
  const handlePlayPause = async (track) => {
    const trackId = track.id;
    if (trackInfo?.track_id === trackId && isPlayerReady) {
      // Toggle play/pause if the track is already loaded
      await togglePlayPause();
    } else {
      // Load and play new track
      await updateCurrentTrack(trackId);
      if (isPlayerReady) {
        await togglePlayPause();
      }
    }
  };

  const renderTrack = ({ item, drag }) => {
    if (item.loading) {
      return (
        <View style={styles.trackItem}>
          <ActivityIndicator size="small" color="purple" />
        </View>
      );
    }

    const isCurrentTrack = trackInfo?.track_id === item.id;
    const showPlayingState = isCurrentTrack && isPlaying;

    return (
      <TouchableOpacity style={styles.trackItem} onLongPress={drag}>
        <Image
          source={{ uri: item.details.track.cover_image_url }}
          style={styles.trackCover}
        />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle}>{item.details.track.title}</Text>
        </View>
        <TouchableOpacity onPress={() => handlePlayPause(item)} style={styles.playButton}>
          <Ionicons
            name={showPlayingState ? "pause" : "play"}
            size={24}
            color={isCurrentTrack ? "purple" : "white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() => handleDeleteTrack(item.id)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const handleDragEnd = ({ data }) => {
    setTracks(data);
    updatePlaylist(data);
  };

  const filteredTracks = tracks.filter((track) =>
    track.details?.track.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlist</Text>
      </View>

      {playlist && (
        <View style={styles.playlistHeader}>
         {playlist.coverImage &&  <Image
            source={{ uri: playlist.coverImage }}
            style={styles.playlistCover}
          />
         }
          <View style={styles.titleContainer}>
            {isEditing ? (
              <TextInput
                style={styles.editTitleInput}
                value={title}
                onChangeText={setTitle}
                onSubmitEditing={saveTitle} // Save when submitting the input
                autoFocus
              />
            ) : (
              <Text style={styles.playlistTitle}>{title}</Text>
            )}
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? "checkmark" : "pencil"}
                size={20}
                color="white"
                style={styles.editIcon}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="grey" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="grey"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <DraggableFlatList
        data={filteredTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        ListEmptyComponent={
          <Text style={styles.noTracksText}>No tracks found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: "15%", paddingLeft:10 },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
  },
  playlistHeader: { alignItems: "center", marginVertical: 16 },
  playlistCover: { width: 150, height: 150, borderRadius: 8 },
  playlistTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  titleContainer: { flexDirection: "row", alignItems: "center" , paddingTop:20},
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    height: 40,
  },
  editIcon: { marginLeft: 8 },
  editTitleInput: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  searchInput: { color: "white", marginLeft: 10, flex: 1 },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  trackCover: { width: 50, height: 50, borderRadius: 4 },
  trackInfo: { flex: 1, marginLeft: 10 },
  trackTitle: { color: "white", fontSize: 16 },
  playButton: { padding: 10 },
  menuIcon: { padding: 10 },
  noTracksText: { color: "grey", textAlign: "center", marginTop: 20 },
});

export default PlaylistScreen;
