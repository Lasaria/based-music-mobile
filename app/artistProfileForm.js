import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const SelectInformationPage = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState('');
  const router = useRouter();

  const handleNextPress = () => {
    // Logic to handle the next button press
    console.log("Name:", name);
    console.log("Bio:", bio);
    console.log("Genres:", genres);
    router.replace('(profile)/artistProfile'); // Replace with your next screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Who are you?</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Jakob Lee"
      />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Enter bio"
      />

      <Text style={styles.label}>Genres</Text>
      <TextInput
        style={styles.input}
        value={genres}
        onChangeText={setGenres}
        placeholder="Rap / Hip-Hop"
      />

      <Button title="Next" onPress={handleNextPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
});

export default SelectInformationPage;
