import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { axiosGet } from '../utils/axiosCalls';
import { SERVER_URL } from "@env";

const PopularRecommendations = ({ onTrackPress }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async (pageNumber = 1) => {
    try {
      const isInitialLoad = pageNumber === 1;
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await axiosGet({
        url: `${SERVER_URL}/recommendations/popularity?page=${pageNumber}&limit=10`,
        isAuthenticated: true,
      });

      const newRecommendations = response.recommendations;
      
      if (newRecommendations.length === 0) {
        setHasMore(false);
      } else {
        setRecommendations(prev => 
          pageNumber === 1 ? newRecommendations : [...prev, ...newRecommendations]
        );
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchRecommendations(nextPage);
    }
  };

  const formatStreamCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="purple" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trending-up" size={24} color="purple" />
          <Text style={styles.title}>Popular Tracks</Text>
        </View>
        <Text style={styles.subtitle}>Based on stream count</Text>
      </View>

      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
      {recommendations.map((track, index) => (
        <TouchableOpacity
          key={`${track?.track_id?.S || index}-${index}`}
          style={styles.trackCard}
          onPress={() => onTrackPress(track)}
        >
          <Image
            source={{
              uri: track?.cover_image_url?.S || 'https://via.placeholder.com/150',
            }}
            style={styles.trackImage}
          />
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {track?.title?.S || 'Untitled Track'}
            </Text>
            <View style={styles.statsContainer}>
              <Ionicons name="play" size={14} color="gray" />
              <Text style={styles.streamCount}>
                {formatStreamCount(track?.stream_count || 0)} plays
              </Text>
            </View>
            <View style={styles.genreTag}>
              <Text style={styles.genreText}>{track?.genre?.S || 'Unknown Genre'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
        
        {hasMore && (
          <TouchableOpacity
            style={styles.loadMoreCard}
            onPress={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator color="purple" size="small" />
            ) : (
              <>
                <Ionicons name="arrow-forward-circle" size={32} color="purple" />
                <Text style={styles.loadMoreText}>Load More</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = {
  container: {
    marginVertical: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  trackCard: {
    width: 150,
    marginRight: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    overflow: 'hidden',
  },
  trackImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  trackInfo: {
    padding: 12,
  },
  trackTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streamCount: {
    color: 'gray',
    fontSize: 12,
    marginLeft: 4,
  },
  genreTag: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  genreText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  loadMoreCard: {
    width: 150,
    height: 220,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  loadMoreText: {
    color: 'white',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
};

export default PopularRecommendations;