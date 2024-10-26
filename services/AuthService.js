import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { axiosPost } from "../utils/axiosCalls";
import { tokenManager } from "../utils/tokenManager";

const serverURL = "http://localhost:3001";

export const AuthService = {
  // Sign Up Function
  signUp: async (fullName, email, password) => {
    try {
      const response = await axiosPost({
        url: `${serverURL}/signup`,
        body: JSON.stringify({ fullName, email, password }),
        isAuthenticated: false,
      });

      console.log("User signed up successfully:", response);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Confirm Sign Up Function
  confirmSignUp: async (email, confirmationCode) => {
    try {
      console.log("EMAIL: " + email);
      console.log("Code: " + confirmationCode);

      const response = await axiosPost({
        url: `${serverURL}/confirm-signup`,
        body: JSON.stringify({ email, confirmationCode }),
        isAuthenticated: false,
      });

      console.log("User confirmed successfully:", response);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Resend Confirmation Code Function
  resendConfirmationCode: async (email) => {
    try {
      console.log("EMAIL: " + email);

      const response = await axiosPost({
        url: `${serverURL}/resend-confirmation-code`,
        body: JSON.stringify({ email }),
        isAuthenticated: false,
      });

      console.log("Confirmation code resent successfully:", response);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Sign In Function
  signIn: async (email, password) => {
    try {
      console.log("EMAIL: " + email);
      console.log("Password: " + password);

      const response = await axiosPost({
        url: `${serverURL}/signin`,
        body: { email, password },
        isAuthenticated: false,
      });

      console.log("User signed in successfully:", response);
      await tokenManager.saveTokens(response.result.AuthenticationResult);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Forgot Password Function
  forgotPassword: async (email) => {
    try {
      console.log("EMAIL: " + email);

      const response = await axiosPost({
        url: `${serverURL}/forgot-password`,
        body: JSON.stringify({ email }),
        isAuthenticated: false,
      });

      console.log("Forgot password started successfully:", response);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Confirm Password Reset Function
  confirmForgotPassword: async (email, confirmationCode, newPassword) => {
    try {
      console.log("EMAIL: " + email);
      const response = await axiosPost({
        url: `${serverURL}/confirm-forgot-password`,
        body: JSON.stringify({ email, confirmationCode, newPassword }),
        isAuthenticated: false,
      });

      console.log("Password reset successfully:", response);
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Resend Forgot Password Code
  resendForgotPasswordCode: async (email) => {
    try {
      console.log("EMAIL: " + email);

      const response = await axiosPost({
        url: `${serverURL}/resend-forgot-password-code`,
        body: JSON.stringify({ email }),
        isAuthenticated: false, // No token needed
      });

      console.log("Forgot password code resent successfully:", response);
      return response;
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Sign Out Function
  // Deleting the tokens on the device from which logout performed.
  // Routing to the welcome page if token deletion successful.
  signOut: async () => {
    try {
      await tokenManager.deleteTokens();
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      console.log("Post-deletion accessToken:", accessToken); // Should be null
      console.log("Post-deletion idToken:", idToken); // Should be null
      console.log("Post-deletion refreshToken:", refreshToken); // Should be null
    } catch (err) {
      console.log(err, "Error deleting token and routing while signing out");
    }
  },

  // This invalidates cognito tokens, effectively signing out of all devices.
  // Could be used in critical security cases.
  globalSignOut: async () => {
    const accessToken = await tokenManager?.getAccessToken();
    if (accessToken) {
      try {
        const response = await axiosPost({
          url: `${serverURL}/signout`,
          body: JSON.stringify({ accessToken }),
          isAuthenticated: false,
        });

        console.log("User Signed Out successfully:", response);
        await tokenManager.deleteTokens();
      } catch (err) {
        console.error("Error:", err.message);
        throw new Error(err.message);
      }
    } else {
      return;
    }
  },

  // Refresh Tokens Function
  refreshTokens: async () => {
    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }
      const response = await axiosPost({
        url: `${serverURL}/refresh-tokens`,
        body: { refreshToken },
        isAuthenticated: false,
      });
      console.log("Tokens refreshed successfully:", response);
      await tokenManager.saveTokens(response.result.AuthenticationResult);
    } catch (error) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

  // Google Sign in Function
  googleSignIn: async (idToken) => {
    try {
      const response = await axiosPost({
        url: `${serverURL}/google-auth`,
        body: JSON.stringify({ idToken }),
        isAuthenticated: false,
      });

      console.log("User signed in successfully using Google:", response);
      await tokenManager.saveTokens(response.result.AuthenticationResult);

      return response;
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
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
  },
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
