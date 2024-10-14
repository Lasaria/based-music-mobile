import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';
import { router, useLocalSearchParams } from 'expo-router';

const ResetPasswordScreen = ({ }) => {
  //const { email } = route.params;
  const { email } = useLocalSearchParams();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    try {
      await AuthService.confirmForgotPassword(email, confirmationCode, newPassword);
      setSuccessMessage('Password has been reset. You can now log in.');
      // Optionally, navigate to the login screen
      router.replace('signIn')
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during password reset confirmation.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Enter Confirmation Code"
        value={confirmationCode}
        onChangeText={setConfirmationCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        value={newPassword}
        secureTextEntry
        onChangeText={setNewPassword}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ResetPasswordScreen;

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
