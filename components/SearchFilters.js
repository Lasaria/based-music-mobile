import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";

const filters = [
  { id: "all", label: "All" },
  { id: "artists", label: "Artists" },
  { id: "venues", label: "Venues" },
  { id: "songs", label: "Songs" },
  { id: "playlists", label: "Playlists" },
];

const SearchFilters = ({ activeFilter, onFilterChange }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.activeFilter,
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Text
            style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeFilter: {
    backgroundColor: "purple",
    borderColor: "purple",
  },
  filterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default SearchFilters;
