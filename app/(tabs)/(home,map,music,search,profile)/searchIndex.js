import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  const [error, setError] = useState(null);

  const [paginationState, setPaginationState] = useState({
    hasMore: true,
    lastEvaluatedKey: null,
    loading: false,
    currentPage: 0,
  });

  // Refs for tracking component state
  const isMounted = useRef(true);
  const loadMoreInProgress = useRef(false);
  const currentSearchRef = useRef("");
  const activeFilterRef = useRef(activeFilter);

  useEffect(() => {
    console.log(
      "\n--------------------------!! SEARCH SCREEN MOUNTED !!-------------------------------"
    );
    isMounted.current = true;
    return () => {
      console.log(
        "\n--------------------------!! SEARCH SCREEN UNMOUNTED !!---------------------------"
      );
      isMounted.current = false;
      debouncedSearch.cancel();
    };
  }, []);

  // Keep activeFilterRef in sync
  useEffect(() => {
    activeFilterRef.current = activeFilter;
  }, [activeFilter]);

  // Perform the actual search operation
  const performSearch = useCallback(
    async (queryToSearch, isNewSearch = true) => {
      console.log("\n=== [START] SearchScreen.performSearch ===");

      if (!isMounted.current) {
        console.log("[SearchScreen] Component unmounted, aborting search");
        return;
      }

      // Use the current filter value from ref to avoid closure issues
      const currentFilter = activeFilterRef.current;

      console.log("[SearchScreen] Search parameters:", {
        query: queryToSearch,
        filter: currentFilter,
        isNewSearch,
        currentPage: paginationState.currentPage,
      });

      if (typeof queryToSearch !== "string" || !queryToSearch.trim()) {
        console.log("[SearchScreen] Search aborted: Empty query");
        setSearchResults([]);
        return;
      }

      if (paginationState.loading) {
        console.log("[SearchScreen] Search aborted: Search in progress");
        return;
      }

      try {
        setPaginationState((prev) => ({ ...prev, loading: true }));
        setError(null);

        const queryParams = new URLSearchParams({
          query: queryToSearch.trim(),
          type: currentFilter,
          limit: "20",
        });

        // Only include lastEvaluatedKey if this is not a new search and we have one
        if (!isNewSearch && paginationState.lastEvaluatedKey) {
          queryParams.append(
            "lastEvaluatedKey",
            paginationState.lastEvaluatedKey
          );
        }

        const requestUrl = `${MAIN_SERVER_URL}/search?${queryParams.toString()}`;
        console.log("[SearchScreen] Executing search:", {
          query: queryToSearch,
          filter: currentFilter,
          isNewSearch,
          url: requestUrl,
          page: paginationState.currentPage,
        });

        const response = await axiosGet({
          url: requestUrl,
          isAuthenticated: true,
        });

        console.log("[SearchScreen] Search results:", {
          query: queryToSearch,
          count: response?.items?.length || 0,
          hasMore: response?.pagination?.hasMore || false,
          newKey: !!response?.pagination?.lastEvaluatedKey,
        });

        if (!isMounted.current) {
          console.log(
            "[SearchScreen] Component unmounted during search, aborting update"
          );
          return;
        }

        if (!response) {
          throw new Error("Invalid response received");
        }

        setSearchResults((prev) =>
          isNewSearch ? response.items : [...prev, ...response.items]
        );

        setPaginationState((prev) => ({
          hasMore: response.pagination?.hasMore || false,
          lastEvaluatedKey: response.pagination?.lastEvaluatedKey || null,
          loading: false,
          currentPage: isNewSearch ? 0 : prev.currentPage + 1,
        }));
      } catch (err) {
        console.error("[SearchScreen] Search error:", {
          message: err.message,
          stack: err.stack,
        });

        if (!isMounted.current) return;

        setError("Failed to perform search");
        setPaginationState((prev) => ({
          ...prev,
          loading: false,
          hasMore: false,
        }));
      }
    },
    [paginationState.lastEvaluatedKey] // Remove activeFilter from dependencies
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((query, isNewSearch) => {
        console.log("[SearchScreen] Debounced search triggered:", {
          query,
          isNewSearch,
          filter: activeFilterRef.current,
          timestamp: new Date().toISOString(),
        });
        currentSearchRef.current = query;
        performSearch(query, isNewSearch);
      }, 250),
    [performSearch]
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (text) => {
      console.log("[SearchScreen] Search input changed:", {
        text,
        length: text.length,
        filter: activeFilterRef.current,
      });

      setSearchQuery(text);

      if (!text.trim()) {
        console.log("[SearchScreen] Clearing search results and state");
        setSearchResults([]);
        setPaginationState({
          hasMore: true,
          lastEvaluatedKey: null,
          loading: false,
          currentPage: 0,
        });
        debouncedSearch.cancel();
        return;
      }

      console.log("[SearchScreen] Resetting pagination for new search");
      setPaginationState({
        hasMore: true,
        lastEvaluatedKey: null,
        loading: false,
        currentPage: 0,
      });

      debouncedSearch(text, true);
    },
    [debouncedSearch]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (filter) => {
      console.log("[SearchScreen] Filter change requested:", {
        current: activeFilter,
        new: filter,
      });

      if (filter === activeFilter) {
        console.log("[SearchScreen] Filter unchanged, skipping update");
        return;
      }

      // Cancel any pending searches
      console.log("[SearchScreen] Cancelling pending searches");
      debouncedSearch.cancel();

      // Update filter and reset search state
      console.log("[SearchScreen] Updating filter and resetting search state");
      setActiveFilter(filter);
      setSearchResults([]);
      setPaginationState({
        hasMore: true,
        lastEvaluatedKey: null,
        loading: false,
        currentPage: 0,
      });

      // Only perform new search if there's a query
      if (searchQuery.trim()) {
        console.log("[SearchScreen] Initiating new search with filter:", {
          query: searchQuery,
          filter,
        });
        // Short timeout to ensure state updates have propagated
        setTimeout(() => {
          performSearch(searchQuery, true);
        }, 0);
      } else {
        console.log("[SearchScreen] No query present, skipping search");
      }
    },
    [activeFilter, searchQuery, performSearch, debouncedSearch]
  );

  // Handle infinite scroll
  const handleLoadMore = useCallback(() => {
    if (loadMoreInProgress.current) {
      console.log("[SearchScreen] Load more aborted: Already in progress");
      return;
    }

    if (
      !searchQuery.trim() ||
      !paginationState.hasMore ||
      paginationState.loading
    ) {
      console.log("[SearchScreen] Load more aborted:", {
        hasQuery: !!searchQuery.trim(),
        hasMore: paginationState.hasMore,
        isLoading: paginationState.loading,
      });
      return;
    }

    console.log("[SearchScreen] Loading more results", {
      page: paginationState.currentPage + 1,
      lastKey: paginationState.lastEvaluatedKey,
      filter: activeFilterRef.current,
    });

    loadMoreInProgress.current = true;
    performSearch(searchQuery, false).finally(() => {
      loadMoreInProgress.current = false;
    });
  }, [searchQuery, paginationState, performSearch]);

  // Navigation handler
  const navigateToDetail = useCallback(
    (item) => {
      console.log("[SearchScreen] Navigating to detail:", {
        type: item.type,
        id: item.id,
        timestamp: new Date().toISOString(),
      });

      const routes = {
        artist: {
          path: "/artistDetail",
          param: "artistId",
        },
        venue: {
          path: "/venueDetail",
          param: "venueId",
        },
        song: {
          path: "/songDetail",
          param: "songId",
        },
        playlist: {
          path: "/playlistDetail",
          param: "playlistId",
        },
      };

      const route = routes[item.type];
      if (route) {
        router.push({
          pathname: route.path,
          params: { [route.param]: item.id },
        });
      }
    },
    [router]
  );

  const keyExtractor = useCallback((item, index) => {
    // Create a unique key combining type, id, and index for absolute uniqueness
    const baseKey = item.id || item.venue_id || `index-${index}`;
    return `${item.type}-${baseKey}-${index}`;
  }, []);

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
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => {
          loadMoreInProgress.current = false;
        }}
        ListEmptyComponent={
          <SearchEmptyState
            query={searchQuery}
            isSearching={paginationState.loading}
          />
        }
        ListFooterComponent={
          paginationState.loading && (
            <ActivityIndicator color="purple" style={styles.loader} />
          )
        }
        contentContainerStyle={styles.listContainer}
      />
    </KeyboardAvoidingView>
  );
};

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
