import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SuccessModal = ({ visible, onClose }) => {
  const handleNext = async () => {
    try {
      console.log("Attempting to navigate...");
      
      // First close the modal
      if (onClose) {
        console.log("Closing modal...");
        onClose();
      }

      // Small delay to ensure modal closes properly
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Navigating to home...");
      
      // Try different navigation approaches
      try {
        // Option 1: Using router.replace
        router.replace('/homeIndex');
      } catch (error) {
        console.error("First navigation attempt failed:", error);
        
        try {
          // Option 2: Using router.push
          router.push('/(tabs)');
        } catch (error) {
          console.error("Second navigation attempt failed:", error);
          
          // Option 3: Basic path
          router.replace('/');
        }
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handlePress = () => {
    console.log("Button pressed");
    handleNext();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.successIcon}>
            <MaterialIcons name="check-circle" size={64} color="#1DB954" />
          </View>

          <Text style={styles.title}>Profile Created!</Text>
          
          <Text style={styles.message}>
            Your profile has been successfully created and is ready to go.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  successIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuccessModal;