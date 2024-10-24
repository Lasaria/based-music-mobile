// The implementation is mostly correct but needs a few adjustments and improvements:

import axios from "axios";
import { tokenManager } from "./tokenManager";
import { AuthService } from "../services/AuthService";
import { router } from 'expo-router';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const createAxiosRequest = async ({ 
  url, 
  method, 
  body, 
  headers: customHeaders = {}, // Allow custom headers
  isAuthenticated = true 
}) => {
  let accessToken;

  if (isAuthenticated) {
    try {
      const isAnyTokenInvalid = await tokenManager.IsAccessOrIdTokenExpired();
      if (isAnyTokenInvalid) {
        console.log("Tokens expired, attempting refresh");
        await AuthService.refreshTokens();
      }
      accessToken = await tokenManager.getAccessToken();
    } catch (error) {
      console.error("Authentication error:", error);
      tokenManager.deleteTokens();
      router.replace('signIn');
      throw new ApiError('Authentication failed', null, error);
    }
  }

  // Determine if the body is FormData
  const isFormData = body instanceof FormData;

  // Merge custom headers with default headers
  const headers = {
    ...(method !== 'GET' && !isFormData && { 'Content-Type': 'application/json' }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...customHeaders // Allow override of default headers
  };

  try {
    const response = await axios({
      url,
      method,
      headers,
      // Improved data handling
      ...(method !== 'GET' && {
        data: isFormData ? body : 
              typeof body === 'string' ? JSON.parse(body) : body
      }),
      // Prevent axios from trying to transform FormData
      ...(isFormData && { transformRequest: [] }),
      // Add timeout
      timeout: 30000, // 30 seconds
    });

    return response.data;
  } catch (error) {
    console.error('API Request Error:', {
      url,
      method,
      status: error.response?.status,
      error: error.message
    });

    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          tokenManager.deleteTokens();
          router.replace('signIn');
          break;
        case 403:
          throw new ApiError('Access forbidden', 403, error.response.data);
        case 404:
          throw new ApiError('Resource not found', 404, error.response.data);
        default:
          throw new ApiError(
            error.response.data?.error || 'Server error',
            error.response.status,
            error.response.data
          );
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new ApiError('Request timeout', null, 'The request took too long to complete');
    } else if (error.request) {
      throw new ApiError('No response received', null, 'The server did not respond');
    } else {
      throw new ApiError('Request failed', null, error.message);
    }
  }
};

// Helper functions with type annotations for better IDE support
export const axiosPost = (config) => createAxiosRequest({ ...config, method: 'POST' });
export const axiosGet = (config) => createAxiosRequest({ ...config, method: 'GET' });
export const axiosPut = (config) => createAxiosRequest({ ...config, method: 'PUT' });
export const axiosDelete = (config) => createAxiosRequest({ ...config, method: 'DELETE' });