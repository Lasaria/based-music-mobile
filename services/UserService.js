import { axiosPost } from '../utils/axiosCalls';

const serverURL = 'http://localhost:3000'

export const UserService = {

    setUserType: async (userType) => {
        try {
            const response = await axiosPost({
                url: `${serverURL}/users/set-user-type`,
                body: JSON.stringify({ userType: userType }),
            });


            console.log('User type updated successfully:', response);

        } catch (err) {
            console.error('Error:', err.message);
            throw new Error(err.message);
        }
    },
    // !TODO RETRIEVE USER INFO
    getUserInfo: async () => { // No need for userId parameter anymore
        try {
            const userId = await tokenManager.getUserId(); // Get user ID dynamically from token
            const response = await axiosGet({
                url: `${serverURL}/users/${userId}`,
            });
            return response;
        } catch (err) {
            console.error('Error fetching user info:', err.message);
            throw new Error(err.message);
        }
    },
};