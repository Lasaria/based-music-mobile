import axios from "axios";
import { tokenManager } from "./tokenManager";
import { AuthService } from "../services/AuthService";
import { router } from "expo-router";

class ApiError extends Error {
  constructor (message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

const createAxiosRequest = async ({
  url,
  method,
  body,
  params,
  isAuthenticated = true,
  contentType = "application/json",
}) => {
  let accessToken;

  if (isAuthenticated) {
    const isAnyTokenInvalid = await tokenManager.IsAccessOrIdTokenExpired();
    if (isAnyTokenInvalid) {
      console.log("INVALID TOKENS");
      try {
        await AuthService.refreshTokens();
      } catch (error) {
        tokenManager.deleteTokens();
        router.replace("signIn");
        throw new ApiError("Failed to refresh tokens", null, error);
      }
    }

    try {
      accessToken = await tokenManager.getAccessToken();
    } catch (error) {
      throw new ApiError("Failed to get access token", null, error);
    }
  }

  const headers = {
    ...(method !== "GET" && { "Content-Type": contentType }),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  // Handle query parameters
  let finalUrl = url;
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join("&");

    if (queryString) {
      finalUrl = `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  try {
    console.log(`[AxiosRequest] Making ${method} request to:`, {
      url: finalUrl,
      method,
      headers,
      ...(method === "GET" ? {} : { data: body }),
    });

    const response = await axios({
      url: finalUrl,
      method,
      headers,
      data: body,
    });

    return response.data;
  } catch (error) {
    console.error("[AxiosRequest] Request failed:", {
      url: finalUrl,
      method,
      body,
      error: error.message,
      response: error.response?.data,
    });

    if (error.response) {
      throw new ApiError(
        error.response.data.error || "Server responded with an error",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      throw new ApiError(
        "No response received from server",
        null,
        error.request
      );
    } else {
      throw new ApiError("Error setting up the request", null, error.message);
    }
  }
};

export const axiosPost = (config) =>
  createAxiosRequest({ ...config, method: "POST" });

export const axiosGet = (config) => {
  const { params, ...rest } = config;
  return createAxiosRequest({
    ...rest,
    method: "GET",
    params,
  });
};

export const axiosPatch = (config) =>
  createAxiosRequest({ ...config, method: 'PATCH' });


export const axiosDelete = (config) =>
  createAxiosRequest({ ...config, method: "DELETE" });

// Helper function to check if object has any non-null values
const hasValidParams = (params) => {
  return (
    params &&
    Object.values(params).some((value) => value !== undefined && value !== null)
  );
};

// Export for testing
export const __testing = {
  createAxiosRequest,
  hasValidParams,
};
