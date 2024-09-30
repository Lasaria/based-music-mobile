// ConfirmSignUpScreen.js

import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { confirmSignUp } from '../services/AuthService';

const ConfirmSignUpScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Sign Up</Text>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Confirmation Code"
        value={confirmationCode}
        keyboardType="numeric"
        onChangeText={setConfirmationCode}
      />
      <Button title="Confirm" onPress={handleConfirmSignUp} />
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
