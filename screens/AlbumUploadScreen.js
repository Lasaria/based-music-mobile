import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const AlbumUploadScreen = () => {
  const [albumData, setAlbumData] = useState({
    title: '',
    artist: '',
    genre: '',
    releaseDate: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Function to handle picking multiple files
  const pickMultipleDocuments = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      multiple: true, // Allow multiple file selection
    });

    if (result.assets && result.assets.length > 0) {
      const file = result.assets[0]; // Access the first asset from the array
      
      // Check file extension to ensure it's mp3 or wav
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'mp3' || fileExtension === 'wav') {
        setSelectedFiles(file);
  
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
    if (selectedFiles.length === 0) {
      Alert.alert('No Files Selected', 'Please choose multiple MP3 or WAV files to upload.');
      return;
    }

    // You can handle form submission or album upload logic here
    console.log('Album Metadata:', albumData);
    console.log('Selected Files:', selectedFiles);

    Alert.alert('Album Uploaded', 'Your album has been uploaded successfully!');
  };

  return (
    <View style={styles.container}>
      <Button title="Choose Tracks (MP3 or WAV)" onPress={pickMultipleDocuments} />

      {selectedFiles.length > 0 && (
        <FlatList
          data={selectedFiles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <Text style={styles.fileName}>{item.name}</Text>}
          style={styles.trackList}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Album Title"
        value={albumData.title}
        onChangeText={(text) => setAlbumData({ ...albumData, title: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Artist Name"
        value={albumData.artist}
        onChangeText={(text) => setAlbumData({ ...albumData, artist: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        value={albumData.genre}
        onChangeText={(text) => setAlbumData({ ...albumData, genre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Release Date (YYYY-MM-DD)"
        value={albumData.releaseDate}
        onChangeText={(text) => setAlbumData({ ...albumData, releaseDate: text })}
      />

      <Button title="Upload Album" onPress={handleUpload} />
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
    marginVertical: 5,
    fontSize: 16,
    color: 'green',
  },
  trackList: {
    marginVertical: 10,
  },
});

export default AlbumUploadScreen;
