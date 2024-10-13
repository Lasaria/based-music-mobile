import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
//import * as DocumentPicker from 'expo-document-picker';

const TrackUploadScreen = () => {
  const [trackData, setTrackData] = useState({
    title: '',
    artist: '',
    album: '',
    trackNumber: '',
    genre: '',
    releaseDate: '',
    duration: '',
    isrc: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle picking the file
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*', // Allows only audio files
    });

    console.log(result);
    

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0]; // Access the first asset from the array
      
      // Check file extension to ensure it's mp3 or wav
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'mp3' || fileExtension === 'wav') {
        setSelectedFile(file);
  
        // Display alert with file name and size
        Alert.alert(
          'File Selected',
          `File Name: ${file.name}\nFile Size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`
        );
      } else {
        Alert.alert('Invalid File Type', 'Please select an MP3 or WAV file.');
      }
    } else {
      Alert.alert('No File Selected', 'Please choose a valid file.');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please choose an MP3 or WAV file to upload.');
      return;
    }

    // You can handle form submission or track upload logic here
    console.log('Track Metadata:', trackData);
    console.log('Selected File:', selectedFile);

    Alert.alert('Track Uploaded', 'Your track has been uploaded successfully!');
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Track (MP3 or WAV)" onPress={pickDocument} />

      {selectedFile && (
        <Text style={styles.fileName}>
          Selected File: {selectedFile.name}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Song Title"
        value={trackData.title}
        onChangeText={(text) => setTrackData({ ...trackData, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist Name"
        value={trackData.artist}
        onChangeText={(text) => setTrackData({ ...trackData, artist: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Album Name"
        value={trackData.album}
        onChangeText={(text) => setTrackData({ ...trackData, album: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Track Number"
        value={trackData.trackNumber}
        onChangeText={(text) => setTrackData({ ...trackData, trackNumber: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={trackData.genre}
        onChangeText={(text) => setTrackData({ ...trackData, genre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Release Date (YYYY-MM-DD)"
        value={trackData.releaseDate}
        onChangeText={(text) => setTrackData({ ...trackData, releaseDate: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Duration (in seconds)"
        value={trackData.duration}
        onChangeText={(text) => setTrackData({ ...trackData, duration: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="ISRC Code"
        value={trackData.isrc}
        onChangeText={(text) => setTrackData({ ...trackData, isrc: text })}
      />

      <Button title="Upload Track" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  fileName: {
    marginVertical: 10,
    fontSize: 16,
    color: 'green',
  },
});

export default TrackUploadScreen;
