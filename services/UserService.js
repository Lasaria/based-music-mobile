import { axiosPost } from '../utils/axiosCalls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tokenManager } from '../utils/tokenManager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Updates from 'expo-updates';

const serverURL = 'http://localhost:3000'

export const UserService = {

    setUserType: async (userType) => {
        try {
            const response = await axiosPost({
              url: `${serverURL}/set-user-type`,
              body: JSON.stringify({ userType: userType }),
          });

      
            console.log('User type updated successfully:', response);
      
          } catch (err) {
              console.error('Error:', err.message);
              throw new Error(err.message);
          }
    }


};