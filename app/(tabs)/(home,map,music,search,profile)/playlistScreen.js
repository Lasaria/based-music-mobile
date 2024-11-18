import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const PlaylistScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  const albumInfo = {
    title: "Boyshit",
    artist: "Madison Beer",
    album: "Album",
    year: "2021",
    songsCount: 18,
    duration: "2h 20min",
  };

  const tracks = [
    { id: "1", title: "Eat your young", artist: "Hozier", duration: "3:24" },
    { id: "2", title: "Little things", artist: "One Direction", duration: "3:24" },
    { id: "3", title: "Only you", artist: "Zayn", duration: "3:24" },
    { id: "4", title: "Trash", artist: "Little Mix", duration: "3:24" },
    { id: "5", title: "Best friend", artist: "Luna bay", duration: "3:24" },
    { id: "6", title: "Beach", artist: "Lana", duration: "3:24" },
  ];

  // Filter tracks based on search query
  const filteredTracks = tracks.filter((track) =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleModal= () => {
    setIsModalVisible(!isModalVisible);
  }

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const closeFliter = () => {
    setFilterVisible(false);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  }


  const renderTrack = ({ item }) => (
    <View style={styles.trackItem}>
      <View>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.trackDuration}>{item.duration}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlist</Text>
        <TouchableOpacity onPress={toggleModal}>
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>
     
      </View>

      {/* Search Bar */}
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

      {/* Album Info */}
      <View style={styles.albumInfo}>
        <Image
          source={require("../../../assets/images/profile6.jpg")}
          style={styles.albumArt}
        />
        <View style={styles.albumDetails}>
          <Text style={styles.albumTitle}>{albumInfo.title}</Text>
          <Text style={styles.albumArtist}>{albumInfo.artist}</Text>
          <Text style={styles.albumMeta}>
            {albumInfo.album} / {albumInfo.year}
          </Text>
          <Text style={styles.albumMeta}>
            {albumInfo.songsCount} Songs - {albumInfo.duration}
          </Text>
        </View>
        <View style={styles.albumIcons}>
          <Ionicons name="heart-outline" size={24} color="white" />
          <Ionicons name="add" size={24} color="white" style={{ marginTop: 15 }} />
        </View>
      </View>

      {/* Tracks List */}
          {/* Tracks Header with Filter Icon */}
          <View style={styles.tracksHeaderContainer}>
        <Text style={styles.tracksHeader}>TRACKS</Text>
        <TouchableOpacity onPress={toggleFilter}>
          <Ionicons name="filter" size={20} color="grey" />
        </TouchableOpacity>
      </View>

      {filteredTracks.length > 0 ? (
        <FlatList
          data={filteredTracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id}
          style={styles.tracksList}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <Text style={styles.noTracksText}>No tracks found</Text>
      )}

       {/** bottom sheet modal */}

       <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <TouchableOpacity
                  style={styles.modalItem}
                >
                  <Ionicons name="list" size={24} color="white" />
                  <Text style={styles.modalText}>Add the playlist to queue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem} onPress={() => router.push('./queueList')} >
                  <Ionicons name="add" size={24} color="white" />
                  <Text style={styles.modalText}>View queue list</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="share-social" size={24} color="white" />
                  <Text style={styles.modalText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="heart" size={24} color="white" />
                  <Text style={styles.modalText}>Like</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalItem}>
                  <Ionicons name="information-circle" size={24} color="white" />
                  <Text style={styles.modalText}>About</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterVisible}
        onRequestClose={closeFliter}
      >
        <TouchableWithoutFeedback onPress={closeFliter}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter</Text>

                {/* Genre Filter */}
                <Text style={styles.filterCategory}>GENRE</Text>
                <View style={styles.filterOptionsContainer}>
                  {["Pop", "Rock", "RnB", "Blues", "Jazz", "Hiphop", "Funk", "Metal", "Reggae", "Soul", "Classical", "Indie/Alternative"].map((genre) => (
                    <TouchableOpacity key={genre} style={styles.filterOption}>
                      <Text style={styles.filterOptionText}>{genre}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Release Date Filter */}
                <Text style={styles.filterCategory}>RELEASE DATE</Text>
                <View style={styles.filterOptionsContainer}>
                  <TouchableOpacity style={styles.filterOption}>
                    <Text style={styles.filterOptionText}>New - Old</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterOption}>
                    <Text style={styles.filterOptionText}>Old - New</Text>
                  </TouchableOpacity>
                </View>

                {/* Alphabetical Order Filter */}
                <Text style={styles.filterCategory}>ALPHABETICAL ORDER</Text>
                <View style={styles.filterOptionsContainer}>
                  <TouchableOpacity style={styles.filterOption}>
                    <Text style={styles.filterOptionText}>A - Z</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.filterOption}>
                    <Text style={styles.filterOptionText}>Z - A</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  tracksHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 20,
    height: 40,
  },
  searchInput: {
    color: "white",
    marginLeft: 10,
    flex: 1,
  },
  albumInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  albumArt: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  albumDetails: {
    flex: 1,
    marginLeft: 15,
  },
  albumTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  albumArtist: {
    color: "grey",
    fontSize: 16,
    marginTop: 2,
  },
  albumMeta: {
    color: "grey",
    fontSize: 14,
    marginTop: 2,
  },
  albumIcons: {
    alignItems: "center",
  },
  tracksHeader: {
    color: "grey",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tracksList: {
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  trackTitle: {
    color: "white",
    fontSize: 16,
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterCategory: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  filterOption: {
    backgroundColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterOptionText: {
    color: "white",
    fontSize: 14,
  },
  trackArtist: {
    color: "grey",
    fontSize: 14,
  },
  trackDuration: {
    color: "grey",
    fontSize: 14,
  },
  noTracksText: {
    color: "grey",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1c1c1c",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#1c1c1c",
    padding: 20,
    borderTopEndRadius: 20,
    borderTopRightRadius: 20,
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  modalText: {
    color: "white",
    fontSize: 16,
    marginLeft: 18,
  },
});

export default PlaylistScreen;
