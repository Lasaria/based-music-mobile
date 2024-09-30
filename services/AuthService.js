import {
    CognitoUserPool,
    CognitoUser,
    CognitoUserAttribute,
    AuthenticationDetails,
  } from 'amazon-cognito-identity-js';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  // AWS Cognito Configuration
  const poolData = {
    UserPoolId: 'us-east-1_WtSuB1vEx', 
    ClientId: '2ao12pdqrs6cdonc3g7a95pbh8',
  };
  
  const userPool = new CognitoUserPool(poolData);
  
  // Sign Up Function with a non-email username
export const signUp = async (email, password, phoneNumber = null, preferredUsername = null) => {
    const attributeList = [];
  
    // Email Attribute (treated as alias)
    const emailAttribute = new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    });
    attributeList.push(emailAttribute);
  
    // Optional Phone Number Attribute
    if (phoneNumber) {
      const phoneAttribute = new CognitoUserAttribute({
        Name: 'phone_number',
        Value: phoneNumber, // Must be in '+1234567890' format
      });
      attributeList.push(phoneAttribute);
    }
  
    // Optional Preferred Username Attribute
    if (preferredUsername) {
      const usernameAttribute = new CognitoUserAttribute({
        Name: 'preferred_username',
        Value: preferredUsername,
      });
      attributeList.push(usernameAttribute);
    }
  
    // Create a username that's not the email
    // For example, we could use the first part of the email as the username
    const username = email.split('@')[0]; // or generate another identifier
  
    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result.user);
      });
    });
  };
  
  // Confirm Sign Up Function
  export const confirmSignUp = async (email, confirmationCode) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
  
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(
        confirmationCode,
        true,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  };
  
  // Sign In Function
  export const signIn = async (email, password) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
  
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
  
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (session) => {
          const idToken = session.getIdToken().getJwtToken();
          await AsyncStorage.setItem('idToken', idToken);
          resolve(session);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  };
  
  // Sign Out Function
  export const signOut = async () => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    await AsyncStorage.removeItem('idToken');
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
  
  