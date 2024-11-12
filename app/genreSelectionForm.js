
// Updated GenreSelectionScreen
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { tokenManager } from '../utils/tokenManager';
import useProfileStore from '../zusStore/userFormStore';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Color';
import ProgressBar from '../components/ProgressBar';

const MIN_SELECTIONS = 3;

const genres = [
  { id: '1', genre: 'Country', image: require('../assets/images/ArtistSignUpFlow/country.png') },
  { id: '2', genre: 'Hip-Hop', image: require('../assets/images/ArtistSignUpFlow/hip-pop.png') },
  { id: '3', genre: 'Hard Rock', image: require('../assets/images/ArtistSignUpFlow/hard-rock.png') },
  { id: '4', genre: 'Indie', image: require('../assets/images/ArtistSignUpFlow/indie.png') },
  { id: '5', genre: 'Chill out', image: require('../assets/images/ArtistSignUpFlow/chill-out.png') },
  { id: '6', genre: 'R&B', image: require('../assets/images/ArtistSignUpFlow/r-and-b.png') },
  { id: '7', genre: 'Pop', image: require('../assets/images/ArtistSignUpFlow/pop.png') },
  { id: '8', genre: 'Metallic', image: require('../assets/images/ArtistSignUpFlow/metallic.png') },
  { id: '9', genre: 'Rock', image: require('../assets/images/ArtistSignUpFlow/rock.png') },
];

const GenreSelectionScreen = () => {
  const { selectedGenres, updateField } = useProfileStore();
  const [searchText, setSearchText] = useState("");

  const filteredGenres = genres.filter(genre =>
    genre.genre.toLowerCase().split(' ').some(word => word.startsWith(searchText.toLowerCase()))
  );

  // Initialize access token
  useEffect(() => {
    const initializeToken = async () => {
      const token = await tokenManager.getAccessToken();
      updateField('accessToken', token);
    };
    initializeToken();
  }, []);

  const handleGenreSelect = (genre) => {
    const isSelected = selectedGenres.some(g => g.id === genre.id);

    if (isSelected) {
      const updatedGenres = selectedGenres.filter(g => g.id !== genre.id);
      updateField('selectedGenres', updatedGenres);
    } else {
      const newSelection = [...selectedGenres, genre];
      updateField('selectedGenres', newSelection);
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
    // Navigate to the next screen
    router.push('userBasicInfoForm');
  };

  const renderGenreItem = ({ item }) => {
    const isSelected = selectedGenres.some(g => g.id === item.id);
    return (
      <TouchableOpacity
        style={styles.genreItem}
        onPress={() => handleGenreSelect(item)}
      >
        <Image source={item.image} style={styles.genreImage} />
        <Text style={[
          styles.genreText,
          isSelected && styles.selectedGenreText
        ]}>
          {item.genre}
        </Text>
        {isSelected && (
          <View style={styles.selectionBadge}>
            <Ionicons name="checkmark-sharp" size={16} color={Colors.black} />
          </View>
        )}
      </TouchableOpacity>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Bar */}
      <ProgressBar currentStep={0} totalSteps={4} />

      {/* Header and Search */}
      <Text style={styles.header}>Select music genre</Text>
      <Text style={styles.subHeader}>
        Choose {MIN_SELECTIONS} or more genres you like.
      </Text>

      {/* Search Bar with Clear Button */}
      <View style={styles.searchContainer}>
        <Image
          source={require('../assets/images/ArtistSignUpFlow/search.png')}
          style={[styles.searchIcon, { tintColor: 'black' }]}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your favorite genre"
          placeholderTextColor={Colors.black}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close" size={22} color={Colors.black} />
          </TouchableOpacity>
        )}
      </View>

      {/* Genre List */}
      {filteredGenres.length > 0 ? (
        <>
          <FlatList
            data={filteredGenres}
            renderItem={renderGenreItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={3}
          />
          {/* Next Button */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedGenres.length < MIN_SELECTIONS && styles.nextButtonDisabled
            ]}
            onPress={handleNext}
            disabled={selectedGenres.length < MIN_SELECTIONS}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No genre found</Text>
          <Image source={require('../assets/images/ArtistSignUpFlow/crying-emoji-9.gif')} style={styles.noResultsGif} />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#333',
    marginVertical: 10,
    borderRadius: 2,
  },
  progressBar: {
    width: '20%',
    height: '100%',
    backgroundColor: '#A020F0',
    borderRadius: 2,
  },
  header: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 8,
  },
  subHeader: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    marginVertical: 20,
    marginHorizontal: 26,
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.black,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
    paddingVertical: 8,
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
    height: '100%',
  },
  genreItem: {
    alignItems: 'center',
    margin: 20,
    width: 80,
    height: 80,
  },
  genreImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10,
  },
  selectedGenreText: {
    color: Colors.primary,
    fontWeight: '800',
  },
  selectionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '56%',
  },
  noResultsText: {
    fontSize: 18,
    color: Colors.white,
    marginBottom: 10,
    fontWeight: '900',
  },
  noResultsGif: {
    width: 150,
    height: 150,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 20,
  },
  nextButtonDisabled: {
    backgroundColor: '#333',
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default GenreSelectionScreen;