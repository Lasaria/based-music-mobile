import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { tokenManager } from "../../../utils/tokenManager";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const uploadTrackScreen = () => {
  const [title, setTitile] = useState("");
  const [isrc, setIsrc] = useState("");
  const [genre, setGenre] = useState("");
  const [tracks, setTracks] = useState([]);
  const [lyrics, setLyrics] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTrackName, setNewTrackName] = useState("");
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(null);
  const [newLyricsName, setNewLyricsName] = useState("");
  const [selectedLyricsIndex, setSelectedLyricsIndex] = useState(null);
  const [modalVisibleLyrics, setModalVisibleLyrics] = useState(false);
  const [artwork, setArtwork] = useState(null);
  const [modalVisibleArtwork, setModalVisibleArtwork] = useState(false);
  const [newArtworkName, setNewArtworkName] = useState("");
  const [nameMapping, setNameMapping] = useState({});
  const [lyricsMapping, setLyricsMapping] = useState({});


  const artistId = tokenManager.getIdToken();


  {/** selects the track from device */}
  const pickTrack = async () => {
    try {
      console.log("pick track");

      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: false,
      });

      if (result && !result.canceled && result.assets?.length > 0) {
        console.log("pick track 1");

        const file = result.assets[0];
        let trackSize = (file.size / (1024 * 1024)).toFixed(2);
        const allowedTypes = ["audio/mpeg", "audio/mp3", "audio/wav"];    
        const simplifiedName = file.name.replace(/\.[^/.]+$/, "");
       
        if (!allowedTypes.includes(file.mimeType)) {
          setTracks((prevTrack) => [
            ...prevTrack,
            {
              name: file.name,
              error: "Invalid file type. Only mp3, mpeg, or wav are allowed.",
            },
          ]);
        } else if (trackSize > 10) {
          setTracks((prevTrack) => [
            ...prevTrack,
            {
              name: file.name,
              error: "File is too large. Must be under 10MB.",
            },
          ]);
        } else {

          //mapping each track.

          setNameMapping((prev) => ({
            ...prev,
            [file.name] : simplifiedName,
          }))

          
          // Add the new track and start upload
          const newTrack = {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
            size: trackSize,
            progress: 0,
            status: "uploading",
          };

          // Add the new track to the list and start upload automatically
          setTracks((prevTracks) => [...prevTracks, newTrack]);
          startUpload(tracks.length);
          console.log(tracks);
        }
      }
    } catch (error) {
      Alert.alert("Error", error);
    }
  };


  {/** start uploading the tracks */}
  const startUpload = (index) => {
    console.log("starting upload");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      setTracks((prevTracks) =>
        prevTracks.map((track, i) =>
          i === index ? { ...track, progress } : track
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTracks((prevTracks) =>
          prevTracks.map((track, i) =>
            i === index ? { ...track, status: "uploaded" } : track
          )
        );
      }
    }, 500);
  };

  {/** delete the specific track */}
  const deleteTrack = (index) => {
    setTracks((prevTrack) => prevTrack.filter((_, i) => i !== index));
  };

  {/** opens up a modal to rename a track */}
  const openRenameModal = (index) => {
    setSelectedTrackIndex(index);
    setNewTrackName(tracks[index].name);
    setModalVisible(true);
  };

  {/** saves the updated track name */}
  const saveNewTrackName = () => {
    setTracks((prevTrack) =>
      prevTrack.map((track, i) =>
        i === selectedTrackIndex
          ? {
              ...track,
              name: newTrackName,
            }
          : track
      )
    );

    setModalVisible(false);
  };


  {/** selects the lyrics from device */}
  const pickLyrics = async () => {

    if (tracks.length === 0) {
      Alert.alert("Error", "Please select a track first before adding lyrics.");
      return;
    }

    try {
      console.log("pick lyrics");

      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: false,
      });

      console.log(result);
      

      if (result && !result.canceled) {
        console.log("pick lyrics 1");

        const file = result.assets[0];
        let lyricsSize = file.size;
        const allowedTypes = ["text/plain"]; 
        const selectedTrack = tracks[tracks.length - 1];

  
         
        {/** check if the choosen file if of allowed type or not */}
        if (!allowedTypes.includes(file.mimeType)) {
          setLyrics((prevlyrics) => [
            ...prevlyrics,
            {
              name: file.name,
              error: "Invalid file type. Only TXT format is allowed.",
            },
          ]);
        } else if (lyricsSize > 10 * 1024 * 1024) {  //check the size limit of the file
          setLyrics((prevlyrics) => [
            ...prevlyrics,
            {
              name: file.name,
              error: "File is too large. Must be under 10MB.",
            },
          ]);
        } else {
         
          //mapping each track to it's lyrics
          setLyricsMapping((prev) => ({
            ...prev,
            [selectedTrack.name]: file.name,
          }))

          // Add the new lyrics and start upload
          const newLyrics = {
            uri: file.uri,
            name: file.name,
            type: file.mimeType,
            size: lyricsSize.toFixed(2),
            progress: 0,
            status: "uploading",
          };

          // Add the new lyrics to the list and start upload automatically
          setLyrics((prevlyrics) => [...prevlyrics, newLyrics]);
          startLyricsUpload(lyrics.length);
          console.log(lyrics);
        }
      }
    } catch (error) {
      Alert.alert("Error", error);
    }
  };


   {/** start uploading the lyrics */}
   const startLyricsUpload = (index) => {

    console.log("starting lyrics upload");
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;

      setLyrics((prevlyrics) =>
        prevlyrics.map((lyrics, i) =>
          i === index ? { ...lyrics, progress } : lyrics
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setLyrics((prevlyrics) =>
          prevlyrics.map((lyrics, i) =>
            i === index ? { ...lyrics, status: "uploaded" } : lyrics
          )
        );
      }
    }, 500);
  };

  {/** delete the specific lyrics */}
  const deleteLyrics = (index) => {
    setLyrics((prevlyrics) => prevlyrics.filter((_, i) => i !== index));
  };

  {/** opens up a modal to rename a lyrics*/}
  const openLyricsModal = (index) => {
    setSelectedLyricsIndex(index);
    setNewLyricsName(lyrics[index].name);
    setModalVisibleLyrics(true);
  };

  {/** saves the updated lyrics name */}
  const saveNewLyricsName = () => {
    setLyrics((prevlyrics) =>
      prevlyrics.map((lyrics, i) =>
        i === selectedLyricsIndex
          ? {
              ...lyrics,
              name: newLyricsName,
            }
          : lyrics
      )
    );

    setModalVisibleLyrics(false);
  };


 // Selects the artwork from the device
 const pickArtwork = async () => {

  console.log("all artworks:", artwork);
  
  try {
    console.log("pick artwork");

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true,
    });

    console.log(result);
    

    if (result && result.assets.length > 0) {
      console.log("pick artwork 1");

      const file = result.assets[0];
      const artworkSize = file.size / (1024 * 1024);
      const allowedTypes = ["image/jpg", "image/png", "image/jpeg", "image/heic"];

      if (!allowedTypes.includes(file.mimeType)) {
        setArtwork({
          name: file.name,
          error: "Invalid file type. Only png, jpeg, heic, or jpg are allowed.",
        });
      } else if (artworkSize > 10) {
        setArtwork({
          name: file.name,
          error: "File is too large. Must be under 10MB.",
        });
      } else {
        // Replace any existing artwork with the new artwork
        const newArtwork = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
          size: artworkSize.toFixed(2),
          progress: 0,
          status: "uploading",
        };
        setArtwork(newArtwork);
        startArtworkUpload();
      }
    }
  } catch (error) {
    Alert.alert("Error", "Failed to pick artwork.");
  }
};

