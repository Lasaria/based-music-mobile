import { axiosPost } from '../utils/axiosCalls';

const serverURL = 'http://10.3.65.223:3000'

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
    }


};