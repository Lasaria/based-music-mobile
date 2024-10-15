import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    const [loadingFonts, setLoadingFonts] = useState(true);

    const loadFonts = async () => {
        await Font.loadAsync({
            'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
            'OpenSans-Bold': require('../assets/fonts/OpenSans-Bold.ttf'),
        });
        setLoadingFonts(false);
    };

    useEffect(() => {
        loadFonts();
    }, []);

    if (loadingFonts) {
        return null; // or a loading spinner
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Background Image Container */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/images/bg2.png')}
                    resizeMode='cover'
                    style={styles.backgroundImage}
                />
                {/* Bottom darkening overlay occupying only 25% */}
                <View style={styles.bottomOverlay}>
                    {[...Array(25)].map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.darkeningLayer,
                                {
                                    bottom: index * (height * 0.01),
                                    opacity: 0.04 * index
                                }
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Welcome Message */}
                <Text style={[styles.welcomeMsg, { fontFamily: 'OpenSans-Bold' }]}>Welcome to Based Music</Text>
                <Text style={[styles.subMessage, { fontFamily: 'OpenSans-Regular' }]}>Your Local Music Scene All in One, Anywhere.</Text>

                {/* Buttons Container */}
                <View style={styles.bottomContainer}>
                    <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/signIn')}>
                        <Text style={[styles.buttonText, { fontFamily: 'OpenSans-Bold' }]}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signUpButton} onPress={() => router.push('/signUp')}>
                        <Text style={[styles.buttonText, { fontFamily: 'OpenSans-Bold' }]}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.guestButton} onPress={() => router.replace('/homeIndex')}>
                        <Text style={[styles.guestButtonText, { fontFamily: 'OpenSans-Bold' }]}>continue as a guest</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    imageContainer: {
        width: '100%',
        height: height,
        position: 'absolute',
    },
    backgroundImage: {
        width: width,
        height: height * 0.66,
        position: 'absolute',
        marginTop: '-20%',
    },
    bottomOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        backgroundColor: 'rgba(0, 0, 0, 1)', // Semi-transparent black
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.9,
        shadowRadius: 20,
    },

    darkeningLayer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: height * 0.36,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30,
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
        top: height * 0.001, // Fixed position for welcome message
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