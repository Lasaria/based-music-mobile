import { tokenManager } from "./tokenManager";
import { AuthService } from "../services/AuthService";
import { router } from "expo-router";

const createFetchRequest = async ({
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
        throw error;
      }
    }

    try {
      accessToken = await tokenManager.getAccessToken();
    } catch (error) {
      throw error;
    }
  }

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

  // Prepare headers based on content type and authentication
  const headers = new Headers();
  if (method !== "GET" && !(body instanceof FormData)) {
    headers.append("Content-Type", contentType);
  }
  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }
  headers.append("Accept", "application/json");

  try {
    console.log(`[FetchRequest] Making ${method} request to:`, {
      url: finalUrl,
      method,
      headers: Object.fromEntries(headers.entries()),
      ...(method === "GET" ? {} : { body }),
    });

    const response = await fetch(finalUrl, {
      method,
      headers,
      ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}),
    });

    // Check if response is ok (status in the range 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Server responded with an error");
    }

    // Parse response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("[FetchRequest] Request failed:", {
      url: finalUrl,
      method,
      body,
      error: error.message,
    });
    throw error;
  }
};

// Export request methods
export const fetchPost = (config) =>
  createFetchRequest({ ...config, method: "POST" });

export const fetchPut = (config) =>
  createFetchRequest({ ...config, method: "PUT" });

export const fetchGet = (config) => {
  const { params, ...rest } = config;
  return createFetchRequest({
    ...rest,
    method: "GET",
    params,
  });
};

export const fetchPatch = (config) =>
  createFetchRequest({ ...config, method: "PATCH" });

export const fetchDelete = (config) =>
  createFetchRequest({ ...config, method: "DELETE" });

// Export for testing
export const __testing = {
  createFetchRequest,
};