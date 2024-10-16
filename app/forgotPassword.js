import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { AuthService } from '../services/AuthService';
import ButtonComponent from '../components/ButtonComponents';
import InputComponent from '../components/InputComponent';
import { Colors } from '../constants/Color';
import { FontAwesome6 } from 'react-native-vector-icons'
import { router } from 'expo-router';

const ForgotPasswordScreen = ({ }) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorEmailMessage, setErroEmailMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleForgotPassword = async () => {
    try {
      // Trigger the Forgot Password flow (sending code to email)
      await AuthService.forgotPassword(email);
      setSuccessMessage('Successfully verified the email');
      // Navigate to the ResetPasswordScreen and pass the email
      router.push({ pathname: 'resetPassword', params: { email: email } });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Navigation to return to Sign-In Screen
  const handleNavigateBack = () => {
    // navigation.navigate('SignIn')
    router.back()
  }

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-Time email validation
  const handleEmailChange = (userEmail) => {
    setEmail(userEmail);

    if (!emailRegex.test(userEmail)) {
      setErroEmailMessage('Please enter a valid email address.');
    } else {
      setErroEmailMessage('');
    }
  }

  // Delete the entire text from input field
  const handleDeleteInput = () => {
    setEmail('');
  }

  // Navigation to return to Sign-Up Screen after entering wrong email
  const handleNavigateSignUp = () => {
    // navigation.navigate('SignUp')
    router.replace('/signUp')
  }

  // Check submit validation
  const isSubmitDisabled = email.trim() === '' || errorEmailMessage !== ''; // Button is disabled if email is empty or error message

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
        <Text style={styles.title}>Forgot Password</Text>

        {/* Forgot Password Sub-Title 1 */}
        <Text style={styles.subTitle1}>Please enter your registered email ID</Text>

        {/* Forgot Password Sub-Title 2 */}
        <Text style={styles.subTitle2}>We will send a verification code to your registered email ID</Text>
      </View>

      {/* Email Input */}
      <View style={styles.emailInputContainer}>
        <InputComponent
          placeholder="Email"
          placeholderTextColor={Colors.white}
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          secureTextEntry={false}
          emailError={errorMessage}
        />
        {email && (
          <Pressable style={[styles.crossIconContainer, { borderColor: errorMessage ? Colors.error : 'white' }]} onPress={handleDeleteInput}>
            <FontAwesome6 name="xmark" size={12} color={errorMessage ? Colors.error : 'white'} style={styles.crossIcon} />
          </Pressable>
        )}
        <View style={styles.errorContainer}>
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage} <Text style={styles.signUpText} onPress={handleNavigateSignUp}>Sign up</Text></Text>}
          {errorEmailMessage !== '' && <Text style={styles.errorText}>{errorEmailMessage}</Text>}
          {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <ButtonComponent
          title={'Submit'}
          buttonStyle={[styles.forgotPasswordButton, { backgroundColor: isSubmitDisabled ? '#444A5D' : '#6F2CFF' }]}
          textStyle={styles.forgotPasswordButtonText}
          onPress={handleForgotPassword}
          disabled={isSubmitDisabled}
        />
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

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
    marginBottom: 120,
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
  subTitle1: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    opacity: 0.7,
  },
  subTitle2: {
    color: '#FFF',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    opacity: 0.7,
  },
  crossIconContainer: {
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
  },
  errorText: {
    color: Colors.error,
    fonFamily: "Open Sans",
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 22,
    opacity: 0.7,
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