// Starts uploading the artwork
const startArtworkUpload = () => {
  console.log("starting artwork upload");
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;

    setArtwork((prevArtwork) =>
      prevArtwork ? { ...prevArtwork, progress } : prevArtwork
    );

    if (progress >= 100) {
      clearInterval(interval);
      setArtwork((prevArtwork) =>
        prevArtwork ? { ...prevArtwork, status: "uploaded" } : prevArtwork
      );
    }
  }, 500);
};

// Opens up a modal to rename the artwork
const openArtworkModal = () => {
  if (artwork) {
    setNewArtworkName(artwork.name);
    setModalVisibleArtwork(true);
  }
};

// Saves the updated artwork name
const saveNewArtworkName = () => {
  setArtwork((prevArtwork) =>
    prevArtwork ? { ...prevArtwork, name: newArtworkName } : prevArtwork
  );
  setModalVisibleArtwork(false);
};

//delete artwork

const deleteArtwork = () => {

  if(artwork){
    setArtwork(null);
    console.log( 'artwork:', artwork);
  }

  
}

const nextScreen = () => {

   router.push({
    pathname: '/editAlbumScreen',
    params: {
      title,
      isrc,
      genre,
      tracks:JSON.stringify(tracks),
      lyrics: JSON.stringify(lyrics),
      artwork:JSON.stringify(artwork),
      lyricsMapping: JSON.stringify(lyricsMapping),
      nameMapping:  JSON.stringify(nameMapping),
    }
   });
}




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
            style={styles.textInput}
            value={title}
            onChangeText={setTitile}
            placeholder="Enter album title"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Genre</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={genre}
            onChangeText={setGenre}
            placeholder="Enter genre"
            placeholderTextColor="white"
          />
        </View>
        <View style={styles.intputContainer}>
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>ISRC Code</Text>
          </View>
          <TextInput
            style={styles.textInput}
            value={isrc}
            onChangeText={setIsrc}
            placeholder="Enter ISRC Code"
            placeholderTextColor="white"
          />
        </View>
       
       {/** section to upload the albums */}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.uploadText}>Upload Album</Text>
          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose an audio file to upload
            </Text>
            <Text style={styles.fileFormatText}>WAV, MP3, MPEG format</Text>

            <TouchableOpacity style={styles.browseButton} onPress={pickTrack}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
          {tracks.length > 0 && (
            <View style={styles.selectedFilesContainer}>
              {tracks.map((track, index) => (
                <View key={index} style={styles.fileContainer}>
                  <View style={styles.trackHeader}>
                    <Text style={styles.fileInfo}>{track.name}</Text>
                    <Text style={styles.uploadStatus}>
                      {track.error ? (
                        <Text style={styles.errorText}>Error</Text>
                      ) : track.progress < 100 ? (
                        "Uploading"
                      ) : (
                        "Uploaded"
                      )}
                    </Text>
                    {track.progress < 100 && !track.error && (
                      <Text style={styles.uploadPercentage}>
                        {track.progress}%
                      </Text>
                    )}

                    <TouchableOpacity onPress={() => deleteTrack(index)}>
                      <Ionicons
                        name={
                          track.status === "uploading"
                            ? "close-circle-outline"
                            : "trash-outline"
                        }
                        size={20}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={{
                        ...styles.progressFill,
                        width: `${track.progress}%`,
                      }}
                    />
                  </View>
                  {track.error ? (
                    <Text style={styles.errorText}>{track.error}</Text>
                  ) : track.progress >= 100 ? (
                    <View>
                      <Text style={styles.successText}>{track.size}MB</Text>
                      <TouchableOpacity onPress={() => openRenameModal(index)}>
                        <Text style={styles.renameText}>Rename</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {/** Modal fro renaming track */}

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
                           <Button
                            title="Save"
                            onPress={saveNewTrackName}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              ))}
            </View>
          )}
        </View>
 
        {/** section for lyrics upload */}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.uploadText}>Upload lyrics</Text>
          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose a lyrics files to upload
            </Text>
            <Text style={styles.fileFormatText}>TXT format</Text>

            <TouchableOpacity style={styles.browseButton} onPress={pickLyrics}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
          {lyrics.length > 0 && (
            <View style={styles.selectedFilesContainer}>
              {lyrics.map((lyrics, index) => (
                <View key={index} style={styles.fileContainer}>
                  <View style={styles.trackHeader}>
                    <Text style={styles.fileInfo}>{lyrics.name}</Text>
                    <Text style={styles.uploadStatus}>
                      {lyrics.error ? (
                        <Text style={styles.errorText}>Error</Text>
                      ) : lyrics.progress < 100 ? (
                        "Uploading"
                      ) : (
                        "Uploaded"
                      )}
                    </Text>
                    {lyrics.progress < 100 && !lyrics.error && (
                      <Text style={styles.uploadPercentage}>
                        {lyrics.progress}%
                      </Text>
                    )}

                    <TouchableOpacity onPress={() => deleteLyrics(index)}>
                      <Ionicons
                        name={
                          lyrics.status === "uploading"
                            ? "close-circle-outline"
                            : "trash-outline"
                        }
                        size={20}
                        color="red"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.progressBar}>
                    <View
                      style={{
                        ...styles.progressFill,
                        width: `${lyrics.progress}%`,
                      }}
                    />
                  </View>
                  {lyrics.error ? (
                    <Text style={styles.errorText}>{lyrics.error}</Text>
                  ) : lyrics.progress >= 100 ? (
                    <View>
                      <Text style={styles.successText}>{lyrics.size}B</Text>
                      <TouchableOpacity onPress={() => openLyricsModal(index)}>
                        <Text style={styles.renameText}>Rename</Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {/** Modal fro renaming track */}

                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisibleLyrics}
                    onRequestClose={() => setModalVisibleLyrics(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Rename Track</Text>
                        <TextInput
                          style={styles.modalInput}
                          placeholder="Enter new lyrics name"
                          value={newLyricsName}
                          onChangeText={setNewLyricsName}
                        />
                        <View style={styles.modalButtons}>
                          <Button
                            title="Cancel"
                            onPress={() => setModalVisibleLyrics(false)}
                            color="red"
                          />
                           <Button
                            title="Save"
                            onPress={saveNewLyricsName}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>
              ))}
            </View>
          )}
        </View>



        {/** section for artwork (images) upload */}
        <View style={{ alignItems: "center" }}>
          <Text style={styles.uploadText}>Upload Artwork</Text>
          <View style={styles.filePickerContainer}>
            <Text style={styles.filePickerTitle}>
              Choose a image file to upload
            </Text>
            <Text style={styles.fileFormatText}> PNG, JPEG, HEIC or JPG format</Text>

            <TouchableOpacity style={styles.browseButton} onPress={pickArtwork}>
              <Text style={styles.browseButtonText}>Browse File</Text>
            </TouchableOpacity>
          </View>
         
          {artwork && (
            <View style={styles.selectedFilesContainer}>
              <View style={styles.fileContainer}>
                <View style={styles.trackHeader}>
                  <Text style={styles.fileInfo}>{artwork.name}</Text>
                  <Text style={styles.uploadStatus}>
                    {artwork.error ? (
                      <Text style={styles.errorText}>Error</Text>
                    ) : artwork.progress < 100 ? (
                      "Uploading"
                    ) : (
                      "Uploaded"
                    )}
                  </Text>
                  {artwork.progress < 100 && !artwork.error && (
                    <Text style={styles.uploadPercentage}>
                      {artwork.progress}%
                    </Text>
                  )}

                  <TouchableOpacity onPress={() => deleteArtwork()}>
                    <Ionicons
                      name={
                        artwork.status === "uploading"
                          ? "close-circle-outline"
                          : "trash-outline"
                      }
                      size={20}
                      color="red"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={{
                      ...styles.progressFill,
                      width: `${artwork.progress}%`,
                    }}
                  />
                </View>

                {artwork.error ? (
                  <Text style={styles.errorText}>{artwork.error}</Text>
                ) : artwork.progress >= 100 ? (
                  <View>
                    <Text style={styles.successText}>{artwork.size}MB</Text>
                    <TouchableOpacity onPress={openArtworkModal}>
                      <Text style={styles.renameText}>Rename</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Modal for renaming artwork */}
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisibleArtwork}
                  onRequestClose={() => setModalVisibleArtwork(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.modalTitle}>Rename Artwork</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Enter new artwork name"
                        value={newArtworkName}
                        onChangeText={setNewArtworkName}
                      />
                      <View style={styles.modalButtons}>
                        <Button
                          title="Cancel"
                          onPress={() => setModalVisibleArtwork(false)}
                          color="red"
                        />
                        <Button title="Save" onPress={saveNewArtworkName} />
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            </View>
          )}
        </View>   
        <TouchableOpacity style={styles.saveButton} onPress={nextScreen}>
          <Text style={styles.saveText}>Next</Text>
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
  },
  saveButton: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: "#6F2CFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom:60,
    marginTop:20,
  },
  saveText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
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
  labelText: {
    color: "white",
    fontSize: 14,
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
  textInput: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: "white",
    textAlign: "left",
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
  uploadText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 20,
    textAlign: "left",
    alignSelf: "flex-start",
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
  uploadPercentage: {
    color: "white",
    fontSize: 12,
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
  renameText: {
    color: "grey",
    fontSize: 12,
    marginTop: 8,
  },
  selectedFilesContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  fileContainer: {
    marginVertical: 5,
    padding: 10,
    width: 320,
  },
  trackHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fileInfo: {
    color: "white",
    fontSize: 14,
  },
  uploadStatus: {
    color: "grey",
    fontSize: 12,
    marginRight: -10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginVertical: 5,
  },
  progressFill: {
    height: 10,
    backgroundColor: "#6F2CFF",
    borderRadius: 5,
  },
  successText: {
    color: "white",
    fontSize: 12,
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 5,
  },
});

export default uploadTrackScreen;
