// DeleteConfirmDialog.js
import { Alert } from 'react-native';

export const confirmDelete = (type, onConfirm) => {
  Alert.alert(
    `Delete ${type}`,
    `Are you sure you want to delete this ${type}? This action cannot be undone.`,
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: onConfirm,
        style: "destructive"
      }
    ],
    { cancelable: true }
  );
};