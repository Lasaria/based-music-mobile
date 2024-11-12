import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

const createPlaylist = () => {
  const [playlistName, setPlaylistName] = useState("");

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.playlistText} >Create a Playlist</Text>
        <TextInput
          placeholder="Enter your playlist name"
          value={playlistName}
          onChangeText={setPlaylistName}
          style={styles.playlistInput}
          placeholderTextColor="grey"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: "30%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  playlistInput: {
    borderRadius: 6,
    borderColor: "black",
    height: 40,
    width: "80%",
    alignItems: "center",
    borderWidth: 1,
  },
  playlistText:{fontSize:20, fontWeight:"bold", paddingBottom:6}
});

export default createPlaylist;
