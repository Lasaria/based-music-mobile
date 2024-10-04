
import { axiosPost } from '../utils/axiosCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from '../utils/tokenManager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Updates from 'expo-updates';

const serverURL = 'http://10.0.0.235:3001'

export const AuthService = {
 
// Sign Up Function
signUp: async (email, password) => {
    try {
      const response = await axiosPost({
        url: `${serverURL}/signup`,
        body: JSON.stringify({ email, password }),
        isAuthenticated : false
    });
  

      console.log('User signed up successfully:', response);

    }  catch (err) {
      console.error('Error:', err.response?.data?.error || err.message || 'Unknown error');
      throw new Error(err.response?.data?.error || err.message || 'Unknown error');
  }
  
  },
  
  
  // Confirm Sign Up Function
  confirmSignUp: async (email, confirmationCode) => {
    try {
        console.log("EMAIL: "+ email)
        console.log("Code: " + confirmationCode);

        const response = await axiosPost({
          url: `${serverURL}/confirm-signup`,
          body: JSON.stringify({ email, confirmationCode }),
          isAuthenticated : false
        });


        console.log('User confirmed successfully:', response);

      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },


  // Resend Confirmation Code Function
  resendConfirmationCode: async (email) => {
    try {
        console.log("EMAIL: "+ email)
        
        const response = await axiosPost({
          url: `${serverURL}/resend-confirmation-code`,
          body: JSON.stringify({ email }),
          isAuthenticated : false
        });


        console.log('Confirmation code resent successfully:', response);
 
      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },
  

  // Sign In Function
  signIn: async (email, password) => {
    try {
        console.log("EMAIL: "+ email)
        console.log("Code: " + password);

        const response = await axiosPost({
          url: `${serverURL}/signin`,
          body: { email, password },
          isAuthenticated : false
        });


        console.log('User signed in successfully:', response);
        await tokenManager.saveTokens(response.result.AuthenticationResult);

      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },


  // Forgot Password Function
  forgotPassword: async (email) => {
    try {
        console.log("EMAIL: "+ email)

        const response = await axiosPost({
          url : `${serverURL}/forgot-password`,
          body: JSON.stringify({ email }),
          isAuthenticated : false
        });


        console.log('Forgot password started successfully:', response);

      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },


   // Confirm Password Reset Function
   confirmForgotPassword: async (email, confirmationCode, newPassword) => {
    try {
        console.log("EMAIL: "+ email)
        const response = await axiosPost({
          url: `${serverURL}/confirm-forgot-password`,
          body: JSON.stringify({ email, confirmationCode, newPassword }),
          isAuthenticated : false
        });


        console.log('Password reset successfully:', response);

      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },
  

  // Sign Out Function
  signOut: async () => {

    const accessToken = await tokenManager.getAccessToken();

    try {
        const response = await axiosPost({ 
          url: `${serverURL}/signout`,
          body: JSON.stringify({ accessToken }),
          isAuthenticated : false
        });
        

        console.log('User Signed Out successfully:', response);
        await tokenManager.deleteTokens();


      } catch (err) {
        console.error('Error:', err.response.data.error);
        throw new Error(err.response.data.error);
      }
  },


  // Refresh Tokens Function
  refreshTokens: async () => {
    try {
        const refreshToken = await tokenManager.getRefreshToken();

        // TODO: Needs logic to go to sign in page if this happens
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }


        const response = await axiosPost({
          url: `${serverURL}/refresh-tokens`,
          body: { refreshToken },
          isAuthenticated : false
        });

        console.log('Tokens refreshed successfully:', response);


      } catch (error) {
        // TODO: Needs logic to go to sign in page if this happens
        console.error('Error refreshing tokens:', error.response?.data?.error || error.message);
        throw new Error(error);
      }
  },

  isAuthenticated: async () => {
    const isValid = await tokenManager.isTokenValid();
    if (isValid) {
      return true;
    }
    return await AuthService.refreshTokens();
  },


  refreshTokensOnAppOpen: async () => {
    const isValid = await tokenManager.isTokenValid();
    if (!isValid) {
      const refreshed = await AuthService.refreshTokens();
      if (!refreshed) {
        AuthService.handleFailedRefresh();
      }
    }
  }

};

  
  
  // Check Authentication State
//   export const checkAuthState = async () => {
//     const cognitoUser = userPool.getCurrentUser();
//     if (cognitoUser) {
//       return new Promise((resolve, reject) => {
//         cognitoUser.getSession(async (err, session) => {
//           if (err) {
//             reject(err);
//             return;
//           }
//           if (session.isValid()) {
//             const idToken = session.getIdToken().getJwtToken();
//             await AsyncStorage.setItem('idToken', idToken);
//             resolve(true);
//           } else {
//             await AsyncStorage.removeItem('idToken');
//             resolve(false);
//           }
//         });
//       });
//     } else {
//       await AsyncStorage.removeItem('idToken');
//       return false;
//     }
//   };
  
  