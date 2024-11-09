import React, { useState, useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { axiosGet } from "../../../utils/axiosCalls";
import SearchFilters from "../../../components/SearchFilters";
import SearchResultItem from "../../../components/SearchResultItem";
import SearchEmptyState from "../../../components/SearchEmptyState";

const MAIN_SERVER_URL = "http://localhost:3000";

const SearchScreen = () => {
  console.log("\n=== [START] SearchScreen Component ===");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Perform the actual search operation with pagination support
  const performSearch = async (isNewSearch = true) => {
    console.log("\n=== [START] SearchScreen.performSearch ===");
    console.log("[SearchScreen] Search parameters:", {
      query: searchQuery,
      filter: activeFilter,
      isNewSearch,
      hasLastKey: !!lastEvaluatedKey,
    });

    if (!searchQuery.trim() || loading) {
      console.log("[SearchScreen] Search aborted:", {
        emptyQuery: !searchQuery.trim(),
        isLoading: loading,
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Construct query parameters
      const queryParams = new URLSearchParams({
        query: searchQuery,
        type: activeFilter,
        limit: "20",
      });

      // Add pagination key if continuing a previous search
      if (!isNewSearch && lastEvaluatedKey) {
        queryParams.append("lastEvaluatedKey", lastEvaluatedKey);
      }

      console.log("[SearchScreen] Executing search request:", {
        url: `${MAIN_SERVER_URL}/search?${queryParams.toString()}`,
      });

      const response = await axiosGet({
        url: `${MAIN_SERVER_URL}/search?${queryParams.toString()}`,
        isAuthenticated: true,
      });

      console.log("[SearchScreen] Search results received:", {
        count: response.items.length,
        hasMore: response.pagination.hasMore,
      });

      // Update results based on whether this is a new search or pagination
      setSearchResults((prev) =>
        isNewSearch ? response.items : [...prev, ...response.items]
      );
      setLastEvaluatedKey(response.pagination.lastEvaluatedKey);
      setHasMore(response.pagination.hasMore);
    } catch (err) {
      console.error("[SearchScreen] Search error:", {
        message: err.message,
        stack: err.stack,
      });
      setError("Failed to perform search");
    } finally {
      setLoading(false);
      console.log("=== [END] SearchScreen.performSearch ===\n");
    }
  };

  // Debounce search to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((isNewSearch) => performSearch(isNewSearch), 300),
    []
  );

  // Handle search input changes
  const handleSearchChange = (text) => {
    console.log("[SearchScreen] Search input changed:", { text });
    setSearchQuery(text);

    if (text.trim()) {
      // Reset search state for new query
      setSearchResults([]);
      setLastEvaluatedKey(null);
      setHasMore(true);
      debouncedSearch(true);
    } else {
      // Clear results when search is empty
      console.log("[SearchScreen] Clearing search results");
      setSearchResults([]);
    }
  };

  // Handle filter changes
  const handleFilterChange = (filter) => {
    console.log("[SearchScreen] Filter changed:", { filter });
    setActiveFilter(filter);

    if (searchQuery.trim()) {
      // Reset and perform new search with filter
      setSearchResults([]);
      setLastEvaluatedKey(null);
      setHasMore(true);
      performSearch(true);
    }
  };

  // Handle infinite scroll
  const handleLoadMore = () => {
    console.log("[SearchScreen] Load more triggered:", {
      hasMore,
      isLoading: loading,
    });
    if (hasMore && !loading) {
      debouncedSearch(false);
    }
  };

  // Handle navigation to detail screens
  const navigateToDetail = (item) => {
    console.log("[SearchScreen] Navigating to detail:", {
      type: item.type,
      id: item.id,
    });

    switch (item.type) {
      case "artist":
        router.push({
          pathname: "/artistDetail",
          params: { artistId: item.id },
        });
        break;
      case "venue":
        router.push({
          pathname: "/venueDetail",
          params: { venueId: item.id },
        });
        break;
      case "song":
        router.push({
          pathname: "/songDetail",
          params: { songId: item.id },
        });
        break;
      case "playlist":
        router.push({
          pathname: "/playlistDetail",
          params: { playlistId: item.id },
        });
        break;
    }
  };

  // Keep the rest of the component the same...
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="gray" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search artists, venues, songs..."
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearchChange("")}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
        <SearchFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </View>

      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <SearchResultItem item={item} onPress={navigateToDetail} />
        )}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <SearchEmptyState query={searchQuery} isSearching={loading} />
        }
        ListFooterComponent={
          loading && <ActivityIndicator color="purple" style={styles.loader} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </KeyboardAvoidingView>
  );
};

// Keep styles the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    backgroundColor: "#000",
    zIndex: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    margin: 16,
    padding: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  loader: {
    paddingVertical: 20,
  },
});

export default SearchScreen;
