import React, { useState, useCallback } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../services/AuthService";

WebBrowser.maybeCompleteAuthSession();

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID =
  "78783695276-rtd863qci0mdjj06kf3c4sp2k12trv7n.apps.googleusercontent.com";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    responseType: "id_token",
    scopes: ["profile", "email"],
  });

  const handleEmailPasswordSignIn = useCallback(async () => {
    try {
      await AuthService.signIn(email, password);
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert(
        "Sign In Error",
        err.message || "An error occurred during sign-in."
      );
    }
  }, [email, password, navigation]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await promptAsync({ useProxy: true, showInRecents: true });
      if (result?.type === "success") {
        const { id_token } = result.params;
        console.log("ID Token:", id_token);

        // Send the ID token to your backend
        const backendResponse = await fetch(
          "http://your-backend-url/google-auth",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: id_token }),
          }
        );

        const data = await backendResponse.json();
        if (backendResponse.ok) {
          console.log("AWS credentials received:", data.credentials);
          navigation.navigate("Home");
        } else {
          throw new Error(data.error || "Failed to exchange token");
        }
      }
    } catch (error) {
      Alert.alert(
        "Google Sign In Error",
        error.message || "An error occurred during Google sign-in."
      );
    }
  }, [promptAsync, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Sign In"
        onPress={handleEmailPasswordSignIn}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
      <Button
        title="Sign in with Google"
        onPress={handleGoogleSignIn}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
      <Button
        title="Don't have an account? Sign Up"
        type="clear"
        onPress={() => navigation.navigate("SignUp")}
      />
      <Button
        title="Forgot Password?"
        type="clear"
        onPress={() => navigation.navigate("ForgotPassword")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
});

export default SignInScreen;
