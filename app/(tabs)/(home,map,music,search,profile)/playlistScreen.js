import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { axiosGet } from "../../../utils/axiosCalls";
import {SERVER_URL, AUTHSERVER_URL} from "@env"

const PlaylistScreen = () => {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const {playlist_id} = useLocalSearchParams();

  useEffect(() => {
    console.log("Fetching playlist data for playlist ID:", playlist_id);
    const fetchPlaylistSongs = async () => {
  
     if(!playlist_id) return;

      try {
        const response = await axiosGet({
          url: `${SERVER_URL}/playlists?playlist_id=${playlist_id}`,
          isAuthenticated: true,
        });

        const songIds = response.playlist.songs || [];
        console.log("songs id: ", songIds);
        
        setTracks(response.playlist.songs || []);
      } catch (error) {
        console.error("Error fetching playlist songs:", error);
      }
    };
    fetchPlaylistSongs();
  }, [playlist_id]);

  const filteredTracks = tracks.filter((track) =>
    track.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTrack = ({ item }) => (
    <View style={styles.trackItem}>
      <Text style={styles.trackTitle}>{item.title}</Text>
      <Text style={styles.trackArtist}>{item.artist}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlist</Text>
      </View>

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

      <FlatList
        data={filteredTracks}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        style={styles.tracksList}
        ListEmptyComponent={<Text style={styles.noTracksText}>No tracks found</Text>}
      />
    </View>
  );
};

// Styles...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: "white", fontSize: 24, fontWeight: "bold" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", paddingHorizontal: 10, borderRadius: 10, marginVertical: 20, height: 40 },
  searchInput: { color: "white", marginLeft: 10, flex: 1 },
  trackItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#333" },
  trackTitle: { color: "white", fontSize: 16 },
  trackArtist: { color: "grey", fontSize: 14 },
  noTracksText: { color: "grey", textAlign: "center", marginTop: 20 },
});

export default PlaylistScreen;
