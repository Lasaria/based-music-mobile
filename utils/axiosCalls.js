import axios from "axios";
import { tokenManager } from "./tokenManager";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const createAxiosRequest = async ({ url, method, body, isAuthenticated = true }) => {
    let accessToken;

    if (isAuthenticated) {
        try {
            accessToken = await tokenManager.getAccessToken();
        } catch (error) {
            throw new ApiError('Failed to get access token', null, error);
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    };

    try {
        const response = await axios({
            url,
            method,
            headers,
            data: body,
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new ApiError(
                error.response.data.error || 'Server responded with an error',
                error.response.status,
                error.response.data
            );
        } else if (error.request) {
            // The request was made but no response was received
            throw new ApiError('No response received from server', null, error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new ApiError('Error setting up the request', null, error.message);
        }
    }
};

export const axiosPost = (config) => createAxiosRequest({ ...config, method: 'POST' });
export const axiosGet = (config) => createAxiosRequest({ ...config, method: 'GET' });