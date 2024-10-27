import axios from "axios";
import { tokenManager } from "./tokenManager";
import { AuthService } from "../services/AuthService"; // Import your AuthService
import { router } from 'expo-router';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Introduced content type, in order to be able to send form data while sending images, or other non-json data.
const createAxiosRequest = async ({ url, method, body, isAuthenticated = true, contentType="application/json" }) => {
  let accessToken;

  if (isAuthenticated) {
    const isAnyTokenInvalid = await tokenManager.IsAccessOrIdTokenExpired();
    if (isAnyTokenInvalid) {
        console.log("INVALID TOKENS")
      try {
        await AuthService.refreshTokens();
      } catch (error) {
        // Cause1: Expired Refresh Tokens
        tokenManager.deleteTokens();
        router.replace('signIn')
        throw new ApiError('Failed to refresh tokens', null, error);
      }
    }

    // Retrieve the (new) access token
    try {
      accessToken = await tokenManager.getAccessToken();
    } catch (error) {
      throw new ApiError('Failed to get access token', null, error);
    }
  }

  const headers = {
    ...(method !== 'GET' && { 'Content-Type': contentType }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  };

  try {
    console.log("request:", {
      url,
      method,
      headers,
      ...(method === 'GET' ? { } : { data: body }),
    })
    const response = await axios({
      url,
      method,
      headers,
      ...(method === 'GET' ? { } : { data: body }),
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new ApiError(
        error.response.data.error || 'Server responded with an error',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new ApiError('No response received from server', null, error.request);
    } else {
      throw new ApiError('Error setting up the request', null, error.message);
    }
  }
};

export const axiosPost = (config) => createAxiosRequest({ ...config, method: 'POST' });
export const axiosGet = (config) => createAxiosRequest({ ...config, method: 'GET' });
