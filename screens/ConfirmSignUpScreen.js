// ConfirmSignUpScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { confirmSignUp, resendConfirmationCode } from '../services/AuthService';

const ConfirmSignUpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleConfirmSignUp = async () => {
    try {
      await confirmSignUp(email, confirmationCode);
      console.log('Confirmation successful');
      navigation.navigate('SignIn');
    } catch (err) {
      console.error('Confirmation error:', err);
      setErrorMessage(err.message || 'An error occurred during confirmation.');
    }
  };

  const handleResendConfirmationCode = async () => {
    try {
      await resendConfirmationCode(email);
      console.log('Confirmation code resent successfully');
      setSuccessMessage('Confirmation code has been resent to your email.');
      setErrorMessage(''); // Clear any existing error messages

      // Optionally, clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error resending confirmation code:', err);
      setErrorMessage(err.message || 'An error occurred while resending the confirmation code.');
      setSuccessMessage(''); // Clear success message if any
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Sign Up</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={confirmationCode}
        keyboardType="numeric"
        onChangeText={setConfirmationCode}
      />
      <Button title="Confirm" onPress={handleConfirmSignUp} />
      <Button title="Didn't get a Code? Press to resend" onPress={handleResendConfirmationCode} />
    </View>
  );
};

export default ConfirmSignUpScreen;

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
});
