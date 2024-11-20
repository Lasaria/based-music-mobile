import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { axiosGet } from '../utils/axiosCalls';

const LibraryItem = ({ 
  item, 
  isPlaying, 
  trackInfo, 
  onPlay,
  SERVER_URL 
}) => {
  const [playlistData, setPlaylistData] = useState(null);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (item.content_type === 'playlist' && item.content_id) {
        setIsLoadingPlaylist(true);
        try {
          const response = await axiosGet({
            url: `${SERVER_URL}/playlists?playlist_id=${item.content_id}`,
            isAuthenticated: true,
          });
          console.log('Playlist data:', response);
          if(response?.playlist && response.playlist.songs?.length > 0){
            setPlaylistData(response);
          }else {
            console.warn(`Skipping playlist with no songs or not found: ${item.content_id}`);
          }
      
        } catch (error) {
          console.error('Error fetching playlist:', error);
        } finally {
          setIsLoadingPlaylist(false);
        }
      }
    };

    fetchPlaylistData();
  }, [item.playlist_id, item.content_type, SERVER_URL]);

  const formatDuration = (duration) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isCurrentTrack = trackInfo?.track_id === item.track_id;
  const showPlayingState = isCurrentTrack && isPlaying;

  const getTitle = () => {
    switch (item.content_type) {
        case "playlist":
            return playlistData?.playlist.title || item.title || "Untitled";
        case "song":
            return item.title || "Untitled";
        case "album":
            return item.title || "Untitled";
        case "artist":
            return item.artist_name || "Untitled";
        default:
            return "Untitled";
    }
};

  const getSubtitle = () => {
    console.log('item:', item);
    console.log('playlistData:', playlistData);
    switch (item.content_type) {
      case "playlist":
        if (isLoadingPlaylist) return "Loading...";
        if (playlistData) {
          return `${playlistData.playlist.songs.length} songs`;
        }
        return "No songs";
        
      case "song":
        return `${item.artist_name} • ${formatDuration(item.duration)}`;
      case "album":
        return `${item.artist_name} • ${item.track_count || 0} tracks`;
      case "artist":
        return `${item.total_albums || 0} albums • ${
          item.total_tracks || 0
        } tracks`;
      default:
        return "";
    }
  };

   // Skip rendering if the playlist has no songs
   if (item.content_type === "playlist" && (!playlistData || playlistData.playlist.songs.length < 1)) {
    return null;
  }

  return (
    <View style={styles.libraryItem}>
      <Image
        source={{
          uri: item.cover_image_url || item.image_url || "https://via.placeholder.com/50",
          headers: { "Cache-Control": "max-age=31536000" },
        }}
        style={[
          styles.itemImage,
          item.content_type === "artist" && styles.artistImage,
        ]}
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {getTitle()}
        </Text>
        <View style={styles.subtitleContainer}>
          {isLoadingPlaylist ? (
            <ActivityIndicator size="small" color="purple" />
          ) : (
            <Text style={styles.itemSubtitle} numberOfLines={1}>
              {getSubtitle()}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onPlay(item)}
        style={styles.playButton}
      >
        <Ionicons
          name={
            item.content_type === "artist"
              ? "chevron-forward"
              : showPlayingState
              ? "pause"
              : "play"
          }
          size={24}
          color={isCurrentTrack ? "purple" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  libraryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  artistImage: {
    borderRadius: 25,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  subtitleContainer: {
    height: 20,
    justifyContent: 'center',
  },
  itemSubtitle: {
    color: 'gray',
    fontSize: 14,
  },
  playButton: {
    padding: 10,
  },
});

export default LibraryItem;