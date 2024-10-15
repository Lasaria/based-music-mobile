import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";

const ArtistProfileScreen = () => {
  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Large background image */}
          <View style={styles.largeImageContainer}>
            <Image
              source={require("../assets/images/profile2.png")}
              style={styles.largeImage}
            />

            {/* Small circular image */}
            <View style={styles.profileOverlay}>
              <Image
                source={require("../assets/images/profile.png")}
                style={styles.profileImage}
              />

              {/* Artist Name and Info */}
              <Text style={styles.artistName}>Jacob Lee</Text>
              <Text style={styles.artistInfo}>Artist / Musician / Writer</Text>
            </View>

            {/* Stats section */}
            <View style={{ flexDirection: "row", backfaceVisibility:'hidden' }}>
              <View style={[styles.statsOverlay, { paddingBottom: 40 }]}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>321k</Text>
                  <Text style={styles.statLabel}>followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>2.4M</Text>
                  <Text style={styles.statLabel}>streams</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>125</Text>
                  <Text style={styles.statLabel}>tracks</Text>
                </View>
              </View>
              <View style={styles.statsOverlay}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>#25</Text>
                  <Text style={styles.statLabel}>DMV</Text>
                </View>
                <View style={[styles.statItem, { paddingLeft: 25 }]}>
                  <Text style={styles.statValue}>#8</Text>
                  <Text style={styles.statLabel}>Virginia</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>#2</Text>
                  <Text style={styles.statLabel}>Arlignton</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inboxButton}>
              <Text style={styles.buttonText}>Inbox</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#000",
  },
  largeImageContainer: {
    position: "relative",
    width: "100%",
    height: 350,
  },
  container: {
    backgroundColor: "#000",
  },
  largeImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
    borderRadius: 10,
  },
  profileOverlay: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  artistName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  artistInfo: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  statsOverlay: {
    flexDirection: "row",
    justifyContent: "space-around",
    bottom: 2,
    position: "absolute",
    left: 0,
    right: 0,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#bbb",
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  uploadButton: {
    backgroundColor: "#6e00ff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  inboxButton: {
    backgroundColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ArtistProfileScreen;
