// SignUpScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Optional
  const [errorMessage, setErrorMessage] = useState('');
  const [preferredUsername, setPreferredUsername] = useState('');

  const handleSignUp = async () => {
    try {
      const formattedPhoneNumber = phoneNumber
        ? `+1${phoneNumber.replace(/\D/g, '')}`
        : null;

      // Only pass email, password, and to come later: phoneNumber
      await AuthService.signUp(email, password);
      console.log('Sign up successful');
      // Navigate to confirmation screen with the email
      navigation.navigate('ConfirmSignUp', { email });
    } catch (err) {
      console.error('Sign up error:', err.message);
      //setErrorMessage(err.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {errorMessage !== '' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Phone Number (Optional)"
        value={phoneNumber}
        keyboardType="phone-pad"
        onChangeText={setPhoneNumber}
      /> */}
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});
