import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Button,
  Modal,
} from "react-native";
import React, { use, useState } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { tokenManager } from "../../../utils/tokenManager";
import { Audio } from "expo-av";
import { axiosPost } from "../../../utils/axiosCalls";
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const uploadTrackScreen = () => {
  const [title, setTitile] = useState("");
  const [isrc, setIsrc] = useState("");
  const [genre, setGenre] = useState("");
  const [track, setTrack] = useState();
  const [trackType, setTrackType] = useState();
  const [size, setSize] = useState();
  const [name, setName] = useState("");
  const [lyrics, setLyrics] = useState();
  const [lyricsName, setLyricsName] = useState();
  const [lyricsType, setLyricsType] = useState();
  const [uploadProgress, setUploadProgress] = useState();
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [lyricsError, setLyricsError] = useState();
  const [lyricsUploadStatus, setLyricsUploadStatus] = useState("idle");
  const [lyricsUploadProgress, setLyricsUploadProgress] = useState();
  const [lyricsSize, setLyricsSize] = useState();
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [cover, setCover] = useState();
  const [coverName, setCoverName] = useState();
  const [coverError, setCoverError] = useState();
  const [coverUploadStatus, setCoverUploadStatus] = useState("idle");
  const [coverUploadProgress, setCoverUploadProgress] = useState();
  const [coverSize, setCoverSize] = useState();
  const [coverType, setCoverType] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTrackName, setNewTrackName] = useState(name);
  const [isLoading, setIsLoading] = useState(false);

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
  
      if (!allowedTypes.includes(file.mimeType)) {
        Alert.alert("Error", "Invalid file type. Only mp3, mpeg or wav are allowed.");
      } else if (trackSize > 10) {
        Alert.alert("Error", "File is too large. Must be under 10MB.");
      } else {
        // Check track duration
        const { sound } = await Audio.Sound.createAsync({ uri: file.uri });
        const status = await sound.getStatusAsync();
  
        if (status.durationMillis < 30000) { // Less than 30 seconds
          Alert.alert("Error", "Track must be at least 30 seconds long.");
          sound.unloadAsync(); // Unload sound to free resources
        } else {
          setTrackType(file.mimeType);
          setName(file.name);
          trackSize = trackSize.toFixed(2);
          setSize(trackSize);
          setTrack(file.uri);
          setUploadStatus("uploading");
          startUpload(file.uri);
        }
      }
    }
  };

  {
    /** selects the lyrics from device */
  }
  const pickLyrics = async () => {
    setLyricsError(null);
    setLyrics(null);
    setLyricsSize(null);
    setLyricsUploadProgress(0);
    setLyricsUploadStatus("idle");
    setLyricsName("");

    let result = await DocumentPicker.getDocumentAsync({
      type: "text/plain",
      copyToCacheDirectory: false,
      multiple: false,
    });
    console.log(result);

    if (result.assets && !result.canceled && result.assets?.length > 0) {
      let file = result.assets[0];
      let fileSize = file.size;
      let fileType = file.mimeType;
      const allowedTypes = ["text/plain"];

      if (!allowedTypes.includes(fileType)) {
        Alert.alert("Error", "Invalid file type. Only txt files are allowed.");
      } else if (fileSize > 10 * 1024 * 1024) {
        Alert.alert("Error", "File is too large. Must be under 10MB.");
      } else {
        setLyricsName(file.name);
        setLyricsType(file.mimeType);
        fileSize = fileSize.toFixed(2);
        setLyricsSize(fileSize);
        setLyrics(file.uri);
        setLyricsUploadStatus("Uploading");
        startLyricsUpload(file.uri);
      }
    }
  };

  const pickCover = async () => {
    setCoverError(null);
    setCover(null);
    setCoverSize(null);
    setCoverUploadProgress(0);
    setCoverUploadStatus("idle");
    setCoverName("");

    // let result = await DocumentPicker.getDocumentAsync({
    //   type: ["image/png", "image/jpeg", "image/heic", "image/jpg"],
    //   copyToCacheDirectory: false,
    //   multiple: false,
    // });
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // restricts to image types
      allowsEditing: true,
      // aspect: [4, 3], // optional, aspect ratio
      // quality: 1, // quality of the image, range 0-1
    });

    console.log("cover is : ", result);

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      let coverSize = file.size;
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/heic",
        "image/jpg",
      ];

      //validate track type and size

      if (!allowedTypes.includes(file.mimeType)) {
        Alert.alert("Error", "Invalid file type. Only png, jpeg, heic or jpg are allowed.");
      } else if (coverSize > 10 * 1024 * 1024) {
        Alert.alert("Error", "File is too large. Must be under 10MB.");
      } else {
        setCoverName(file.name);
        setCoverType(file.mimeType);
        coverSize = coverSize;
        setCoverSize(coverSize);
        setCover(file.uri);
        setCoverUploadStatus("uploading");
        startCoverUpload(file.uri);
      }
    }
  };

  const addTag = () => {
    if (currentTag.trim()) {
      if (tags.length >= 5) {
        Alert.alert("Limit Reached", "Maximum 5 tags allowed");
        return;
      }
      if (tags.includes(currentTag.trim())) {
        Alert.alert("Duplicate Tag", "This tag already exists");
        return;
      }
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

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
      setLyricsUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setLyricsUploadStatus("uploaded");
      }
    }, 500);
  };

  const startCoverUpload = (track) => {
    console.log(track);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setCoverUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setCoverUploadStatus("uploaded");
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
  };
  const cancelUpload = () => {
    setUploadStatus("idle");
    setTrack(null);
    setUploadProgress(0);
  };

  const deleteLyric = () => {
    setLyricsName(null);
    setLyrics(null);
    setLyricsSize(null);
    setLyricsUploadProgress(null);
    setLyricsUploadStatus("idle");
    setLyricsError(null);
  };
  const cancelLyric = () => {
    setLyricsUploadStatus("idle");
    setLyrics(null);
    setLyricsError(null);
    setLyricsUploadProgress(0);
    setLyricsName(null);
    setLyricsSize(null);
  };

  const deleteCover = () => {
    setCoverName(null);
    setCover(null);
    setCoverSize(null);
    setCoverUploadProgress(null);
    setCoverUploadStatus("idle");
    setCoverError(null);
  };

  const openRenameModal = () => {
    setNewTrackName(name);
    setModalVisible(true);
  };

  const saveNewTrackName = () => {
    setName(newTrackName);
    setModalVisible(false);
  };

  const saveTrack = async () => {
    setIsLoading(true);

    const artistId = await tokenManager.getUserId();
    console.log("artistID: ", artistId);

    // Ensure all required fields are filled before proceeding
    if (!title || !isrc || !genre || !track) {
      Alert.alert("Error", "Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    // Create a FormData object
    const formData = new FormData();
    const token = await tokenManager.getAccessToken();

    formData.append("artistId", artistId);
    formData.append("title", title);
    formData.append("isrc", isrc);
    formData.append("releaseDate", new Date().toISOString());
    formData.append("genre", genre);
    formData.append("tags", JSON.stringify(tags)); // Add tags to form data

    // Append the files (track, cover, lyrics)
    formData.append("track", {
      uri: track,
      name: name,
      type: trackType,
    });

    if (cover) {
      formData.append("cover", {
        uri: cover,
        name: coverName,
        type: coverType,
      });
    }

    if (lyrics) {
      formData.append("lyrics", {
        uri: lyrics,
        name: lyricsName,
        type: lyricsType,
      });
    }

    try {
      const response = await fetch(`${SERVER_URL}/tracks`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type when sending FormData,
          // browser will set it automatically with the correct boundary
        },
        body: formData,
      });

      if (!response.ok) {
        // Try to parse error message from response
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      Alert.alert("Success", "Uploaded successfully");
      console.log("Track uploaded successfully:", result);
    } catch (error) {
      const errorMessage =
        error.data?.error || error.message || "Failed to upload the track.";
      Alert.alert("Error", errorMessage);
      console.error("Upload err:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.outerView}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6F2CFF" />
          <Text style={styles.loadingText}>Uploading</Text>
        </View>
      )}

      {!isLoading && (
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
          <View style={styles.intputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>Tags</Text>
            </View>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                value={currentTag}
                onChangeText={setCurrentTag}
                placeholder="Add tags"
                placeholderTextColor="white"
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === ' ') {
                    addTag();
                  }
                }}
              />
              <TouchableOpacity 
                style={styles.addTagButton}
                onPress={addTag}
              >
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tagChip}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity
                    onPress={() => removeTag(index)}
                    style={styles.removeTagButton}
                  >
                    <Text style={styles.removeTagText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <Text style={styles.tagLimit}>
              {tags.length}/5 tags added
            </Text>
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
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.uploadInfo1}>{name}</Text>
                    <Text style={styles.uploadInfo2}>{uploadStatus}</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadInfo}>
                    {name} •{" "}
                    {uploadStatus == "uploading"
                      ? "uploading"
                      : "upload Successful"}
                  </Text>
                )}

                {!error && uploadProgress < 100 && (
                  <Text style={styles.uploadPercentage}>{uploadProgress}%</Text>
                )}

                <TouchableOpacity
                  onPress={
                    uploadStatus === "uploading" ? cancelUpload : deleteTrack
                  }
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
                <View>
                  <Text style={styles.trackSize}>{size}MB</Text>
                  <TouchableOpacity onPress={openRenameModal}>
                    <Text style={styles.renameText}>Rename</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Modal for renaming track */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Rename Track</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter new track name"
                  value={newTrackName}
                  onChangeText={setNewTrackName}
                />
                <View style={styles.modalButtons}>
                  <Button
                    title="Cancel"
                    onPress={() => setModalVisible(false)}
                    color="red"
                  />
                  <Button title="Save" onPress={saveNewTrackName} />
                </View>
              </View>
            </View>
          </Modal>

          <View style={{ alignItems: "center" }}>
            {/* File picker for lyrics */}
            <Text style={styles.uploadText}>Upload lyrics</Text>

            <View style={styles.filePickerContainer}>
              <Text style={styles.filePickerTitle}>
                Choose an lyrics file to upload
              </Text>
              <Text style={styles.fileFormatText}>TXT format</Text>

              <TouchableOpacity
                style={styles.browseButton}
                onPress={pickLyrics}
              >
                <Text style={styles.browseButtonText}>Browse File</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/** Display progress bar and upload lyrics info */}

          {(lyrics || lyricsError) && (
            <View>
              <View style={styles.uploadContainer}>
                {lyricsError ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.uploadInfo1}>{lyricsName}</Text>
                    <Text style={styles.uploadInfo2}>{lyricsUploadStatus}</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadInfo}>
                    {lyricsName} •{" "}
                    {lyricsUploadStatus == "uploading"
                      ? "uploading"
                      : "upload Successful"}
                  </Text>
                )}

                {!lyricsError && lyricsUploadProgress < 100 && (
                  <Text style={styles.uploadPercentage}>
                    {lyricsUploadProgress}%
                  </Text>
                )}

                <TouchableOpacity
                  onPress={
                    lyricsUploadStatus === "uploading"
                      ? cancelLyric
                      : deleteLyric
                  }
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
              {lyricsUploadProgress >= 100 && (
                <Text style={styles.trackSize}>{lyricsSize}B</Text>
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
              <Text style={styles.fileFormatText}>
                PNG, JPEG, HEIC or JPG format
              </Text>

              <TouchableOpacity style={styles.browseButton} onPress={pickCover}>
                <Text style={styles.browseButtonText}>Browse File</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/** Display progress bar and upload cover info */}

          {(cover || coverError) && (
            <View>
              <View style={styles.uploadContainer}>
                {coverError ? (
                  <View style={{ flexDirection: "row" }}>
                    <Text style={styles.uploadInfo1}>{coverName}</Text>
                    <Text style={styles.uploadInfo2}>{coverUploadStatus}</Text>
                  </View>
                ) : (
                  <Text style={styles.uploadInfo}>
                    {coverName} •{" "}
                    {coverUploadProgress == "uploading"
                      ? "uploading"
                      : "upload Successful"}
                  </Text>
                )}

                {!coverError && coverUploadProgress < 100 && (
                  <Text style={styles.uploadPercentage}>
                    {coverUploadProgress}%
                  </Text>
                )}

                <TouchableOpacity
                  onPress={
                    coverUploadStatus === "uploading"
                      ? deleteCover
                      : deleteCover
                  }
                >
                  <Ionicons
                    name={
                      coverUploadProgress === "uploading"
                        ? "close-circle-outline"
                        : "trash-outline"
                    }
                    size={20}
                    color="red"
                  />
                </TouchableOpacity>
              </View>

              {/* Custom Progress bar */}
              {coverError ? (
                <Text style={styles.uploadError}>{coverError}</Text>
              ) : (
                coverUploadProgress < 100 && (
                  <View style={styles.progressBar}>
                    <View
                      style={{
                        ...styles.progressFill,
                        width: `${coverUploadProgress}%`,
                      }}
                    />
                  </View>
                )
              )}

              {/** display the size of the track if upload is successful */}
              {coverUploadProgress >= 100 && (
                <Text style={styles.trackSize}>{coverSize}B</Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={saveTrack}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
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
    marginTop: 25,
    marginBottom: 60,
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
    marginRight: 4,
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
  renameText: {
    color: "grey",
    fontSize: 12,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  tagInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  addTagButton: {
    backgroundColor: '#6F2CFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  addTagButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6F2CFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginBottom: 4,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  removeTagButton: {
    marginLeft: 4,
  },
  removeTagText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagLimit: {
    color: 'grey',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
});

export default uploadTrackScreen;
