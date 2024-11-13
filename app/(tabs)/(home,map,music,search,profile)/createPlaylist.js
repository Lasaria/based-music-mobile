import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import { axiosGet, axiosPost } from "../../../utils/axiosCalls";
import SearchResultItem from "../../../components/SearchResultItem";
import { StatusBar } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { tokenManager } from "../../../utils/tokenManager";

const MAIN_SERVER_URL = "http://localhost:3000";

const createPlaylist = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Effect: Fetch User ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        const params = router.params || {};
        if (params.userId) {
          setUserId(params.userId);
          return;
        }
        const userid = await tokenManager.getUserId();
        setUserId(userid);
      } catch (error) {
        console.error("[StreamMusic] Error getting user ID:", error);
      }
    };
    getUserId();
  }, [router.params]);

  // Debounced search function to reduce server calls
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          setSearchResults([]);
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const response = await axiosGet({
            url: `${MAIN_SERVER_URL}/search`,
            params: { query, type: "songs" },
          });
          setSearchResults(response.items || []);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 250),
    []
  );

  const handleSearchChange = useCallback(
    (text) => {
      setSearchQuery(text);
      debouncedSearch(text);
    },
    [debouncedSearch]
  );

  const handleSongSelect = (song) => {
    console.log('song selected: ' , song);
    
    setSelectedSongs((prevSelected) => {
      // Toggle selection
      if (prevSelected.some((selected) => selected.id === song.id)) {
        return prevSelected.filter((selected) => selected.id !== song.id);
      } else {
        return [...prevSelected, song];
      }
    });
  };

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim() || !playlistDescription.trim() || selectedSongs.length === 0) {
      Alert.alert("Error", "Please fill in all fields and select at least one song.");
      return;
    }

    const songIds = selectedSongs.map((song) => song.id);
    const formData = new FormData();
    const token = await tokenManager.getAccessToken();
    console.log("songs id:", songIds);
    

    formData.append("userId", userId);
    formData.append("title", playlistName);
    formData.append("description", playlistDescription);
    formData.append("songs", JSON.stringify(songIds));

    console.log("formdata is: ",formData);
    
    
    try {
      const response = await fetch(`${MAIN_SERVER_URL}/tracks`, {
        method: "POST",
        data: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, 
        },
      });

      
      // await axiosPost({
      //   url: `${MAIN_SERVER_URL}/playlists`,
      //   data: {
      //     userId: userId,
      //     title: playlistName,
      //     description: playlistDescription,
      //     songs: JSON.stringify(songIds),
      //   },
      // });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      Alert.alert("successfully created playlist");
      console.log("playlist created sucessfully", result);
      
      setPlaylistName("");
      setPlaylistDescription("");
      setSelectedSongs([]);
    } catch (error) {
      console.error("Failed to create playlist:", error);
      Alert.alert("Error", "Failed to create playlist. Please try again.");
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.screen}>
        <View style={styles.container}>
          <Text style={styles.playlistText}>Create a Playlist</Text>
          <TextInput
            placeholder="Enter your playlist name"
            value={playlistName}
            onChangeText={setPlaylistName}
            style={styles.playlistInput}
            placeholderTextColor="white"
          />
          <TextInput
            placeholder="Write about your playlist description"
            value={playlistDescription}
            onChangeText={setPlaylistDescription}
            multiline
            style={styles.playlistDescriptionInput}
            placeholderTextColor="white"
          />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search songs to add to playlist"
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.searchInput}
            placeholderTextColor="grey"
          />
          {loading && <ActivityIndicator style={styles.loader} color="white" />}
        </View>

        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <SearchResultItem 
              item={item} 
              onPress={() => handleSongSelect(item)} 
             isSelected={selectedSongs.some((song) => song.id === item.id)}
             disablePlay ={ true}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            !loading && searchQuery ? (
              <Text style={styles.noResultsText}>No songs found</Text>
            ) : null
          }
          contentContainerStyle={styles.listContainer}
        />

        <TouchableOpacity onPress={handleCreatePlaylist} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Create Playlist</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  container: {
    marginTop: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  playlistInput: {
    borderRadius: 6,
    borderColor: "grey",
    height: 40,
    width: "80%",
    borderWidth: 1,
    marginBottom: 10,
    color: "white",
  },
  playlistText: { fontSize: 20, fontWeight: "bold", paddingBottom: 6, color: "white" },
  playlistDescriptionInput: {
    borderRadius: 6,
    borderColor: "grey",
    height: 80,
    width: "80%",
    borderWidth: 1,
    color: "white",
  },
  searchContainer: {
    padding: 10,
    backgroundColor: "#333",
    borderRadius: 6,
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
  },
  loader: {
    marginLeft: 10,
  },
  listContainer: {
    paddingBottom: 100,
  },
  noResultsText: {
    textAlign: "center",
    color: "grey",
    marginTop: 20,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#333",
    borderRadius: 6,
    alignItems: "center",
    margin: 16,
  },
  buttonText: {
    color: 'skyblue',
    fontSize: 14,
  },
});

export default createPlaylist;
