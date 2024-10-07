import { Image, SafeAreaView, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Colors } from '../constants/Color';
import ButtonComponent from '../components/ButtonComponent';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
    // Handle Naivgation for Sign in
    const handleSignInNavigation = () => {
        navigation.navigate('SignIn')
    }
    // Handle Naivgation for Sign up
    const handleSignUpNavigation = () => {
        navigation.navigate('SignUp')
    }
    return (
        <SafeAreaView style={styles.container}>
            {/* Background Image */}
            <Image
                source={require('../assets/images/bg2.png')}
                resizeMode='cover'
                style={styles.backgroundImage}
            />

            {/* Gradient Overlay */}
            <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,1)']}
                style={styles.gradient}
            >
                {/* Text and Buttons Container */}
                <View style={styles.bottomContainer}>
                    {/* TODO */}
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
        top: -50,
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    bottomContainer: {
        alignItems: 'center',
    },

});
