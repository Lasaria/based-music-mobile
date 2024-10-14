import React, { useRef, useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Modal } from 'react-native';
import { AuthService } from '../services/AuthService';
import { Colors } from '../constants/Color';
import ButtonComponent from '../components/ButtonComponents';
import { FontAwesome6 } from "react-native-vector-icons";
import { openInbox } from 'react-native-email-link';


const ResetCodeScreen = ({ route, navigation }) => {
    const { email, newPassword } = route.params; // Get email and newPassword passed from ResetPasswordScreen
    const [confirmationCode, setConfirmationCode] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(true); // Modal visibility state

    const [focusedIndex, setFocusedIndex] = useState(0); // Track the focused input index
    const [code, setCode] = useState(['', '', '', '', '', '']); // Holds the values of the code inputs
    const inputRefs = useRef([]); // Create a ref array to hold the input references
    const [time, setTime] = useState(59); // Set initial time in seconds
    const [isVerifyClicked, setIsVerifyClicked] = useState(false);
    const timerRef = useRef(null); // Use a ref to keep track of the timer

    const handleCodeSubmit = async () => {
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

            // Call the confirmForgotPassword API with email, enteredCode, and newPassword
            await AuthService.confirmForgotPassword(email, enteredCode, newPassword);

            setSuccessMessage('Password reset successful! You can now log in.');
            navigation.navigate('SignIn');
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current); // Clear interval when time is up
                    setIsVerifyClicked(false);
                    return 0; // Stop at 0
                }
                return prevTime - 1; // Decrease time
            });
        }, 1000); // 1000 milliseconds = 1 second
    };

    // Navigation to return to Forgot-Password Screen
    const handleNavigateBack = () => {
        navigation.navigate('ForgotPassword');
    };

    const handleCloseModal = () => {
        setIsModalVisible(false); // Close the modal when the close button is clicked
    };

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

    const handleCheckEmail = () => {
        openInbox({ app: 'gmail' });
    }

    const handleKeyPress = (index) => {
        // Handle input deletion and move focus back
        if (code[index] === '') {
            handleBackspace(index);
        }
    };

    return (
        <View style={[styles.container]}>
            {/* Modal for "Check your mailbox" */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        {/* Close Button (X) */}
                        <Pressable onPress={handleCloseModal} style={styles.closeButton}>
                            {/* <Text style={styles.closeText}>✕</Text> */}
                            <FontAwesome6 name={'circle-xmark'} size={24} color={'white'} />
                        </Pressable>

                        {/* Mailbox Icon */}
                        <View style={styles.mailIconContainer}>
                            <Image
                                source={require('../assets/images/GlowWhite.png')} // Replace with your own icon asset
                                style={styles.glowWhite}
                            />
                            <Image
                                source={require('../assets/images/message.png')} // Replace with your own icon asset
                                style={styles.mailIcon}
                            />
                        </View>

                        {/* Text Content */}
                        <Text style={styles.modalTitle}>Check your mailbox</Text>
                        <Text style={styles.modalDescription}>
                            We sent you a code to verify your account.
                        </Text>

                        {/* Button to check the letter */}
                        <ButtonComponent
                            title="Check the letter"
                            buttonStyle={styles.checkButton}
                            textStyle={styles.checkButtonText}
                            onPress={handleCheckEmail}
                        />
                    </View>
                </View>
            </Modal>

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
                <Text style={styles.title}>Verify Code</Text>
                <Text style={styles.subTitle1}>Type the code we sent you to your email address.</Text>
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
                        handleCodeSubmit();
                        startTimer();
                    }}
                />
            </View>
            {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
            {successMessage !== '' && <Text style={styles.successText}>{successMessage}</Text>}
            <Text style={styles.codeMsg}>
                Don't have a code?{" "}
                <Text style={[styles.resendNowMsg, { color: isVerifyClicked && 'white', opacity: isVerifyClicked ? 0.7 : null }]} disabled={isVerifyClicked}>Resend now</Text>
                {isVerifyClicked && (
                    <Text style={styles.timer}> {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</Text>
                )}
            </Text>
        </View>
    );
};

export default ResetCodeScreen;

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
        textAlign: 'center',
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
