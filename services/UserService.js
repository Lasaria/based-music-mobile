import { axiosPost } from '../utils/axiosCalls';
import uriToBlob from '../utils/uriManager';

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

    setupUserProfile: async (userData) => {
        try {
            const {
                profileData,
                profileImage,
                coverImage,
                additionalPhotos,
                selectedGenres
            } = userData;
            
            const {
                username,
                displayname,
                description,
                location
            } = profileData;

            console.log("\n\nbody:  ", {
                username,
                displayname,
                description,
                location,
                selectedGenres
            })
            
            // First API call: Send non-image data
            const profileResponse = await axiosPost({
                url: `${serverURL}/users/setup-user-profile`,
                method: "POST",
                body: JSON.stringify({
                    username,
                    displayname: displayname || '',  // Handle undefined with empty string
                    description: description || '',
                    location: location || '',
                    selectedGenres: Array.isArray(selectedGenres) ? selectedGenres.join(',') : selectedGenres
                })
            });
    
            console.log("Basic profile data updated successfully", profileResponse);
    
            // Second API call: Upload profile image if it exists
            // if (profileImage?.startsWith('file://')) {
            //     try {
            //         const profileBlob = await uriToBlob(profileImage);
            //         const profileImageFormData = new FormData();
            //         profileImageFormData.append('profileImage', profileBlob, 'profile-image.jpg');
    
            //         await RNBlobUtil.fetch(
            //             'PATCH',
            //             `${serverURL}/artists/${profileResponse.data.userId}/profile-image`,
            //             {
            //                 'Content-Type': 'multipart/form-data',
            //                 Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
            //             },
            //             [{
            //                 name: 'profileImage',
            //                 filename: 'profile.jpg',
            //                 type: 'image/jpeg',
            //                 data: RNBlobUtil.wrap(decodeURIComponent(profileImage.replace('file://', '')))
            //             }]
            //         );
            //         console.log("Profile image uploaded successfully");
            //     } catch (error) {
            //         console.error('Error uploading profile image:', error);
            //         throw new Error('Failed to upload profile image');
            //     }
            // }
    
            // Third API call: Upload cover image if it exists
            // if (coverImage?.startsWith('file://')) {
            //     try {
            //         const coverBlob = await uriToBlob(coverImage);
            //         const coverImageFormData = new FormData();
            //         coverImageFormData.append('coverImage', coverBlob, 'cover-image.jpg');
    
            //         await RNBlobUtil.fetch(
            //             'PATCH',
            //             `${serverURL}/artists/${profileResponse.data.userId}/cover-image`,
            //             {
            //                 'Content-Type': 'multipart/form-data',
            //                 Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
            //             },
            //             [{
            //                 name: 'coverImage',
            //                 filename: 'cover.jpg',
            //                 type: 'image/jpeg',
            //                 data: RNBlobUtil.wrap(decodeURIComponent(coverImage.replace('file://', '')))
            //             }]
            //         );
            //         console.log("Cover image uploaded successfully");
            //     } catch (error) {
            //         console.error('Error uploading cover image:', error);
            //         throw new Error('Failed to upload cover image');
            //     }
            // }
    
            return profileResponse;
        } catch (err) {
            console.error("Error setting up user profile:", err);
            throw new Error(err.message || 'Error setting up profile');
        }
    }

}