import React, { useState } from 'react';
import { View, Pressable, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Color';
import InputComponent from '../components/InputComponent';
import ButtonComponent from '../components/ButtonComponents';
import { FontAwesome6 } from "react-native-vector-icons";
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { AuthService } from '../services/AuthService';
import { router, useLocalSearchParams } from 'expo-router';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email } = route.params; // Get the email passed from ForgotPasswordScreen
const ResetPasswordScreen = ({ }) => {
  //const { email } = route.params;
  const { email } = useLocalSearchParams();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // New Password States
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
  const [newPasswordCheckIcon, setNewPasswordCheckIcon] = useState(false);

  // Confirm New Password States
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [confirmPasswordErrorMessage, setConfirmNewPasswordErrorMessage] = useState('')
  const [confirmPasswordCheckIcon, setConfirmNewPasswordCheckIcon] = useState(false);


  const handlePasswordSubmit = () => {
    if (!newPassword || !confirmNewPassword) {
      setErrorMessage('Please fill both fields');
    } else {
      // Pass email and newPassword to ResetCodeScreen
      navigation.navigate('resetCode', { email, newPassword });
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

  const handleNavigateBack = () => {
    navigation.navigate('ForgotPassword');
  }

  // Handle New Password Error Message
  const handleNewPassword = (password) => {
    setNewPassword(password);
    const passValidationCheck = /^(?=.*[a-z])(?=.*[A-Z]).*$/;
    const isValid = passValidationCheck.test(password);
    if (!isValid || password.length < 8) {
      setNewPasswordErrorMessage('At least 8 letters with one upper and one lower case')
      setNewPasswordCheckIcon(false);
    } else {
      setNewPasswordErrorMessage('')
      setNewPasswordCheckIcon(true);
    }
  }

  // Handle Confirm Password Error Message
  const handleConfirmPassword = (confirmPassword) => {
    setConfirmNewPassword(confirmPassword);

    // Check if confirmPassword is empty
    if (confirmPassword.trim() === '') {
      setConfirmNewPasswordCheckIcon(false); // Reset the check icon if the field is empty
      setConfirmNewPasswordErrorMessage(''); // Reset the error message
      return; // Exit early
    }

    const isValid = newPassword === confirmPassword;
    if (!isValid) {
      setConfirmNewPasswordErrorMessage('Password does not match');
      setConfirmNewPasswordCheckIcon(false); // Reset the check icon if passwords don't match
    } else {
      setConfirmNewPasswordErrorMessage(''); // Clear the error message
      setConfirmNewPasswordCheckIcon(true); // Set the check icon if passwords match
    }
  }



  const isResetDisabled =
    newPasswordErrorMessage !== '' ||
    confirmPasswordErrorMessage !== '' ||
    newPassword.trim() == '' ||
    confirmNewPassword.trim() == '';



  return (
    <View style={styles.container}>
      {/* Back Icon */}
      <Pressable style={styles.backButtonContainer} onPress={handleNavigateBack}>
        <Image
          source={require('../assets/images/Glow.png')}
          style={styles.glow}
        />
        <Image
          source={require('../assets/icon/24x24/arrowleft.png')}
          style={styles.arrowleftIcon}
        />
      </Pressable>

      {/* Text Container */}
      <View style={styles.textContainer}>
        {/* Forgot Password Title */}
        <Text style={styles.title}>Reset Password</Text>

        {/* Forgot Password Sub-Title 1 */}
        <Text style={styles.subTitle}>Please set your new password</Text>
      </View>

      {/* Email Input */}
      <View style={styles.emailInputContainer}>
        {/* New Password input */}
        <InputComponent
          placeholder="New Password"
          placeholderTextColor={Colors.white}
          value={newPassword}
          onChangeText={handleNewPassword}
          keyboardType="default"
          autoCapitalize="none"
          secureTextEntry={true}
          emailError={errorMessage}
        />
        {newPassword && newPasswordErrorMessage && (
          <Pressable
            style={[styles.newPasswordCrossIcon, { borderColor: errorMessage ? Colors.error : 'white' }]}
            onPress={() => {
              setNewPassword('');
              setNewPasswordErrorMessage('');
            }}>
            <FontAwesome6 name="xmark" size={12} color={errorMessage ? Colors.error : 'white'} style={styles.crossIcon} />
          </Pressable>
        )}
        {newPasswordCheckIcon && !newPasswordErrorMessage && (
          <Pressable style={[styles.newPasswordCheckIcon, { borderColor: '#00FD61' }]} onPress={() => setNewPassword('')}>
            <FontAwesome6 name="check" size={12} color={'#00FD61'} style={styles.crossIcon} />
          </Pressable>

        )}

        {/* Confirm New Password Input */}
        {newPasswordCheckIcon && (
          <InputComponent
            placeholder="Confirm New Password"
            placeholderTextColor={Colors.white}
            value={confirmNewPassword}
            onChangeText={handleConfirmPassword}
            keyboardType="default"
            autoCapitalize="none"
            secureTextEntry={true}
            emailError={errorMessage}
          />
        )}
        {confirmNewPassword && confirmPasswordErrorMessage && (
          <Pressable
            style={[styles.confirmNewPasswordCrossIcon, { borderColor: errorMessage ? Colors.error : 'white' }]}
            onPress={() => {
              setConfirmNewPassword('');
              setConfirmNewPasswordErrorMessage('');
            }}>
            <FontAwesome6 name="xmark" size={12} color={errorMessage ? Colors.error : 'white'} style={styles.crossIcon} />
          </Pressable>
        )}
        {confirmPasswordCheckIcon && !confirmPasswordErrorMessage && (
          <Pressable style={[styles.confirmNewPasswordCheckIcon, { borderColor: '#00FD61' }]} onPress={() => setNewPassword('')}>
            <FontAwesome6 name="check" size={12} color={'#00FD61'} style={styles.crossIcon} />
          </Pressable>

        )}

        <View style={styles.errorContainer}>
          {newPasswordErrorMessage && newPassword && (
            <>
              <Text style={styles.errorText}>Invalid Password</Text>
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>•</Text>
                <Text style={styles.errorText}>{newPasswordErrorMessage}</Text>
              </View>
            </>
          )}
          {confirmPasswordErrorMessage && confirmNewPassword && (
            <Text style={styles.errorText}>{confirmPasswordErrorMessage}</Text>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <ButtonComponent
          title={'Reset Password'}
          buttonStyle={[styles.forgotPasswordButton,
          { backgroundColor: isResetDisabled ? '#444A5D' : '#6F2CFF' }
          ]}
          textStyle={styles.forgotPasswordButtonText}
          onPress={handlePasswordSubmit}
          disabled={isResetDisabled}
        />
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Colors.background
  },
  backButtonContainer: {
    marginTop: 75,
    marginBottom: 101,
  },
  emailInputContainer: {
    marginTop: 25,
    gap: 26,
    marginBottom: 30,
  },
  submitButtonContainer: {
    marginBottom: 213,
  },
  glow: {
    width: 40,
    height: 40,
    flexShrink: 0,
  },
  arrowleftIcon: {
    width: 18,
    height: 18,
    flexShrink: 0,
    position: 'absolute',
    top: 12,
    left: 12,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 16,
    width: 258,
    height: 126,
  },
  titleLayout: {
    width: 245,
  },
  title: {
    color: 'white',
    fontFamily: "Open Sans",
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 34,
  },
  subTitle: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    opacity: 0.7,
  },
  newPasswordCrossIcon: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 30,
  },
  newPasswordCheckIcon: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 30,
  },
  confirmNewPasswordCrossIcon: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 110,
    right: 30,
  },
  confirmNewPasswordCheckIcon: {
    height: 24,
    width: 24,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 110,
    right: 30,
  },
  forgotPasswordButton: {
    justifyContent: 'center',
    width: 343,
    height: 56,
    flexShrink: 0,
    borderRadius: 10,
  },
  forgotPasswordButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20
  },
  errorContainer: {
    marginTop: 8,
    width: 258,
    height: 60,
    overflow: 'scroll',
  },
  errorBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 10,
  },
  errorText: {
    color: Colors.error,
    fonFamily: "Open Sans",
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
    // opacity: 0.7,
  },
  signUpText: {
    color: '#0083FF',
    fontFamily: "Open Sans",
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeightt: 22,
    opacity: 0.7,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 16,
  },
});
