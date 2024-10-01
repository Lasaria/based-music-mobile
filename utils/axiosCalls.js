import axios from "axios";
import { tokenManager } from "./tokenManager";

export const axiosPost = async ({ url, body, isAuthenticated = true }) => {

    let accessToken;

    if (isAuthenticated) {
        accessToken = await tokenManager.getAccessToken();
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    };

    const response = await axios(url, {
        method: 'POST',
        headers: headers,
        data: body,
      });

    return response.data;
}

export const axiosGet = async ({ url, body, isAuthenticated = true }) => {

    let accessToken;

    if (isAuthenticated) {
        accessToken = await tokenManager.getAccessToken();
    }

    const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    };

    const response = await axios(url, {
        method: 'GET',
        headers: headers,
        data: body,
      });

    return response;
}