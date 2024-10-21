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
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";

const uploadTrackScreen = () => {
  const [title, setTitile] = useState("");
  const [isrc, setIsrc] = useState();
  const [genre, setGenre] = useState();
  const [track, setTrack] = useState();
  const [size, setSize] = useState();
  const [name, setName] = useState("");
  const [lyrics, setLyrics] = useState();
  const [lyricsName, setLyricsName] = useState();
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lyricsError, setLyricsError] = useState();
  const [lyricsUploadStatus, setLyricsUploadStatus] = useState("idle");
  const [lyricsUploadProgress, setLyricsUploadProgress] = useState();
  const [lyricsSize, setLyricsSize] = useState();
  

  const pickDocument = async () => {

    setError(null);
    setTrack(null);
    setSize(null);
    setUploadProgress(0);
    setUploadStatus("idle");
    setName("");
    let result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: false,
      multiple: false,
    });

    console.log("songs is: ", result);

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      let trackSize = file.size / (1024 * 1024);
      const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav"];

      //validate track type and size

      if (!allowedTypes.includes(file.mimeType)) {
        setName(file.name);
        setUploadStatus("Error");
        setError("Invalid file type. Only mp3, mpeg, or wav are allowed.");
      } else if (trackSize > 10) {
        setName(file.name);
        setUploadStatus("Error");
        setError("File is too large. Must be under 10MB.");
      } else {
        setName(file.name);
        trackSize = trackSize.toFixed(2);
        setSize(trackSize);
        setTrack(file.uri);
        setUploadStatus("uploading");
        startUpload(file.uri);
      }
    }
  };


  {/** selects the lyrics from device */}
  const pickLyrics = async () => {

    let result = await DocumentPicker.getDocumentAsync({
      type: "text/plain",
      copyToCacheDirectory: false,
      multiple: false,
    })
    console.log(result);

    if(result.assets && result.assets.length > 0){

      let file = result.assets[0];
      let fileSize = file.size / (1024 * 1024);
      let fileType = file.mimeType
      const allowedTypes = ["text/plain"];

      if(!allowedTypes.includes(fileType)){
        setLyricsName(file.name);
        setLyricsUploadStatus("Error");
        setLyricsError("Invalid file type. Only text/plain is allowed.")
      }else if(fileSize > 10){
        setLyricsName(file.name);
        setLyricsUploadStatus("Error");
        setLyricsError("File is too large. Must be under 10MB.")
      }else{
        setLyricsName(file.name);
        fileSize = fileSize.toFixed(2);
        setLyricsSize(fileSize);
        setLyrics(file.uri);
        setLyricsUploadStatus("Uploading")
        startLyricsUpload(file.uri);
      }
    }
    

  }

  const startUpload = (track) => {
    console.log(track);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadStatus("uploaded");
      }
    }, 500);
  };

  const startLyricsUpload = (track) => {
    console.log(track);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setLyricsUploadStatus("uploaded");
      }
    }, 500);
  };

   const deleteTrack = () => {

    setTrack(null);
    setSize(null);
    setName("");
    setUploadStatus("idle");
    setUploadProgress(null);
    setError(null);
   }
  const cancelUpload = () => {
    setUploadStatus("idle");
    setTrack(null);
    setUploadProgress(0);
  };

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
          <Text style={styles.trackText}>Track Details</Text>
          <Text style={styles.innerText}>
            Tell us more about your song or beat
          </Text>
        </View>

        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Track Title</Text>
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
            placeholder="Enter your track's title"
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
            placeholder="Enter your track's genre"
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
            placeholder="Enter your track's ISRC Code"
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

            <TouchableOpacity
              style={styles.browseButton}
              onPress={pickDocument}
            >
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/** Display progress bar and upload track info */}

        {(track || error) && (
          <View>
            <View style={styles.uploadContainer}>
              {error ? (
                <View style={{flexDirection:'row'}}>

                <Text style={styles.uploadInfo1}>{name}</Text>
                <Text style={styles.uploadInfo2}>{uploadStatus}</Text>
                </ View>
              ) : (
                <Text style={styles.uploadInfo}>
                  {name} •{" "}
                  {uploadStatus == "uploading"
                    ? "uploading"
                    : "upload Successful"}
                </Text>
              )}

              { !error &&  uploadProgress < 100 && (
                <Text style={styles.uploadPercentage}>{uploadProgress}%</Text>
              )}

              <TouchableOpacity
                onPress={uploadStatus === "uploading" ? cancelUpload : deleteTrack}
              >
                <Ionicons
                  name={
                    uploadStatus === "uploading"
                      ? "close-circle-outline"
                      : "trash-outline"
                  }
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
            </View>

            {/* Custom Progress bar */}
            {error ? (
              <Text style={styles.uploadError}>{error}</Text>
            ) : (
              uploadProgress < 100 && (
                <View style={styles.progressBar}>
                  <View
                    style={{
                      ...styles.progressFill,
                      width: `${uploadProgress}%`,
                    }}
                  />
                </View>
              )
            )}

            {/** display the size of the track if upload is successful */}
            {uploadProgress >= 100 && (
              <Text style={styles.trackSize}>{size}MB</Text>
            )}
          </View>
        )}

        <View style={{ alignItems: "center" }}>
          {/* File picker for lyrics */}
          <Text style={styles.uploadText}>Upload lyrics</Text>

          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose an lyrics file to upload
            </Text>
            <Text style={styles.fileFormatText}>TXT format</Text>

            <TouchableOpacity style={styles.browseButton} onPress={pickLyrics}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/** Display progress bar and upload lyrics info */}

        {(lyrics|| lyricsError) && (
          <View>
            <View style={styles.uploadContainer}>
              {error ? (
                <View style={{flexDirection:'row'}}>

                <Text style={styles.uploadInfo1}>{lyricsName}</Text>
                <Text style={styles.uploadInfo2}>{lyricsUploadStatus}</Text>
                </ View>
              ) : (
                <Text style={styles.uploadInfo}>
                  {lyricsName} •{" "}
                  {lyricsUploadStatus == "uploading"
                    ? "uploading"
                    : "upload Successful"}
                </Text>
              )}

              { !lyricsError &&  lyricsUploadProgress < 100 && (
                <Text style={styles.uploadPercentage}>{lyricsUploadProgress}%</Text>
              )}

              <TouchableOpacity
                onPress={lyricsUploadStatus === "uploading" ? cancelUpload : deleteTrack}
              >
                <Ionicons
                  name={
                    lyricsUploadStatus === "uploading"
                      ? "close-circle-outline"
                      : "trash-outline"
                  }
                  size={20}
                  color="red"
                />
              </TouchableOpacity>
            </View>

            {/* Custom Progress bar */}
            {lyricsError ? (
              <Text style={styles.uploadError}>{lyricsError}</Text>
            ) : (
              lyricsUploadProgress < 100 && (
                <View style={styles.progressBar}>
                  <View
                    style={{
                      ...styles.progressFill,
                      width: `${lyricsUploadProgress}%`,
                    }}
                  />
                </View>
              )
            )}

            {/** display the size of the track if upload is successful */}
            {lyricsUploadProgress>= 100 && (
              <Text style={styles.trackSize}>{lyricsSize}MB</Text>
            )}
          </View>
        )}

        <View style={{ alignItems: "center" }}>
          {/* File picker for image */}
          <Text style={styles.uploadText}>Upload Artwork</Text>

          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose an image file to upload
            </Text>
            <Text style={styles.fileFormatText}>PNG, JPEG or JPG format</Text>

            <TouchableOpacity style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
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
    paddingBottom: 30,
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
    marginBottom: 40,
  },
  uploadText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  saveButton: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#6F2CFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  saveText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 20,
    width: 320,
  },
  uploadInfo: {
    color: "white",
    fontSize: 12,
  },
  uploadInfo1: {
    color: "white",
    fontSize: 16,
    marginRight:4,
  },
  uploadInfo2: {
    color: "red",
    fontSize: 16,
  },
  uploadPercentage: {
    color: "white",
    fontSize: 12,
  },
  uploadError: {
    color: "red",
    fontSize: 12,
  },
  trackSize: {
    color: "grey",
    fontSize: 12,
    marginLeft: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginLeft: 10,
    marginRight: 10,
  },
  progressFill: {
    height: 10,
    backgroundColor: "#6F2CFF",
    borderRadius: 5,
  },
});

export default uploadTrackScreen;
