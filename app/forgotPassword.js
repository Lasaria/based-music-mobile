import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';
import { router } from 'expo-router';

const ForgotPasswordScreen = ({ }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      await AuthService.forgotPassword(email);
      setSuccessMessage('Password reset code sent. Check your email.');
      // Navigate to the ResetPasswordScreen and pass the email
      router.push({ pathname: 'resetPassword', params: { email: email } });
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during password reset request.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
      />
      <Button title="Send Reset Code" onPress={handleForgotPassword} />
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 16,
  },
});
