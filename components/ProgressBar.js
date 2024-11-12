import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Color';

const ProgressBar = ({ currentStep, totalSteps }) => {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }, (_, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const stepText = isCompleted ? 'DONE' : isCurrent ? index + 1 : index + 1;

                return (
                    <View key={index} style={styles.stepContainer}>
                        {index > 0 && (
                            <View style={[styles.line, isCompleted && styles.completedLine]} />
                        )}
                        <View
                            style={[
                                styles.circle,
                                isCompleted ? styles.completedCircle : isCurrent ? styles.currentCircle : styles.pendingCircle,
                            ]}
                        >
                            {isCompleted ? (
                                <Ionicons name="checkmark" size={24} color="white" />
                            ) : (
                                <Text style={[styles.stepText, isCurrent && styles.currentStepText]}>
                                    {stepText}
                                </Text>
                            )}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        width: 30,
        height: 2,
        backgroundColor: '#D3D3D3', // Inactive line color
        marginHorizontal: 8,
    },
    completedLine: {
        backgroundColor: Colors.primary, // Completed line color
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completedCircle: {
        backgroundColor: Colors.primary, // Completed step color
    },
    currentCircle: {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    pendingCircle: {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: '#CECECE',
    },
    stepText: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    currentStepText: {
        color: Colors.white, // Current step color
    },
});

export default ProgressBar;
