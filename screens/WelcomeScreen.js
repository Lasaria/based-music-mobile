import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect} from 'react';
import { Colors } from '../constants/Color';
import ButtonComponent from '../components/ButtonComponent';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const [loadingFonts, setLoadingFonts] = useState(true);
    // Handle Naivgation for Sign in
    const handleSignInNavigation = () => {
        navigation.navigate('SignIn')
    }
    // Handle Naivgation for Sign up
    const handleSignUpNavigation = () => {
        navigation.navigate('SignUp')
    }

    // Handle Naivgation for guest
    const handleGuestNavigation = () => {
        navigation.navigate('')
    }

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

      if (loadingFonts) {
        return null; // or a loading spinner
      }

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/bg2.png')}
                    resizeMode='cover'
                    style={styles.backgroundImage}
                />
            </View>
            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
                style={styles.gradient}
            >

                 {/* Welcome Message */}
                 <Text style={[styles.welcomeMsg, { fontFamily: 'OpenSans-Bold' }]}>Welcome to Based Music</Text>
                 <Text style={[styles.subMessage, { fontFamily: 'OpenSans-Regular' }]}>Your Local Music Scene All in One, Anywhere.</Text>
                {/* Text and Buttons Container */}
                <View style={styles.content}>

                    {/* Sign in Button */}
                    <View style={styles.bottomContainer}>
                        <TouchableOpacity style={styles.signInButton} onPress={handleSignInNavigation}>
                            <Text style={[styles.buttonText, { fontFamily: 'OpenSans-Bold'}]}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUpNavigation}>
                            <Text style={[styles.buttonText, { fontFamily: 'OpenSans-Bold'}]}>Sign Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.guestButton}>
                            <Text style={[styles.guestButtonText, { fontFamily: 'OpenSans-Bold'}]}>continue as a guest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width: width,
        height: height * 0.75,
        position: 'absolute',
        marginTop: '-30%',
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    welcomeMsg: {
        color: '#FFF',
        fontSize: 28,
        textAlign: 'center',
        top: -height * 0.10, // Fixed position for welcome message
    },
    subMessage: {
        fontSize: 14,
        textAlign: 'center',
        color: '#cccccc',
        top: -height * 0.08, // Fixed position for welcome message
    },
    bottomContainer: {
        alignItems: 'center',
    },
    signInButton: {
        backgroundColor: '#6F2CFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        opacity: 1,
        top: -height * 0.05, // Fixed position for welcome message
    },
    signUpButton: {
        padding: 15,
        borderRadius: 10,
        borderColor: '#6F2CFF',
        borderWidth: 2,
        width: '100%',
        opacity: 1,
        top: -height * 0.03, // Fixed position for welcome message
    },
    guestButton: {
        top: -height * 0.01, // Fixed position for welcome message
    },
    guestButtonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 14,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: 16,
    }
});
