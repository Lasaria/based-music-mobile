import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import { router } from "expo-router";

const ArtistProfileScreen = () => {
  const [followers, setFollowers] = useState("321k");
  const [streams, setStreams] = useState("2.4M");
  const [track, setTracks] = useState("125");
  const [area1, setArea1] = useState("#25");
  const [area2, setArea2] = useState("#8");
  const [area3, setArea3] = useState("#2");

  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(
    require("../../../assets/images/profile.png")
  );

  const [isMusicSelected, setIsMusicSelected] = useState(true);

  // Sample data for tracks and albums
  const tracks = [
    {
      id: "1",
      title: "Best friend",
      artist: "Luna bay",
      duration: "3:24",
      imageUri: require("../../../assets/images/profile7.jpg"),
    },
    {
      id: "2",
      title: "Odd one out",
      artist: "Bod Moses",
      duration: "3:24",
      imageUri: require("../../../assets/images/profile3.jpg"),
    },
    {
      id: "3",
      title: "Need you now",
      artist: "Joji",
      duration: "3:24",
      imageUri: require("../../../assets/images/profile4.jpg"),
    },
  ];

  const albums = [
    {
      id: "1",
      title: "Desert rose",
      artist: "Lady A",
      imageUri: require("../../../assets/images/profile.png"),
    },
    {
      id: "2",
      title: "Infinity",
      artist: "Labirinth",
      imageUri: require("../../../assets/images/profile2.jpg"),
    },
    {
      id: "3",
      title: "Not Like US",
      artist: "kendrick",
      imageUri: require("../../../assets/images/profile5.jpg"),
    },
    {
      id: "4",
      title: "Beliver",
      artist: "Sabrina",
      imageUri: require("../../../assets/images/profile3.jpg"),
    },
  ];

  const beats = [
    {
      id: "1",
      title: "Instrument 3",
      artist: "Artist",
      price: "$32.00",
      popular: true,
      imageUri: require("../../../assets/images/beats1.png"),
    },
    {
      id: "2",
      title: "Instrument 1",
      artist: "Artist",
      price: "$0.00",
      free: true,
      imageUri: require("../../../assets/images/beats2.png"),
    },
    {
      id: "3",
      title: "Instrument 2",
      artist: "Artist",
      price: "$32.00",
      imageUri: require("../../../assets/images/profile2.jpg"),
    },
  ];

  const handleMusicToggle = () => {
    setIsMusicSelected(true);
  };

  const handleAboutToggle = () => {
    setIsMusicSelected(false);
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Large background image */}
          <View style={styles.largeImageContainer}>
            <Image
              source={require("../../../assets/images/profile1.png")}
              style={styles.largeImage}
            />

            {/* Small circular image with edit button */}
            <View style={styles.profileOverlay}>
              <Image source={profileImage} style={styles.profileImage} />

              {/* Artist Name and Info */}
              <Text style={styles.artistName}>Jacob Lee</Text>
              <Text style={styles.artistInfo}>Artist / Musician / Writer</Text>
            </View>

            {/* Stats section */}
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.statsOverlay, { paddingBottom: 40 }]}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{followers}</Text>
                  <Text style={styles.statLabel}>followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{streams}</Text>
                  <Text style={styles.statLabel}>streams</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{track}</Text>
                  <Text style={styles.statLabel}>tracks</Text>
                </View>
              </View>
              <View style={styles.statsOverlay}>
                <View style={[styles.statItem, { paddingLeft: 10 }]}>
                  <Text style={styles.statValue}>{area1}</Text>
                  <Text style={styles.statLabel}>DMV</Text>
                </View>
                <View style={[styles.statItem, { paddingLeft: 20 }]}>
                  <Text style={styles.statValue}>{area2}</Text>
                  <Text style={styles.statLabel}>Virginia</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{area3}</Text>
                  <Text style={styles.statLabel}>Arlington</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={() => router.push('/uploadScreen')}>
              <View style={{ flexDirection: "row" }}>
                <Icon name="upload" color="white" />
                <Text style={styles.buttonText}>Upload</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.inboxButton}
              onPress={() => router.push("/artistInboxScreen")}
            >
              <View style={{ flexDirection: "row" }}>
                <Icon name="mail" color="white" />
                <Text style={styles.buttonText}>Inbox</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Music/About Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isMusicSelected && styles.activeButton,
              ]}
              onPress={handleMusicToggle}
            >
              <Text
                style={[
                  styles.toggleText,
                  isMusicSelected && styles.activeText,
                ]}
              >
                Music
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isMusicSelected && styles.activeButton,
              ]}
              onPress={handleAboutToggle}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isMusicSelected && styles.activeText,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content under the toggle */}
          {isMusicSelected ? (
            <>
              {/* Tracks Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>TRACKS</Text>
                {tracks.map((track) => (
                  <View key={track.id} style={styles.trackItem}>
                    <Image source={track.imageUri} style={styles.trackImage} />
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle}>{track.title}</Text>
                      <Text style={styles.trackArtist}>{track.artist}</Text>
                    </View>
                    <Text style={styles.trackDuration}>{track.duration}</Text>
                  </View>
                ))}
              </View>

              {/* Albums Section */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>ALBUMS</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {albums.map((album) => (
                    <View key={album.id} style={styles.albumItem}>
                      <Image
                        source={album.imageUri}
                        style={styles.albumImage}
                      />
                      <Text style={styles.albumTitle}>{album.title}</Text>
                      <Text style={styles.albumArtist}>{album.artist}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/** Beats sections */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Beats</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {beats.map((beat) => (
                    <View key={beat.id} style={styles.beatItem}>
                      <Image
                        source={beat.imageUri}
                        style={styles.beatImage} 
                      />
                         <Text style={styles.beatPrice}>{beat.price}</Text>
                      <Text style={styles.beatTitle}>{beat.title}</Text>
                      <Text style={styles.beatArtist}>{beat.artist}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </>
          ) : (
            <View>
              {/* About Section */}
              <Text style={styles.aboutText}>
                This is the about section content.
              </Text>
            </View>
          )}
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
    height: 300,
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
  editButton: {
    marginTop: 10,
    backgroundColor: "#6e00ff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  artistName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
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
    marginTop: 60,
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
    marginLeft: 5,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeButton: {
    borderColor: "#6e00ff",
  },
  toggleText: {
    color: "#fff",
    fontSize: 16,
  },
  activeText: {
    color: "#6e00ff",
    fontWeight: "bold",
  },
  sectionContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    width: "100%",
    padding: 5,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  trackInfo: {
    marginLeft: -70,
    justifyContent: "space-around",
  },
  trackTitle: {
    color: "#fff",
    fontSize: 16,
  },
  trackArtist: {
    color: "#bbb",
    fontSize: 14,
  },
  trackDuration: {
    color: "#bbb",
    fontSize: 12,
    marginLeft: 100,
    textAlign: "right",
    justifyContent: "flex-end",
  },
  albumItem: {
    marginRight: 10,
    alignItems: "center",
  },
  albumImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    marginBottom: 5,
  },
  albumTitle: {
    color: "#fff",
    fontSize: 14,
  },
  albumArtist: {
    color: "#bbb",
    fontSize: 12,
  },
  aboutText: {
    color: "#fff",
    fontSize: 16,
    padding: 20,
  },
  beatItem: {
    marginRight: 10,
    alignItems: "center",
  },
  beatImage: {
    width: 80,
    height: 70,
    borderRadius: 10,
    marginBottom: 5,
  },
  beatTitle: {
    color: "#fff",
    fontSize: 14,
  },
  beatArtist: {
    color: "#bbb",
    fontSize: 12,
  },
  beatPrice: {
    color: "blue",
    fontSize: 12,
  },
});

export default ArtistProfileScreen;
