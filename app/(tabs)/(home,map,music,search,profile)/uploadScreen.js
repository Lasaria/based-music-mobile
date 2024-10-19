import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

const uploadScreen = () => {
  const router = useRouter();
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
    paddingTop: 55,
    paddingLeft: 30,
    position: "absolute",
    left: 0,
    top: 0,
  },
  arrowText: {
    color: "white",
    fontSize: 20,
  },
  container: { 
    justifyContent: "center",
     flex: 1,
      marginTop: "-70%"
     },
  uploadText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  additionalTextContainer: { 
    marginTop: 10, 
    alignItems: "center" 
  },
  textContainer: {
    color: "grey",
    fontSize: 14,
    margin: 2,
    textAlign: "center",
  },
});

export default uploadScreen;
