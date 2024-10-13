import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Alert, Dimensions, SafeAreaView, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { AuthService } from "../services/AuthService";
import { axiosPost } from "../utils/axiosCalls";
import { Colors } from "../constants/Color";
import InputComponent from "../components/InputComponent";
import { Ionicons, Feather, AntDesign, SimpleLineIcons } from '@expo/vector-icons';
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import ButtonComponent from "../components/ButtonComponents";


WebBrowser.maybeCompleteAuthSession();
const { width, height } = Dimensions.get('window');

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID =
  "78783695276-rtd863qci0mdjj06kf3c4sp2k12trv7n.apps.googleusercontent.com";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(false);
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    // iosClientId: "com.googleusercontent.apps.78783695276-rtd863qci0mdjj06kf3c4sp2k12trv7n",
    // expoClientId: GOOGLE_CLIENT_ID,
    // webClientId: GOOGLE_CLIENT_ID,
    // responseType: "id_token",
    scopes: ["profile", "email", "openid"],
  });


  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    }
  }, [response]);


  const handleGoogleSignIn = useCallback(async (idToken) => {
    console.log(idToken)
    try {
      const result = await AuthService.googleSignIn(idToken);
      console.log(result);
      if (result.userCreated) {
        navigation.navigate("UserTypeChoice");
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert(
        "Sign In Error",
        error.message || "An error occurred during Google sign-in."
      );
    }
  }, [navigation]);


  const validateInputs = () => {
    setEmailError('');
    setPasswordError('');
    setErrorMessage('');

    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid; // Return whether the inputs are valid
  };

  const handleEmailPasswordSignIn = useCallback(async () => {
    // Validate inputs
    const isValid = validateInputs();

    if (!isValid) return; // If not valid, exit the function

    setLoading(true) // Start loading

    try {
      await AuthService.signIn(email, password);
      navigation.navigate("Home");
      // Reset EMAIL and PASSWORD input fields
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during sign-in.');
    } finally {
      setLoading(false); // Stop loading
    }
  }, [email, password, navigation]);

  // Handle changes in the email input
  const handleEmailChange = (text) => {
    setEmail(text);
    if (text) {
      setEmailError(''); // Clear email error when user starts typing
    }
  };

  // Handle changes in the password input
  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text) {
      setPasswordError(''); // Clear password error when user starts typing
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInView}>
        <Text style={styles.welcomeBackTitle}>Welcome Back</Text>
        <View style={styles.musicLogoContainer}>
          <Image source={require('../assets/images/music.png')} style={styles.musicLogo} />
        </View>

        {errorMessage ? <Text style={styles.errorMessageText}>{errorMessage}</Text> : null}
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <InputComponent
          placeholder="Email"
          placeholderTextColor={Colors.secondary}
          value={email}
          onChangeText={handleEmailChange} // Updated to handle email change
          keyboardType="email-address"
          autoCapitalize="none"
          secureTextEntry={false}
          emailError={emailError}
        />

        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        <View style={styles.inputWithIconContainer}>
          <InputComponent
            placeholder="Password"
            placeholderTextColor={Colors.secondary}
            value={password}
            onChangeText={handlePasswordChange} // Updated to handle password change
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            passwordError={passwordError}
            style={styles.passwordInput}
          />
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={24}
            color={Colors.secondary}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.togglePassIcon}
          />
        </View>

        <View style={styles.signInControls}>
          <View style={styles.radioButtonControl}>
            <RadioButtonGroup
              containerStyle={{ marginBottom: 10 }}
              selected={''}
              onSelected={() => setCurrent(!current)}
              radioBackground={Colors.primary}
            >
              {current ? (
                <RadioButtonItem
                  value={true}
                  label={<Text style={styles.rememberMeText}>Remember Me</Text>}
                />
              ) : (
                <RadioButtonItem
                  value={false}
                  label={<Text style={styles.rememberMeText}>Remember Me</Text>}
                />
              )}
            </RadioButtonGroup>
          </View>
          <Text onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotPasswordText}>Forgot password?</Text>
        </View>

        <ButtonComponent onPress={handleEmailPasswordSignIn} title={'Sign In'} buttonStyle={styles.signInButton} textStyle={styles.signInButtonText} />

        <View style={styles.socialLayout}>
          <Text style={styles.signInWithSocialsText}>or sign in with</Text>
          <View style={styles.socialButtonContainer}>
            <ButtonComponent
              onPress={{}}
              title={<Feather name="facebook" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton} />
            <ButtonComponent
              onPress={() => promptAsync()}
              title={<SimpleLineIcons name="social-google" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton} />
            <ButtonComponent
              onPress={{}}
              title={<AntDesign name="apple-o" size={24} color={Colors.white} />}
              buttonStyle={styles.socialButton}
            />
          </View>
        </View>

        <Text style={styles.noAccountText}>Don't have an account?
          <Text style={styles.boldSignUpText} onPress={() => navigation.navigate("SignUp")}> Sign Up</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: width * 0.04,
    color: Colors.error,
    marginLeft: width * 0.11,
    marginBottom: -width * 0.02,
  },
  errorMessageText: {
    fontSize: width * 0.04,
    color: Colors.error,
    textAlign: 'center',
  },
  signInView: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    gap: height * 0.02,
  },
  inputWithIconContainer: {
    position: 'relative',
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
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  signInControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: width * 0.05,
  },
  radioButtonControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  rememberMeText: {
    color: Colors.white,
    fontSize: width * 0.030,
  },
  forgotPasswordText: {
    color: Colors.white,
    fontSize: width * 0.030,
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default SignInScreen;