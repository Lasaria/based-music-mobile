import React from "react";
import SongItem from "./SongItem";

const SearchResultItem = ({ item, onPress, disablePlay = false }) => {
  if (!item || (!item.title && !item.name)) {
    console.warn("[SearchResultItem] Invalid item data:", item);
    return null;
  }

  // For non-song items, render the original component structure
  if (item.type !== "song" && item.content_type !== "song") {
    return (
      <SongItem
        item={item}
        onPress={onPress}
        disablePlay={true}
        variant="search"
        showDuration={false}
      />
    );
  }

  // For songs, use the SongItem component with full functionality
  return (
    <SongItem
      item={item}
      onPress={onPress}
      disablePlay={disablePlay}
      variant="search"
      showArtist={true}
      showDuration={true}
    />
  );
};

export default SearchResultItem;
