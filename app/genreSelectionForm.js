
// Updated GenreSelectionScreen
import React, { useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { tokenManager } from '../utils/tokenManager';
import useProfileStore from '../zusStore/userFormStore';

const MAX_SELECTIONS = 3;

const GenreSelectionScreen = () => {
  const { selectedGenres, updateField } = useProfileStore();

  // Initialize access token
  useEffect(() => {
    const initializeToken = async () => {
      const token = await tokenManager.getAccessToken();
      updateField('accessToken', token);
    };
    initializeToken();
  }, []);

  const genres = [
    { id: '1', name: 'Pop' },
    { id: '2', name: 'Rock' },
    // ... rest of the genres array
  ];

  const handleGenreSelect = (genre) => {
    const isSelected = selectedGenres.some(g => g.id === genre.id);
    
    if (isSelected) {
      const updatedGenres = selectedGenres.filter(g => g.id !== genre.id);
      updateField('selectedGenres', updatedGenres);
    } else {
      if (selectedGenres.length >= MAX_SELECTIONS) {
        Alert.alert(
          "Selection Limit Reached",
          `You can only select up to ${MAX_SELECTIONS} genres. Please remove a genre before adding another.`
        );
        return;
      }
      updateField('selectedGenres', [...selectedGenres, genre]);
    }
  };

  const handleNext = () => {
    if (selectedGenres.length === 0) {
      Alert.alert(
        "No Genres Selected",
        "Please select at least one genre to continue."
      );
      return;
    }
    
    router.push('userBasicInfoForm');
  };

  const renderGenreItem = ({ item }) => {
    const isSelected = selectedGenres.some(g => g.id === item.id);
    const selectionNumber = isSelected ? 
      selectedGenres.findIndex(g => g.id === item.id) + 1 : null;

    return (
      <TouchableOpacity
        style={[
          styles.genreItem,
          isSelected && styles.selectedGenre,
        ]}
        onPress={() => handleGenreSelect(item)}
      >
        <Text style={[
          styles.genreText,
          isSelected && styles.selectedGenreText
        ]}>
          {item.name}
        </Text>
        {isSelected && (
          <View style={styles.selectionBadge}>
            <Text style={styles.selectionBadgeText}>{selectionNumber}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Music Genres</Text>
      <Text style={styles.subHeader}>
        Choose up to {MAX_SELECTIONS} genres
        {selectedGenres.length > 0 && ` (${selectedGenres.length}/${MAX_SELECTIONS} selected)`}
      </Text>
      <FlatList
        data={genres}
        renderItem={renderGenreItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
      />
      {selectedGenres.length > 0 && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionTitle}>Selected Genres:</Text>
          {selectedGenres.map((genre, index) => (
            <Text key={genre.id} style={styles.selectionText}>
              {index + 1}. {genre.name}
            </Text>
          ))}
        </View>
      )}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedGenres.length === 0 && styles.nextButtonDisabled
          ]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  subHeader: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  genreItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    margin: 4,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    minHeight: 60,
    justifyContent: 'center',
    position: 'relative',
  },
  selectedGenre: {
    backgroundColor: '#1DB954',
  },
  genreText: {
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedGenreText: {
    color: '#ffffff',
  },
  selectionBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#1a1a1a',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  selectionBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionContainer: {
    padding: 16,
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 4,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 16,
    color: '#333333',
    marginVertical: 2,
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 34, // Add extra padding for iPhone X and newer
  },
  nextButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GenreSelectionScreen;