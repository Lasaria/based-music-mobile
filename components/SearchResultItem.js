import React, { useContext, useCallback, useState } from "react";
import SongItem from "./SongItem";
import { AudioContext } from "../contexts/AudioContext";

const SearchResultItem = ({ item, onPress, disablePlay = false }) => {
  const { updateCurrentTrack, togglePlayPause, isPlaying, currentTrackId } =
    useContext(AudioContext);
  const [isLoading, setIsLoading] = useState(false);

  // Input validation with detailed error handling
  if (!item) {
    console.error("[SearchResultItem] No item provided");
    return null;
  }

  const title = item.title || item.name;
  if (!title) {
    console.error("[SearchResultItem] Item missing required title/name:", item);
    return null;
  }

  // Determine if this is a song based on multiple possible properties
  const isSong =
    item.type === "song" ||
    item.content_type === "song" ||
    Boolean(item.track_id);

  // Extract the correct track ID based on item structure
  const getTrackId = useCallback(() => {
    if (item.track_id) return item.track_id;
    if (isSong && item.id) return item.id;
    return null;
  }, [item, isSong]);

  // Enhanced play handler with proper state management
  const handlePlay = async (e) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    const trackId = getTrackId();
    if (!trackId) {
      console.error("[SearchResultItem] Invalid track ID:", { item });
      return;
    }

    // Prevent double-loading
    if (isLoading) {
      console.log("[SearchResultItem] Already loading track, ignoring request");
      return;
    }

    try {
      setIsLoading(true);
      console.log("[SearchResultItem] Playing track:", {
        trackId,
        currentTrackId,
        isPlaying,
      });

      // If this track is already loaded, just toggle play/pause
      if (trackId === currentTrackId) {
        await togglePlayPause();
        return;
      }

      // Load and play new track
      await updateCurrentTrack(trackId);
      if (!isPlaying) {
        await togglePlayPause();
      }
    } catch (error) {
      console.error("[SearchResultItem] Error playing track:", {
        error,
        trackId,
        item,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For non-song items, use navigation handler
  if (!isSong) {
    return (
      <SongItem
        item={{
          ...item,
          title: title,
          artist_name: item.artist_name || item.artist || "",
          image_url: item.image_url || item.cover_image_url,
        }}
        onPress={() => onPress(item)}
        disablePlay={true}
        variant="search"
        showDuration={false}
        isLoading={isLoading}
      />
    );
  }

  // For songs, support both playback and navigation
  return (
    <SongItem
      item={{
        ...item,
        track_id: getTrackId(),
        title: title,
        artist_name: item.artist_name || item.artist || "",
        duration: item.duration || 0,
        image_url: item.image_url || item.cover_image_url,
      }}
      onPress={handlePlay}
      onNavigate={() => onPress(item)}
      disablePlay={disablePlay}
      variant="search"
      showArtist={true}
      showDuration={true}
      isLoading={isLoading}
      isActive={currentTrackId === getTrackId()}
      isPlaying={currentTrackId === getTrackId() && isPlaying}
    />
  );
};

export default SearchResultItem;
