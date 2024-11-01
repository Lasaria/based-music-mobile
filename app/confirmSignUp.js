// ConfirmSignUpScreen.js

import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Image, Text, StyleSheet, Pressable } from 'react-native';
import { AuthService } from '../services/AuthService';
import { router, useLocalSearchParams } from 'expo-router';
import { Modal } from 'react-native';
import { FontAwesome6 } from "react-native-vector-icons";
import ButtonComponent from '../components/ButtonComponents';
import { openInbox } from 'react-native-email-link';
import { Colors } from '../constants/Color';
import useProfileStore from '../zusStore/userFormStore';


const ConfirmSignUpScreen = ({ }) => {
  const {updateField } = useProfileStore();
  //const { email, password } = route.params;
  const { email, password } = useLocalSearchParams();

  // Add the email and password to zustand user store
  // Move store updates to useEffect
  useEffect(() => {
    if (email && password) {
      updateField('email', email);
      updateField('password', password);
    }
  }, [email, password]);

  //console.log(route.params)
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state
  const [focusedIndex, setFocusedIndex] = useState(0); // Track the focused input index
  const [code, setCode] = useState(['', '', '', '', '', '']); // Holds the values of the code inputs
  const [isVerifyClicked, setIsVerifyClicked] = useState(false);
  const [time, setTime] = useState(30); // Set initial time in seconds
  const timerRef = useRef(null); // Use a ref to keep track of the timer
  const inputRefs = useRef([]); // Create a ref array to hold the input references
  const [isResending, setIsResending] = useState(false); // State for handling resend code




  const handleConfirmSignUp = async () => {
    // Reset error and success messages
    setErrorMessage('');
    setSuccessMessage('');

    // Combine the code inputs into a single string
    const enteredCode = code.join('');

    // Set the confirmationCode state (optional)
    setConfirmationCode(enteredCode);

    try {
      // Validate the code
      if (enteredCode.length !== 6) {
        setErrorMessage('Please enter a valid 6-digit confirmation code.');
        return;
      }
      await AuthService.confirmSignUp(email, enteredCode);
      console.log('Confirmation successful');
      console.log("Password: " + password)
      // Not logging in here
      // await AuthService.signIn(email, password)
      console.log('Login successful');
      router.back();
      router.back();
      router.back();
      router.replace('userTypeChoice');
    } catch (err) {
      console.error('Confirmation error:', err);
      setErrorMessage(err.message || 'An error occurred during confirmation.');
    }
  };

  const handleResendConfirmationCode = async () => {
    setIsResending(true); // Show loading state when resending
    try {
      await AuthService.resendConfirmationCode(email);
      console.log('Confirmation code resent successfully');
      setSuccessMessage('Confirmation code has been resent to your email.');
      startTimer(); // Restart the timer if needed
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      setErrorMessage(''); // Clear any existing error messages

      // Optionally, clear the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      console.error('Error resending confirmation code:', err);
      setErrorMessage(err.message || 'An error occurred while resending the confirmation code.');
      setSuccessMessage(''); // Clear success message if any
    } finally {
      setIsResending(false); // Reset resend state after completion
    }
  };

  const startTimer = () => {
    setTime(30); // Reset the timer to 30 seconds
    setIsVerifyClicked(true); // Indicate that the timer has started
    setErrorMessage(''); // Clear any existing error messages
    if (timerRef.current) {
      clearInterval(timerRef.current); // Clear any existing timer before starting a new one
    }
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current); // Clear interval when time is up
          setIsVerifyClicked(false);
          return 0; // Stop at 0
        }
        if (prevTime >= 1 && prevTime <= 10) {
          return `0${prevTime - 1}`;
        }
        return prevTime - 1; // Decrease time
      });
    }, 1000); // 1000 milliseconds = 1 second
  };


  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal when the close button is clicked
  };

  const handleCheckEmail = () => {
    openInbox({
      app: 'gmail'
    })
  }

  const handleNavigateBack = () => {
    router.back();
  }

  const isCodeFilled = code.every((c) => c.length > 0); // Check if all inputs are filled

  const handleInputChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to the next input if the value is filled
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
      setFocusedIndex(index + 1); // Update the focused index
    }
  };

  const handleBackspace = (index) => {
    // Move to the previous input if backspace is pressed on an empty input
    if (index > 0 && !code[index]) {
      inputRefs.current[index - 1].focus();
      setFocusedIndex(index - 1); // Update the focused index
    }
  };

  const handleKeyPress = (index) => {
    // Handle input deletion and move focus back
    if (code[index] === '') {
      handleBackspace(index);
    }
  };





  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Confirm Sign Up</Text>
    //   {errorMessage ? (
    //     <Text style={styles.errorText}>{errorMessage}</Text>
    //   ) : null}

    //   {successMessage ? (
    //     <Text style={styles.successText}>{successMessage}</Text>
    //   ) : null}
    //   <TextInput
    //     style={styles.input}
    //     placeholder="Confirmation Code"
    //     value={confirmationCode}
    //     keyboardType="numeric"
    //     onChangeText={setConfirmationCode}
    //   />
    //   <Button title="Confirm" onPress={handleConfirmSignUp} />
    //   <Button title="Didn't get a Code? Press to resend" onPress={handleResendConfirmationCode} />
    // </View>


    <View style={[styles.container]}>
      

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
        <Text style={styles.title}>Enter verify code</Text>
        <Text style={styles.subTitle1}>Tap code we sent you to your email address.</Text>
      </View>

      {/* Code Input */}
      <View style={styles.codeInputContainer}>
        {Array.from({ length: 6 }).map((_, index) => (
          <TextInput
            key={index}
            style={[styles.codeInputField, {
              borderColor: focusedIndex === index ? '#6F2CFF' : (index < focusedIndex ? '#FFFFFF' : 'gray'),
            }]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)} // Assign the input ref
            value={code[index]} // Set the value from state
            onChangeText={(value) => {
              handleInputChange(value, index);
            }}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleKeyPress(index);
              }
            }}
          />
        ))}
      </View>

      {/* Submit Button */}
      <View style={styles.submitButtonContainer}>
        <ButtonComponent
          title={'Verify'}
          buttonStyle={[styles.forgotPasswordButton, { backgroundColor: isCodeFilled ? '#6F2CFF' : '#444A5D' }]}
          textStyle={styles.forgotPasswordButtonText}
          disabled={!isCodeFilled} // Disable if not all inputs are filled
          onPress={() => {
            handleConfirmSignUp()
          }}
        />
      </View>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
      <Text style={styles.codeMsg}>
        Don't have a code?{" "}
        <Text
          style={[styles.resendNowMsg, { color: isVerifyClicked && 'white', opacity: isVerifyClicked ? 0.7 : null }]}
          disabled={isVerifyClicked}
          onPress={handleResendConfirmationCode}
        >
          Resend now
        </Text>
        {time >= 1 && (
          <Text style={styles.timer}>
            {" "} {`0:${time}`}
          </Text>
        )}
      </Text>

    </View>
  );
};

