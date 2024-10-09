// SignUpScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { AuthService } from '../services/AuthService';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Optional
  const [errorMessage, setErrorMessage] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loadingFonts, setLoadingFonts] = useState(true);

  // Error states for each input field
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
 
  const loadFonts = async () => {
    await Font.loadAsync({
      'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'), // Adjust the path accordingly
      'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'), // Adjust the path accordingly
    });
    setLoadingFonts(false); // Set loading to false after fonts are loaded
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };
  
  // Function to validate each field
  const validateFullName = (text) => {
    if (!text.includes(' ')) {
      setFullNameError('Please enter your full name (first and last name).');
    } else {
      setFullNameError('');
    }
  };
  
  const validateEmail = (text) => {
    if (!isValidEmail(text)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };
  
  const validatePassword = (text) => {
    if (!isValidPassword(text)) {
      setPasswordError('Password must be at least 8 characters, include a number and a special character.');
    } else {
      setPasswordError('');
    }
  };

  const validateForm = () => {
    const isFullNameValid = fullName.includes(' ');
    const isEmailValid = isValidEmail(email);
    const isPasswordValid = isValidPassword(password);
    const isTermsChecked = termsChecked;
    if (!termsChecked) {
      setTermsError('You must agree to the Terms & Conditions.');
      isValid = false;
    } else {
      setTermsError('');
    }
    setIsFormValid(isFullNameValid && isEmailValid && isPasswordValid && isTermsChecked);
  };

  useEffect(() => {
    validateForm(); // Validate the form whenever any input changes
  }, [fullName, email, password, termsChecked]);

  const handleSignUp = async () => {
    try {
      const formattedPhoneNumber = phoneNumber ? `+1${phoneNumber.replace(/\D/g, '')}` : null;

      await AuthService.signUp(fullName, email, password);
      console.log('Sign up successful');
      navigation.navigate('ConfirmSignUp', { email });
    } catch (err) {
      console.error('Sign up error:', err.message);
      //setErrorMessage(err.message || 'An error occurred during sign-up.');
    }
  };

  // Function to open terms and conditions link
  const openTermsLink = () => {
    const termsUrl = 'https://www.example.com/terms-and-conditions'; // terms link
    Alert.alert('Terms and Conditions', 'You can view the terms and conditions at ' + termsUrl, [{ text: 'Ok' }]);
  };

  if (loadingFonts) {
    return null; // or a loading spinner
  }

  return (
    <View style={styles.container}>
      {/* Ensure the status bar is visible and set its style */}
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {/* Back Arrow Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonContainer}>
        <View style={styles.backButton}>
          <Ionicons name="arrow-back" size={18} color="#fff" />
        </View>
      </TouchableOpacity>

      <Text style={[styles.title, { fontFamily: 'OpenSans-Bold' }]}>Sign up </Text>
      <Text style={styles.message}>Fill the form to create an account</Text>

      {/* Global Error Message */}
      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a full name"
          placeholderTextColor="#999"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            validateFullName(text); // Validate full name specifically
          }}
          onFocus={() => setIsFullNameFocused(true)}
          onBlur={() => {
            setIsFullNameFocused(false);
            validateFullName(fullName); // Validate on blur to show error if any
          }}
        />
      </View>
    {isFullNameFocused && fullNameError !== '' && <Text style={styles.errorText}>{fullNameError}</Text>}

    {/* Email Input */}
    <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          placeholderTextColor="#999"
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => {
            setEmail(text);
            validateEmail(text); // Validate email specifically
          }}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => {
          setIsEmailFocused(false);
          validateEmail(email); // Validate on blur to show error if any
        }}
      />
    </View>
    {isEmailFocused && emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}

    {/* Password Input */}
    <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          value={password}
          secureTextEntry
          onChangeText={(text) => {
            setPassword(text);
            validatePassword(text); // Validate password specifically
          }}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => {
            setIsPasswordFocused(false);
            validatePassword(password); // Validate on blur to show error if any
          }}
        />
      </View>
    {isPasswordFocused && passwordError !== '' && <Text style={styles.errorText}>{passwordError}</Text>}


      {/* Terms & Conditions */}
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setTermsChecked(!termsChecked)}>
          <Text style={termsChecked ? styles.checkedBox : styles.checkbox}>
            {termsChecked ? '☑' : '☐'}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.termsText, { fontFamily: 'OpenSans-Regular' }]}>
          By selecting the checkbox, I agree to <Text style={styles.link} onPress={openTermsLink}>
            the Terms of service and Privacy Policy</Text>
        </Text>
      </View>
      {termsError !== '' && <Text style={styles.errorText}>{termsError}</Text>}

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[styles.button, !isFormValid && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={!isFormValid} // Disable button if form is invalid
      >
        <Text style={[styles.buttonText, { fontFamily: 'OpenSans-Regular' }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#000000',
  },
  backButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40, // Set width
    height: 40, // Set height
    borderWidth: 1,
    borderColor: '#fff', // Border color
    borderRadius: 15, // Half of width and height for circular shape
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    lineheight: 24,
    fontSize: 28,
    color: '#fff',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#cccccc',
    lineHeight: 20,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
    color: '#000',
  },
  input: {
    height: 52,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 14,
    lineHeight: 20,
    fontSize: 14,
    color: '#FFFFFF',
  },
  label: {
    fontSize: 12,
    color: '#FFFFFF',  // Text color
    backgroundColor: '#000',  // Black background
    paddingHorizontal: 10,  // Horizontal padding for the label text
    position: 'absolute',
    top: -10,  // Adjust this to position the label on top of the border
    left: 7,  // Adjust this to center the label on the border horizontally
    zIndex: 1,  // Ensures the label stays on top of the border
  },
  termsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  checkbox: {
    marginRight: 8,
    color: '#fff',
    fontSize: 18,
  },
  checkedBox: {
    marginRight: 8,
    color: '#fff',
    fontSize: 18,
  },
  termsText: {
    color: '#fff',
    fontWeight: '400',
  },
  link: {
    color: '#6F2CFF',
    fontWeight: '800',
  },
  errorText: {
    color: 'red',
    marginTop: -10,
    marginBottom: 16,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#6F2CFF',
    padding: 15,
    borderRadius: 10,
    opacity: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
  },
});
