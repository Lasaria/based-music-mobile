import {
  StyleSheet,
  TextInput,
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../constants/Color";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const InputComponent = ({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  emailError,
  passwordError,
  isPassword,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const animatedLabel = new Animated.Value(value ? 1 : 0);

  useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: width * 0.05,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [height * 0.02, -height * 0.01],
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.inputIsFocused,
        (emailError || passwordError) && styles.errorBorderColor,
        error && styles.errorBorderColor,
      ]}
    >
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={isPassword && !showPassword} // Toggle secure entry for password fields
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={Colors.secondary}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputComponent;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: height * 0.001,
    borderWidth: 1, // Full border
    borderColor: Colors.secondary,
    borderRadius: 14,
    position: "relative",
    paddingTop: height * 0.02,
    paddingBottom: height * 0.02,
    display: "flex",
    width: 343,
    flexDirection: "column",
  },
  input: {
    height: height * 0.03,
    paddingHorizontal: width * 0.05,
    fontSize: width * 0.04,
    color: Colors.white,
    flex: 1, // Ensures input field takes up available space
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center", // Aligns icon vertically with input
  },
  icon: {
    paddingHorizontal: 10,
  },
  inputIsFocused: {
    borderWidth: 2,
    borderColor: Colors.white,
  },
  errorBorderColor: {
    borderWidth: 1, // Full border
    borderColor: Colors.error,
  },
});
