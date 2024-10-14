// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { tokenManager } from '../utils/tokenManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const bootstrapAsync = async () => {
      try {
        const accessToken = await tokenManager.getAccessToken;
        if (accessToken) {
          // Validate token and set user
          // This is a placeholder. You should implement proper token validation.
          setUser({ token: accessToken });
        }
      } catch (e) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    user,
    signIn: async (email, password) => {
      await AuthService.signIn(email, password);
    },
    signOut: async () => {
      setUser(null);
      await AuthService.signOut();
    },
  };

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};