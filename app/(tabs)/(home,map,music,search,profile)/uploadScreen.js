import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const uploadScreen = () => {


  return (
    <View style={styles.view}>
      <StatusBar style="light" />

      <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
        <Text style={styles.arrowText}>←</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.uploadText}> Upload</Text>
        <View style={styles.additionalTextContainer}>
          <Text style={styles.textContainer}>
            Upload your creations, and show the world
          </Text>
          <Text style={styles.textContainer}>your talent!</Text>
        </View>

        <TouchableOpacity style={styles.uploadTrackConatiner} onPress={() => router.push("/uploadTrackScreen")}>
          <View style={styles.trackView}>
            <MaterialIcons name="done-outline" color="white"  />
            <Text style={styles.trackText}>Upload Track</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.uploadAlbumConatiner} onPress={() => router.push("/uploadAlbumScreen")}>
          <View style={styles.trackView}>
            <MaterialIcons name="done-outline"  color="white"/>
            <Text style={styles.trackText}> Upload Album</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    backgroundColor: "black",
    flex: 1,
  },
  backArrow: {
    paddingTop: 65,
    paddingLeft: 40,
    position: "absolute",
    left: 5,
    top: 5,
  },
  arrowText: {
    color: "white",
    fontSize: 20,
  },
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems:'center'
  },
  uploadText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  additionalTextContainer: {
    marginTop: 10,
    alignItems: "center",
    marginBottom:60,
  },
  textContainer: {
    color: "grey",
    fontSize: 14,
    margin: 2,
    textAlign: "center",
  },
  uploadTrackConatiner: {
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "#6F2CFF",
    alignItems: "center",
    width: 180,
    height: 50,
    margin: 5,
    marginBottom:20,
    justifyContent: "center",
  },
  uploadAlbumConatiner: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom:"50%",
    backgroundColor: "#6F2CFF",
    alignItems: "center",
    width: 180,
    height: 50,
    margin: 5,
    justifyContent: "center",
  },
  trackView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign:'center'
  },
  trackText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5,
    textAlign: "center",
  },
});

export default uploadScreen;
