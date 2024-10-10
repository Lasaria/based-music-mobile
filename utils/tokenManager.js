import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'userAccessToken';
const ID_TOKEN_KEY = 'userIdToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';

export const tokenManager = {
  saveTokens: async (tokens) => {
    try {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.AccessToken);
      await SecureStore.setItemAsync(ID_TOKEN_KEY, tokens.IdToken);

      // Needed since refresh tokens call doesn't return RefreshToken
      if (tokens?.RefreshToken){
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.RefreshToken );
      }

      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      console.log("accessToken: "+ accessToken);
      console.log("idToken: " + idToken);
      console.log("refreshToken: " + refreshToken);

    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  },

  getAccessToken: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      console.log("accessToken: "+ accessToken);

      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  getIdToken: async () => {
    try {
      return await SecureStore.getItemAsync(ID_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  },

  getRefreshToken: async () => {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  deleteTokens: async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(ID_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error deleting tokens:', error);
    }
  },

  IsAccessOrIdTokenExpired: async () => {
    const hasAccessTokenExpired = await tokenManager.isAccessTokenExpired();
    const hasIdTokenExpired  = await tokenManager.isIdTokenExpired();
    return (hasAccessTokenExpired || hasIdTokenExpired);
  },

  isAccessTokenExpired: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      // Token doesn't exist, consider it expired
      if (!accessToken) {
        return true;
      }
      const decodedToken = jwtDecode(accessToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp <= currentTime;
    } catch (error) {
      console.error('Error checking access token expiration:', error);
      // In case of error, consider token expired
      return true; 
    }
  },

  isIdTokenExpired: async () => {
    try {
      const idToken = await SecureStore.getItemAsync(ID_TOKEN_KEY);
      // Token doesn't exist, consider it expired
      if (!idToken) {
        return true; 
      }
      const decodedToken = jwtDecode(idToken);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp <= currentTime;
    } catch (error) {
      console.error('Error checking ID token expiration:', error);
      // In case of error, consider token expired
      return true;
    }
  },
};