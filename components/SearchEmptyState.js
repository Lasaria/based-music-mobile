import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchEmptyState = ({ query, isSearching = false }) => {
  if (isSearching) return null;

  return (
    <View style={styles.container}>
      {query ? (
        <>
          <Ionicons name="search" size={64} color="gray" />
          <Text style={styles.title}>No results found</Text>
          <Text style={styles.subtitle}>
            We couldn't find anything matching "{query}"
          </Text>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color="gray" />
          <Text style={styles.title}>Search Based Music</Text>
          <Text style={styles.subtitle}>
            Find artists, venues, songs, and playlists
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "gray",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
});

export default SearchEmptyState;
