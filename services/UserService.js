
import { axiosPost } from '../utils/axiosCalls';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { tokenManager } from '../utils/tokenManager';
import { uploadImage } from '../utils/imageUploadManager';
import useProfileStore from '../zusStore/userFormStore';
import { AuthService } from './AuthService';

const serverURL = 'http://localhost:3000';

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

    setupUserProfile: async () => {
        try {
            // Get all required data from store
            const {
                email,
                password,
                username,
                displayname,
                description,
                location,
                selectedGenres,
                profileImage,
                coverImage,
                additionalPhotos,
                userType
            } = useProfileStore.getState();

            console.log("EMAIl: ", email);
            console.log("PASSWORD: ", password);
            console.log("USERNAME: ", username);
            console.log("DISPLAYNAME: ", displayname);
            console.log("DESRIPTION: ", description);
            console.log("LOCATION: ", location);
            console.log("GENRES: ", selectedGenres);
            console.log("IMAGE PROFILE: ", profileImage);



            // Extract genre names from genre objects
            const genreNames = selectedGenres.map(genre => genre.name);

            // Logging in here, finally, before setting up profile
            await AuthService.signIn(email, password)

            // First API call: Send non-image data
            const profileResponse = await axiosPost({
                url: `${serverURL}/users/setup-user-profile`,
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    display_name: displayname || '',
                    description: description || '',
                    user_location: location || '',
                    selected_genres: genreNames.join(','),
                    user_type: userType || ''
                })
            });
    
            console.log("Basic profile data updated successfully", profileResponse);

            // Upload profile image
            if (profileImage) {
                await uploadImage(
                    profileImage,
                    `/users/upload-profile-image`,
                    'profileImage'
                );
            }

            // Upload cover image
            if (coverImage) {
                await uploadImage(
                    coverImage,
                    `/users/upload-cover-image`,
                    'coverImage'
                );
            }

            // Handle additional photos
            if (additionalPhotos?.length > 0) {
                const photosToUpload = additionalPhotos.filter(photo => photo !== profileImage);
                for (const [index, photo] of photosToUpload.entries()) {
                    await uploadImage(
                        photo,
                        `/users/upload-additional-profile-image`,
                        `additionalProfileImage`
                    );
                }
            }
    
            return profileResponse;
        } catch (err) {
            console.error("Error setting up user profile:", err);
            throw new Error(err.message || 'Error setting up profile');
        }
    }
};




