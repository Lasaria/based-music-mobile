import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { tokenManager } from "../../../utils/tokenManager";
import { SERVER_URL, AUTHSERVER_URL } from '@env';
import { fetchPost } from "../../../utils/fetchCalls";

const editAlbumScreen = () => {
  const router = useRouter();
  const { title, isrc, genre, tags, tracks, artwork, lyrics, lyricsMapping, nameMapping } =
    useLocalSearchParams();

  // Parse and ensure tracks have unique IDs
  const parsedTracks = tracks
    ? JSON.parse(tracks).map((track, index) => ({
        ...track,
        id: track.id || index,
      }))
    : [];
    const parsedLyrics = lyrics ? JSON.parse(lyrics).map((lyrics, index) => (
      {
        ...lyrics,
        id: lyrics.id || index,
      }
    )) : [];

  const [trackList, setTrackList] = useState(parsedTracks);
  const [lyricsList, setLyricsList] = useState(parsedLyrics);
  const [isEditing, setIsEditing] = useState(null);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEditPress = (item) => {
    setIsEditing(item.id);
    setNewName(item.name);
  };

  const deleteTrack = (index) => {
    setTrackList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedTracks = trackList.map((track) =>
      track.id === isEditing ? { ...track, name: newName } : track
    );
    setTrackList(updatedTracks);
    setIsEditing(null);
  };

  const saveAlbum = async () => {

    setIsLoading(true);

    const artistId = await tokenManager.getUserId();
    const token = await tokenManager.getAccessToken();

    console.log("artistID: ", artistId);
    console.log("token: ",token);
    
    // Ensure all required fields are filled before proceeding
    if (!title || !isrc || !genre || trackList.length === 0) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    // Create a FormData object
    const formData = new FormData();
  
    
  
  
    formData.append("artistId", artistId);
    formData.append("title", title);
    formData.append("isrc", isrc);
    formData.append("tags", tags);
    formData.append("releaseDate", new Date().toISOString());
    formData.append("genre", genre);
    formData.append("nameMapping", JSON.stringify(nameMapping));
    formData.append("lyricsMapping", JSON.stringify(lyricsMapping));
  
    // Append the files (track, cover, lyrics)
     trackList.forEach((track) => {
      formData.append("tracks", {
        uri:track.uri,
        name: track.name,
        type: track.type
      })
     });
  
    if (artwork) {
      formData.append("cover", {
        uri: artwork.uri,
        name: artwork.name,
        type: artwork.type,
      });
    }
  
   lyricsList.forEach((lyrics) => {
    formData.append("lyrics", {
      uri:lyrics.uri,
      name: lyrics.name,
      type: lyrics.type
    })
   })
  
    try {
      const response = await fetchPost({
        url: `${SERVER_URL}/albums`,
        body: formData
      });
  
      // if (!response.ok) {
      //   // Try to parse error message from response
      //   const errorData = await response.json().catch(() => null);
      //   throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      // }
  
      const result = response;
  
      Alert.alert("Success", "Uploaded successfully");
      console.log("Track uploaded successfully:", result);
    } catch (error) {
      const errorMessage =
        error.data?.error || error.message || "Failed to upload the album.";
      Alert.alert("Error", errorMessage);
      console.error("Upload err:", error);
    }finally{
      setIsLoading(false);
    }
  };

  const renderTracks = ({ item, drag, isActive }) => (
    <View
      style={[
        styles.renderView,
        { backgroundColor: isActive ? "#333" : "black" },
      ]}
    >
      {/** grip icon to reoder the tracks */}
      <TouchableOpacity onLongPress={drag}>
        <Ionicons
          name="reorder-three-outline"
          size={20}
          color="grey"
          style={{ paddingRight: 10 }}
        />
      </TouchableOpacity>

      <Text style={styles.renderText}>{item.name}</Text>

      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => handleEditPress(item)}>
          <Ionicons
            name="pencil-outline"
            size={20}
            color="white"
            style={{ paddingHorizontal: 10 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => deleteTrack(item.id)}>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "black" }}>
      {isLoading && (
        <View style={styles.loadingConatiner}>
          <ActivityIndicator size="large" color="#6F2CFF"/>
          <Text style={styles.loadingText}>Uploading</Text>
        </View>
      )}

      {!isLoading && (

     
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <View style={styles.viewContaier}>
          <TouchableOpacity
            style={{ position: "absolute", left: 30 }}
            onPress={() => router.back()}
          >
            <Text style={{ color: "white", fontSize: 22 }}>←</Text>
          </TouchableOpacity>

          <Text style={styles.editText}>Edit Songs</Text>
        </View>
        <Text style={styles.renameText}>Rename and reorder songs</Text>
        <DraggableFlatList
          data={trackList}
          renderItem={renderTracks}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={({ data }) => setTrackList(data)}
        />

        {/* Modal for editing track name */}
        <Modal visible={isEditing !== null} animationType="slide" transparent>
          <View style={styles.modelView}>
            <View style={styles.modalInnerView}>
              <Text style={{ fontSize: 18, marginBottom: 10 }}>
                Edit Track Name
              </Text>
              <TextInput
                style={styles.modalTextInput}
                value={newName}
                onChangeText={setNewName}
                autoFocus
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Button
                    title="Cancel"
                    onPress={() => setIsEditing(null)}
                    color="red"
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Button title="Save" onPress={handleSave} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.buttonsView}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelButton}
          >
            <Text style={styles.button}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => saveAlbum()}
            style={styles.nextButton}
          >
            <Text style={styles.button}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
       )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  renderView: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
  renderText: { color: "white", fontSize: 18, flex: 1 },
  viewContaier: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 45,
    flexDirection: "row",
  },
  editText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  renameText: { fontSize: 20, left: 30, color: "white", marginBottom: 15 },
  modelView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalInnerView: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTextInput: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "grey",
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  loadingConatiner:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  loadingText:{
    fontSize:16,
    color:'white',
    marginTop:10,
  },
  buttonsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  cancelButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "red",
    alignItems: "center",
    marginRight: 10,
    padding: 10,
  },
  nextButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "blue",
    alignItems: "center",
    marginRight: 10,
    padding: 10,
  },
  button: { fontSize: 18, color: "white" },
});

export default editAlbumScreen;
