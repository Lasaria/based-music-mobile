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
import * as ImagePicker from 'expo-image-picker';

const ArtistProfileScreen = () => {
  // Use state to manage the users' data
  const [followers, setFollowers] = useState("321k");
  const [streams, setStreams] = useState("2.4M");
  const [tracks, setTracks] = useState("125");
  const [area1, setArea1] = useState("#25");
  const [area2, setArea2] = useState("#8");
  const [area3, setArea3] = useState("#2");


  const navigation = useNavigation();
  console.log(navigation);
  
  // State for storing the selected profile image
  const [profileImage, setProfileImage] = useState(require("../assets/images/profile.png"));

  // Function to pick an image from the device
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage({ uri: result.uri });
    }
  };

  const inboxScreen = () => {
    console.log('hello');
    
    navigation.navigate("ArtistInbox");
  }
  

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

            {/* Small circular image with edit button */}
            <View style={styles.profileOverlay}>
              <Image source={profileImage} style={styles.profileImage} />
              <TouchableOpacity onPress={pickImage} style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>

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
                  <Text style={styles.statValue}>{tracks}</Text>
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
            <TouchableOpacity style={styles.uploadButton}>
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.inboxButton} onPress={inboxScreen}>
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
    marginTop:5,
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
    marginTop:60,
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
