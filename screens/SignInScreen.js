import React, { useState, useCallback } from "react";
import { View, TextInput, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-elements";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import jwtDecode from "jwt-decode";
import { signIn } from "../services/AuthService";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "78783695276-rtd863qci0mdjj06kf3c4sp2k12trv7n.apps.googleusercontent.com";
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });

const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Token,
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }
  );

  return { request, response, promptAsync };
};

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { promptAsync } = useGoogleAuth();

  const handleEmailPasswordSignIn = useCallback(async () => {
    try {
      await signIn(email, password);
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
      const result = await promptAsync();
      if (result.type === "success") {
        const { access_token } = result.params;
        const decodedToken = jwtDecode(access_token);
        console.log("User Info:", decodedToken);

        const backendResponse = await fetch(
          "http://your-backend-url/google-auth",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: access_token }),
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
