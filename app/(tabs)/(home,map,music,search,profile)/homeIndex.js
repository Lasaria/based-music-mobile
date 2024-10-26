// HomeScreen.js

import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthService } from "../../../services/AuthService";
import { axiosGet, ApiError } from "../../../utils/axiosCalls";
import { router } from "expo-router";

const HomeScreen = ({}) => {
  const handleSignOut = async () => {
    try {
      await AuthService.signOut();
      router.replace("/welcome");
    } catch (err) {
      console.log("Error while signing out", err);
    }
  };

  const handleRefreshTokens = async () => {
    await AuthService.refreshTokens();
  };

  const playMusic = async () => {
    const startTime = Date.now();
    try {
      const res = await axiosGet({
        url: "http://localhost:3000/users/get-user-type/f48824d8-9011-7014-8f35-dfeb5f8f3f69",
        isAuthenticated: true,
        timeout: 5000,
      });
      const endTime = Date.now();
      console.log(`playMusic took ${endTime - startTime} ms`);
      console.log("API Response:", res);
      return res;
    } catch (error) {
      const endTime = Date.now();
      console.log(`playMusic failed after ${endTime - startTime} ms`);
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out after 10 seconds");
      } else if (
        error &&
        typeof error === "object" &&
        error.name === "ApiError"
      ) {
        console.error(
          "API Error:",
          error.message,
          "Status:",
          error.status,
          "Data:",
          error.data
        );
      } else {
        console.error("Unexpected error:", error);
      }
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Based Music!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
      <Button title="Refresh Tokens" onPress={handleRefreshTokens} />
      {/* Listener Profile Button */}
      <Button
        title="Listener Profile"
        onPress={() => router.push("/listenerProfile")}
      />
      <Button title="Music" onPress={playMusic} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
});