export default ConfirmSignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Colors.background,
    opacity: 1,
  },
  backButtonContainer: {
    marginTop: 5,
    marginBottom: 51,
  },
  codeInputContainer: {
    marginTop: 5,
    marginBottom: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    // gap: 10,
    padding: 5,
  },
  codeInputField: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: '#FFF',
    color: 'white',
    textAlign: 'center',
    margin: 4,
  },
  submitButtonContainer: {
    marginBottom: 20,
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
  title: {
    color: 'white',
    fontFamily: "Open Sans",
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 34,
  },
  subTitle1: {
    color: '#FFF',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    opacity: 0.7,
    width: 323,
    height: 20,
  },
  forgotPasswordButton: {
    justifyContent: 'center',
    width: 343,
    height: 56,
    borderRadius: 10,
  },
  forgotPasswordButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20
  },
  codeMsg: {
    color: '#FFF',
    fontFamily: "Open Sans",
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 250,
  },
  resendNowMsg: {
    color: '#FFF',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textDecorationLine: 'underline',
  },
  timer: {
    color: '#FFF',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginLeft: 10, // Add space between "Resend now" and the timer
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '91%',
    height: 'auto',
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    elevation: 10, // Adds shadow for Android
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  closeText: {
    color: '#FFF',
    fontSize: 24,
  },
  mailIconContainer: {
    position: 'relative',
  },
  glowWhite: {
    width: 64,
    height: 64,
    flexShrink: 0,
    marginBottom: 59.6,
  },
  mailIcon: {
    width: 28.8,
    height: 28.8,
    flexShrink: 0,
    position: 'absolute',
    top: 18,
    left: 18,
  },
  modalTitle: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 28,
    width: 295,
    marginBottom: 16,
  },
  modalDescription: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    width: 295,
    marginBottom: 42,
    opacity: 0.7,
  },
  checkButton: {
    backgroundColor: '#6F2CFF',
    width: 295,
    height: 56,
    flexShrink: 0,
    borderRadius: 14,
    justifyContent: 'center',
  },
  checkButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: "Open Sans",
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20,
  },
});

