import AsyncStorage from '@react-native-async-storage/async-storage';

const serverURL = 'http://localhost:3000'
 
// Sign Up Function (No preferred_username during sign-up)
export const signUp = async (email, password, phoneNumber) => {
    try {
      const response = await fetch(`${serverURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, phoneNumber }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('User signed up successfully:', result);
      } else {
        console.error('Sign-up error:', result.error);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  
  // Confirm Sign Up Function
  export const confirmSignUp = async (email, confirmationCode) => {
    try {
        console.log("EMAIL: "+ email)
        console.log("Code: " + confirmationCode);
        const response = await fetch(`${serverURL}/confirmsignup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, confirmationCode }),
        });

        const result = await response.json();

        console.log(result)
    
        if (response.ok) {
          console.log('User confirmed successfully:', result);
        } else {
          console.error('User confirmation error:', result.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
  };
  
  // Sign In Function
  export const signIn = async (email, password) => {
    try {
        console.log("EMAIL: "+ email)
        console.log("Code: " + password);
        const response = await fetch(`${serverURL}/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        console.log(result)
    
        if (response.ok) {
          console.log('User signed in successfully:', result);
        } else {
          console.error('Sign-in error:', result.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
  };

  // Forgot Password Function
  export const forgotPassword = async (email) => {
    try {
        console.log("EMAIL: "+ email)
        const response = await fetch(`${serverURL}/forgotpassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        console.log(result)
    
        if (response.ok) {
          console.log('Forgot password started successfully:', result);
        } else {
          console.error('Forgot password error:', result.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
  };

   // Confirm Password Reset Function
   export const confirmForgotPassword = async (email, confirmationCode, newPassword) => {
    try {
        console.log("EMAIL: "+ email)
        const response = await fetch(`${serverURL}/confirmforgotpassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, confirmationCode, newPassword }),
        });

        const result = await response.json();

        console.log(result)
    
        if (response.ok) {
          console.log('Password reset successfully:', result);
        } else {
          console.error('Resetting password error:', result.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
  };
  
  // Sign Out Function
  export const signOut = async (accessToken) => {
    try {
        console.log("EMAIL: "+ email)
        const response = await fetch(`${serverURL}/signout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        });

        const result = await response.json();

        console.log(result)
    
        if (response.ok) {
          console.log('User Signed Out successfully:', result);
        } else {
          console.error('Error Signing User Out:', result.error);
        }
      } catch (err) {
        console.error('Error:', err);
      }
  };


  
  
  // Check Authentication State
  export const checkAuthState = async () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      return new Promise((resolve, reject) => {
        cognitoUser.getSession(async (err, session) => {
          if (err) {
            reject(err);
            return;
          }
          if (session.isValid()) {
            const idToken = session.getIdToken().getJwtToken();
            await AsyncStorage.setItem('idToken', idToken);
            resolve(true);
          } else {
            await AsyncStorage.removeItem('idToken');
            resolve(false);
          }
        });
      });
    } else {
      await AsyncStorage.removeItem('idToken');
      return false;
    }
  };
  
  