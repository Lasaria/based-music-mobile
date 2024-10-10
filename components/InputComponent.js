import { StyleSheet, TextInput, View, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Colors } from '../constants/Color';

const { width, height } = Dimensions.get('window');

const InputComponent = ({ placeholder, value, onChangeText, keyboardType, autoCapitalize, secureTextEntry, emailError, passwordError }) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = new Animated.Value(value ? 1 : 0);

    useEffect(() => {
        Animated.timing(animatedLabel, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const labelStyle = {
        position: 'absolute',
        left: width * 0.05,
        top: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [height * 0.02, -height * 0.010],
        }),
        fontSize: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [width * 0.045, width * 0.035],
        }),
        color: animatedLabel.interpolate({
            inputRange: [0, 1],
            outputRange: [Colors.secondary, Colors.white],
        }),
        backgroundColor: Colors.background,
        paddingHorizontal: 4,
    };

    return (
        <View style={[styles.inputContainer, isFocused && styles.inputIsFocused, (emailError || passwordError) && styles.errorBorderColor]}>
            <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
            <TextInput
                style={styles.input}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

export default InputComponent;

const styles = StyleSheet.create({
    inputContainer: {
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.001,
        borderWidth: 1, // Full border
        borderColor: Colors.secondary,
        borderRadius: 10,
        position: 'relative',
        paddingTop: height * 0.02,
        paddingBottom: height * 0.02,
    },
    input: {
        height: height * 0.03,
        paddingHorizontal: width * 0.05,
        fontSize: width * 0.04,
        color: Colors.white,
    },
    inputIsFocused: {
        borderWidth: 2,
        borderColor: Colors.white,
    },
    errorBorderColor: {
        borderWidth: 1, // Full border
        borderColor: Colors.error,
    }
});
