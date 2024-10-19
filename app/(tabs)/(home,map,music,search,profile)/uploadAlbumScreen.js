import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";

const uploadTrackScreen = () => {
  const [title, setTitile] = useState("");
  const [isrc, setIsrc] = useState();
  const [genre, setGenre] = useState();
  const [tracks, setTracks] = useState(null);

  return (
    <View style={styles.outerView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => router.back()}
        >
          <Text style={styles.arrowText}>←</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: "black" }}>
          <Text style={styles.trackText}>Album Details</Text>
          <Text style={styles.innerText}>Tell us more about your album</Text>
        </View>

        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Album Title</Text>
          </View>
          <TextInput
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              textAlign: "center",
              textAlign: "left",
              color: "white",
            }}
            value={title}
            onChangeText={setTitile}
            placeholder="Enter your album's  title"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Genre</Text>
          </View>
          <TextInput
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              textAlign: "center",
              textAlign: "left",
              color: "white",
            }}
            value={genre}
            onChangeText={setGenre}
            placeholder="Enter your album's genre"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>ISRC Code</Text>
          </View>
          <TextInput
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
              textAlign: "center",
              textAlign: "left",
              color: "white",
            }}
            value={isrc}
            onChangeText={setIsrc}
            placeholder="Enter your album's ISRC Code"
            placeholderTextColor="white"
          />
        </View>

        <View style={{ alignItems: "center" }}>
          <Text style={styles.uploadText}>Upload song</Text>
          {/* File picker for audio */}
          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose an audio file to upload
            </Text>
            <Text style={styles.fileFormatText}>WAV, MP3 or MPEG format</Text>

            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>

            {/* Display selected file info */}
            {/* {selectedFile && (
    <Text style={styles.selectedFileText}>
      Selected file: {selectedFile.name}
    </Text>
  )} */}
          </View>
        </View>
        <Text style={styles.selectedFileText}>Selected file: {tracks}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: "black",
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "black",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 100,
  },
  trackText: {
    color: "white",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  labelContainer: {
    position: "absolute",
    top: -10,
    left: 20,
    paddingHorizontal: 5,
    backgroundColor: "black",
    zIndex: 1,
  },
  innerText: {
    color: "grey",
    textAlign: "center",
    fontSize: 16,
  },
  backArrow: {
    paddingTop: 55,
    paddingLeft: 20,
    position: "absolute",
    left: 0,
    top: 0,
  },
  arrowText: {
    color: "white",
    fontSize: 20,
  },
  intputContainer: {
    width: 320,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "white",
    paddingTop: 10,
    padding: 10,
    marginTop: 30,
    position: "relative",
  },
  labelText: {
    color: "white",
    fontSize: 14,
  },
  filePickerContainer: {
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "white",
    padding: 20,
    width: 320,
  },
  filePickerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fileFormatText: {
    color: "grey",
    fontSize: 14,
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: "#6F2CFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  browseButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  selectedFileText: {
    color: "white",
    marginTop: 10,
    textAlign: "center",
  },
  uploadText:{
    color:'white', 
    fontSize:20, 
    fontWeight:'bold',
    paddingTop: 20,
     textAlign:'left',  
     alignSelf:'flex-start'
    }
});

export default uploadTrackScreen;
