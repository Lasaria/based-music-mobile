import React from "react";
import { View, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import SongItem from "./SongItem";

const SongList = ({
  songs,
  loading = false,
  onEndReached,
  ListHeaderComponent,
  ListEmptyComponent,
  onPlay,
}) => {
  if (loading && songs.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <SongItem
      item={item}
      variant="detailed"
      showArtist={true}
      showDuration={true}
      showPlayCount={true}
      onPlay={() => onPlay?.(item)}
    />
  );

  return (
    <FlatList
      data={songs}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.content_type}-${item.content_id}`}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        loading ? (
          <ActivityIndicator color="purple" style={styles.loader} />
        ) : null
      }
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 100,
  },
  loader: {
    marginVertical: 20,
  },
});

export default SongList;
