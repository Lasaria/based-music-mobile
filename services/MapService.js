import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { axiosPost, axiosGet } from "../utils/axiosCalls";
import { tokenManager } from "../utils/tokenManager";

const serverURL = "http://localhost:3000";


export const MapService = {
  // Sign Up Function
  getAllMapData: async () => {
    try {
      const response = await axiosGet({
        url: `${serverURL}/maps/`,
        isAuthenticated: false,
      });

      console.log("All maps retrieved successfully:", response);
      return response;
    } catch (err) {
      console.error("Error:", err.message);
      throw new Error(err.message);
    }
  },

};

