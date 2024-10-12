import { Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';

const { height } = Dimensions.get('window');

const ButtonComponent = ({ onPress, title, buttonStyle, textStyle }) => {
    return (
        <View>
            <Pressable onPress={onPress} style={[buttonStyle, styles.button]}>
                <Text style={textStyle}>{title}</Text>
            </Pressable>
        </View>
    );
};

export default ButtonComponent;

const styles = StyleSheet.create({
    button: {
        height: height * 0.07,
    },
});