import React, { useState, useCallback } from "react";
import { View, Switch, Text, StyleSheet, Alert, SafeAreaView, Image, Dimensions } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../services/AuthService";
import { Colors } from '../constants/Color';
import InputComponent from "../components/InputComponent";
import ButtonComponent from "../components/ButtonComponent";
import { Ionicons, Feather, AntDesign, SimpleLineIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('window');

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const GOOGLE_CLIENT_ID = "78783695276-rtd863qci0mdjj06kf3c4sp2k12trv7n.apps.googleusercontent.com";
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CLIENT_ID,
    iosClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    responseType: "id_token",
    scopes: ["profile", "email"],
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateInputs = useCallback(() => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError("Email is required");
    } else if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    }

    if (!password) {
      setPasswordError("Password is required");
    } else if (!passwordRegex.test(password)) {
      setPasswordError("Password must be at least 8 characters, 1 number, 1 special character, and 1 uppercase letter.");
    }
  }, [email, password]);

  const handleEmailPasswordSignIn = useCallback(async () => {
    validateInputs(); 

    if (emailError || passwordError) return; 

    try {
      await AuthService.signIn(email, password);
      navigation.navigate("Home");
    } catch (err) {
      Alert.alert(
        "Sign In Error",
        err.message || "An error occurred during sign-in."
      );
    }
  }, [email, password, emailError, passwordError, validateInputs, navigation]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const result = await promptAsync({ useProxy: true, showInRecents: true });
      if (result?.type === "success") {
        const { id_token } = result.params;
        console.log("ID Token:", id_token);

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
          navigation.navigate("Home");
        } else {
          throw new Error(data.error || "Failed to exchange token");
        }
      }
    } catch (error) {
      Alert.alert("Google Sign In Error", error.message || "An error occurred during Google sign-in.");
    }
  }, [promptAsync, navigation]);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInView}>
        {/* Welcome Back Title */}
        <Text style={styles.welcomeBackTitle}>Welcome Back</Text>
        {/* Small Music Logo */}
        <View style={styles.musicLogoContainer}>
          <Image
            source={require('../assets/images/music.png')}
            style={styles.musicLogo}
          />
        </View>

        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        {/* Email Input */}
        <InputComponent
          placeholder="Email"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          secureTextEntry={false}
        />

        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        {/* Password Input and Toggle Icon */}
        <View style={styles.inputWithIconContainer}>
          <InputComponent
            placeholder="Password"
            placeholderTextColor={Colors.secondary}
            value={password}
            onChangeText={setPassword}
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={Colors.secondary}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.togglePassIcon}
          />
        </View>

        {/* Sign in Controls */}
        <View style={styles.signInControls}>
          <View style={styles.switchControl}>
            {/* Switch Button */}
            <Switch
              trackColor={{ true: Colors.primary }}
              thumbColor={isEnabled ? Colors.white : Colors.gray}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
          {/* Forgot password Link */}
          <Text onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotPasswordText}>Forgot password?</Text>
        </View>

        {/* Sign in Button */}
        <ButtonComponent onPress={handleEmailPasswordSignIn} title={'Sign In'} buttonStyle={styles.signInButton} textStyle={styles.signInButtonText} />

        {/* Sign in with Socials */}
        <View style={styles.socialLayout}>
          <Text style={styles.signInWithSocialsText}>or sign in with</Text>
          <View style={styles.socialButtonContainer}>
            <ButtonComponent
              onPress={{}}
              title={<Feather name="facebook" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton} />
            <ButtonComponent
              onPress={handleGoogleSignIn}
              title={<SimpleLineIcons name="social-google" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton} />
            <ButtonComponent
              onPress={{}}
              title={<AntDesign name="apple-o" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton}
            />
          </View>
        </View>
        {/* Don't have an account */}
        <Text style={styles.noAccountText}>Don't have an account?
          <Text style={styles.boldSignUpText} onPress={() => navigation.navigate("SignUp")}> Sign Up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: width * 0.05,
  },
  signInView: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    gap: height * 0.02,
  },
  inputWithIconContainer: {
    position: 'relative',
    marginHorizontal: width * 0.01,
  },
  passwordInput: {
    paddingRight: 50, // Add space for the toggle icon
  },
  togglePassIcon: {
    position: 'absolute',
    right: 40,
    top: '50%',
    transform: [{ translateY: -12 }], // Align icon vertically
  },
  musicLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeBackTitle: {
    fontSize: width * 0.08,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  musicLogo: {
    height: height * 0.2,
    width: height * 0.2,
    resizeMode: 'contain',
  },
  signInButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    marginHorizontal: width * 0.05,
    height: height * 0.08,
    borderRadius: 15,
  },
  signInButtonText: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
  },
  signInControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
  },
  switchControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  rememberMeText: {
    color: Colors.white,
    fontSize: width * 0.035,
  },
  forgotPasswordText: {
    color: Colors.white,
    fontSize: width * 0.035,
  },
  socialLayout: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: width * 0.35,
  },
  signInWithSocialsText: {
    color: Colors.secondary,
    fontSize: width * 0.04,
  },
  socialButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: width * 0.05,
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height * 0.07,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: width * 0.15,
    width: height * 0.07,
  },
  boldSignUpText: {
    fontWeight: 'bold',
    color: Colors.white,
  },
  noAccountText: {
    textAlign: 'center',
    color: Colors.secondary,
    marginTop: height * 0.03,
    fontSize: width * 0.04,
  }
});

export default SignInScreen;
