import React from "react";
import { TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchResultItem = ({ item, onPress }) => {
  const getIcon = () => {
    switch (item.type) {
      case "artist":
        return "person";
      case "venue":
        return "location";
      case "song":
        return "musical-notes";
      case "playlist":
        return "list";
      default:
        return "document";
    }
  };

  const getSubtitle = () => {
    switch (item.type) {
      case "song":
        return `${item.artist_name} • ${item.duration}`;
      case "playlist":
        return `${item.track_count} songs`;
      case "venue":
        return item.address;
      case "artist":
        return `${item.follower_count || 0} followers`;
      default:
        return "";
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <Image
        source={{
          uri:
            item.image_url ||
            item.cover_image_url ||
            "https://via.placeholder.com/50",
          headers: { "Cache-Control": "max-age=31536000" },
        }}
        style={[styles.image, item.type === "artist" && styles.artistImage]}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {item.title || item.name || "Untitled"}
        </Text>
        <View style={styles.subtitleContainer}>
          <Ionicons
            name={getIcon()}
            size={14}
            color="gray"
            style={styles.subtitleIcon}
          />
          <Text style={styles.subtitle} numberOfLines={1}>
            {getSubtitle()}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="gray" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  artistImage: {
    borderRadius: 25,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subtitleIcon: {
    marginRight: 4,
  },
  subtitle: {
    color: "gray",
    fontSize: 14,
    flex: 1,
  },
});

export default SearchResultItem;
