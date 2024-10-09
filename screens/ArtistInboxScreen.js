import React from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';

const ArtistInboxScreen = () => {
  const messages = [
    { id: '1', sender: 'John Doe', subject: 'New Collaboration', message: 'Hey, I’d like to collaborate!' },
    { id: '2', sender: 'Jane Smith', subject: 'Album Feedback', message: 'Your new album sounds amazing!' },
    { id: '3', sender: 'Record Label', subject: 'Contract Offer', message: 'We’d like to sign you!' },
  ];

  return (
    <View style={styles.container}>
      {/* Placeholder for Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search messages"
      />

      {/* Placeholder for Compose Button */}
      <Button title="Compose New Message" onPress={() => {}} />

      {/* Placeholder for Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text style={styles.subject}>{item.subject}</Text>
            <Text style={styles.messagePreview}>{item.message}</Text>
          </View>
        )}
        style={styles.messageList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  sender: {
    fontWeight: 'bold',
  },
  subject: {
    fontSize: 16,
    color: '#007BFF',
  },
  messagePreview: {
    fontSize: 14,
    color: '#666',
  },
  messageList: {
    marginTop: 10,
  },
});

export default ArtistInboxScreen;
