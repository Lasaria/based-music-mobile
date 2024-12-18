import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import { axiosGet } from "../../../utils/axiosCalls";
import { tokenManager } from "../../../utils/tokenManager";
import { AudioContext } from "../../../contexts/AudioContext";
import Toast from "react-native-toast-message";
import SongList from "../../../components/SongComponent";
import LibraryItem from "../../../components/RenderLibraryItem";
import {SERVER_URL, AUTHSERVER_URL} from "@env"
import PopularRecommendations from "../../../components/PopularRecommendations";


function MusicScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("My Library");
  const [contentType, setContentType] = useState("playlist");
  const [libraryData, setLibraryData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [isPlaylist, setIsPlaylist] = useState(true);
  const [isSongs, setIsSongs] = useState(false);
  const [isAlbums, setIsAlbums] = useState(false);
  const [isArtists, setIsArtists] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    updateCurrentTrack,
    isPlaying,
    togglePlayPause,
    isPlayerReady,
    trackInfo,
    checkSoundStatus,
    soundRef,
    currentAudioState,
  } = useContext(AudioContext);
  // Get user ID on component mount
  useEffect(() => {
    const getUserId = async () => {
      try {
        const id = await tokenManager.getUserId();
        setUserId(id);
      } catch (err) {
        console.error("Error getting user ID:", err);
        setError("Failed to get user ID");
      }
    };
    getUserId();
  }, []);

  // Fetch library data
  const fetchLibraryData = async (resetData = false) => {
    if (!userId || loading || (!hasMore && !resetData)) return;

    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        limit: "50",
      });

      if (contentType !== "all") {
        queryParams.append("type", contentType);
      }

      if (!resetData && lastEvaluatedKey) {
        queryParams.append("lastEvaluatedKey", lastEvaluatedKey);
      }

      // Add this block for search
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      const response = await axiosGet({
        url: `${SERVER_URL}/library/${userId}?${queryParams.toString()}`,
        isAuthenticated: true,
      });
      console.log("Library response:", JSON.stringify(response.items, null, 2));
      // Modified to merge data for pagination
      setLibraryData(() =>
        resetData ? response.items : [...libraryData, ...response.items]
      );
      setLastEvaluatedKey(response.lastEvaluatedKey);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error("Error fetching library:", err);
      setError(err.data?.error || "Failed to load library");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAlbums = async (resetData = false) => {
    if (loading || (!hasMore && !resetData)) return;
  
    try {
      setLoading(true);
      setError(null);
  
      const queryParams = new URLSearchParams({
        limit: "10",
      });
  
      if (!resetData && lastEvaluatedKey) {
        queryParams.append("lastEvaluatedKey", lastEvaluatedKey);
      }
  
      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }
  
      const response = await axiosGet({
        url: `${SERVER_URL}/albums?limit=50`,
      });
      
      console.log("albums data: ", response.albums);
      
      // console.log("Albums response:", JSON.stringify(response.items, null, 2));
  
      // Merge data for pagination or reset
      setAlbumsData(() =>
        resetData ? response.albums : [...albumsData, ...response.albums]
      );

      setLastEvaluatedKey(response.lastEvaluatedKey);
      setHasMore(response.hasMore);
    } catch (err) {
      console.error("Error fetching albums:", err);
      setError(err.data?.error || "Failed to load albums");
    } finally {
      setLoading(false);
    }
  };
  

  const handlePlay = async (item) => {
    console.log("Playing item:", item);
    // if (!isPlayerReady) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Player not ready",
    //     text2: "Please wait a moment and try again",
    //   });
    //   return;
    // }

    if (item.content_type === "song") {
      updateCurrentTrack(item);
    } else if (item.content_type === "playlist") {
      // route to playlist screen
      console.log("route to playlist screen");
      router.push({
        pathname: '/playlistScreen',
        params: {
          playlist_id: item.content_id,
        }
       });

    } else {
      Toast.show({
        type: "error",
        text1: "Invalid item",
        text2: "Please select a song or playlist to play",
      });
      return;
    }
  }
  // Initial fetch when userId is available
  useEffect(() => {
    if (userId) {
      fetchLibraryData(true);
      fetchAllAlbums(true);
    }
  }, [userId, contentType]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (userId) {
        fetchLibraryData(true);
        fetchAllAlbums(true);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const renderLibraryItem = ({ item }) => (
    <LibraryItem
      item={item}
      isPlaying={isPlaying}
      trackInfo={trackInfo}
      onPlay={handlePlay}
      SERVER_URL={SERVER_URL}
    />
  );



  const displayPlaylist = () => {
    setIsPlaylist(true);
    setIsSongs(false);
    setIsAlbums(false);
    setIsArtists(false);
    setContentType("playlist");
    setLastEvaluatedKey(null); // Reset pagination
    setHasMore(true);
  };

  const displaySongs = () => {
    setIsPlaylist(false);
    setIsSongs(true);
    setIsAlbums(false);
    setIsArtists(false);
    setContentType("song");
    setLastEvaluatedKey(null);
    setHasMore(true);
  };

  const displayAlbums = () => {
    setIsPlaylist(false);
    setIsSongs(false);
    setIsAlbums(true);
    setIsArtists(false);
    setContentType("album");
    setLastEvaluatedKey(null);
    setHasMore(true);
    
    console.log("album screen");
    
  };

  const displayArtists = () => {
    setIsPlaylist(false);
    setIsSongs(false);
    setIsAlbums(false);
    setIsArtists(true);
    setContentType("artist");
    setLastEvaluatedKey(null);
    setHasMore(true);
  };

  const renderForYou = () => (
    <ScrollView style={styles.forYouContainer}>
      <PopularRecommendations 
        onTrackPress={(track) => {
          // Handle track selection - we can add more functionality here (e.g. play track)
          updateCurrentTrack(track);
        }} 
      />
      {/* we can add more recommendation sections here in the future */}
    </ScrollView>
  );

  const renderMyLibrary = () => (
    <View style={styles.libraryContainer}>
      <View style={styles.libraryHeader}>
        <Text style={styles.libraryTitle}>My Library</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={displayPlaylist}
          style={[
            styles.filterButton,
            { borderColor: isPlaylist ? "purple" : "white" },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: isPlaylist ? "purple" : "white" },
            ]}
          >
            Playlists
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={displaySongs}
          style={[
            styles.filterButton,
            { borderColor: isSongs ? "purple" : "white" },
          ]}
        >
          <Text
            style={[styles.filterText, { color: isSongs ? "purple" : "white" }]}
          >
            Songs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={displayAlbums}
          style={[
            styles.filterButton,
            { borderColor: isAlbums ? "purple" : "white" },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: isAlbums ? "purple" : "white" },
            ]}
          >
            Albums
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={displayArtists}
          style={[
            styles.filterButton,
            { borderColor: isArtists ? "purple" : "white" },
          ]}
        >
          <Text
            style={[
              styles.filterText,
              { color: isArtists ? "purple" : "white" },
            ]}
          >
            Artists
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : contentType === "song" ? (
        <SongList
          songs={libraryData}
          loading={loading}
          onEndReached={() => hasMore && fetchLibraryData()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No songs found matching your search"
                  : "No songs in your library"}
              </Text>
            </View>
          }
          containerClassName="pb-32"
        />
      ) : contentType === "playlist" ? (
        <FlatList
          data={libraryData}
          renderItem={renderLibraryItem}
          keyExtractor={(item) => `${item.content_type}-${item.content_id}`}
          onEndReached={() => hasMore && fetchLibraryData()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && (
              <ActivityIndicator color="purple" style={styles.loader} />
            )
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? `No ${contentType}s found matching your search`
                  : `No ${contentType}s in your library`}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      ):contentType === "album" ? (
        <FlatList
          data={albumsData}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
               {
                router.push({
                  pathname:'albumComponent',
                  params:{album_id: item.album_id},
                });
               }
              }
            >
              <View style={styles.albumItem}>
                <Image
                  source={{
                    uri: item.cover_image_url || "https://via.placeholder.com/100",
                  }}
                  style={styles.albumImage}
                />
                <View style={styles.albumInfo}>
                  <Text style={styles.albumTitle} numberOfLines={1}>
                    {item.title || "Untitled Album"}
                  </Text>
                  <Text style={styles.albumSubtitle}>
                    {item.genre|| "Unknown Artist"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.album_id}
          onEndReached={() => hasMore && fetchAllAlbums()}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && <ActivityIndicator color="purple" style={styles.loader} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No albums found matching your search"
                  : "No albums available"}
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContainer}
        />
      ) : null}
      
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "My Library" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("My Library")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "My Library" && styles.activeTabText,
              ]}
            >
              MY LIBRARY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "For You" && styles.activeTab]}
            onPress={() => setSelectedTab("For You")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "For You" && styles.activeTabText,
              ]}
            >
              FOR YOU
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === "My Library" ? renderMyLibrary() : renderForYou()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#000",
    zIndex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "purple",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
  libraryContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  libraryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  libraryTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
  },
  searchInput: {
    color: "white",
    flex: 1,
    marginLeft: 8,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  filterButton: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    minWidth: 60,
    alignItems: "center",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
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
  artistImage: {
    borderRadius: 25, // Make artist images circular
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
  listContainer: {
    paddingBottom: 100,
  },
  loader: {
    marginVertical: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  forYouContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  albumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  albumImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  albumInfo: {
    flex: 1,
  },
  albumTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  albumSubtitle: {
    color: "gray",
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 100,
  },
  loader: {
    marginVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "gray",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MusicScreen;