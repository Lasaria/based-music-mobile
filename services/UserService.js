
import axios from 'axios';
import { axiosGet, axiosPost, axiosPatch, axiosDelete } from '../utils/axiosCalls';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { tokenManager } from '../utils/tokenManager';
import { uploadImage } from '../utils/imageUploadManager';
import useProfileStore from '../zusStore/userFormStore';
import { AuthService } from './AuthService';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const serverURL = SERVER_URL;

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
            const genreNames = selectedGenres.map(genre => genre.genre);

            // Logging in here, finally, before setting up profile
            //await AuthService.signIn(email, password)

            // Logging in with AuthService when email starts with "google-"
            await AuthService.signIn(email, password);
            console.log('Login successful');
            // Add any additional logic here, like navigating to the next screen


            const sub = await tokenManager.getUserId();

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
    },

    getUserInfo: async () => {
        try {
            const userId = await tokenManager.getUserId();
            const response = await axiosGet({
                url: `${serverURL}/users/${userId}`,
            });
            return response;
        } catch (err) {
            console.error('Error fetching user info:', err.message);
            throw new Error(err.message);
        }
    },

    // * Fetch user profile 
    getUserProfile: async (userId) => {
        try {
            // Pass userId dynamically as a parameter
            const response = await axiosGet({
                url: `${serverURL}/users/${userId}/profile`,
            });
            console.log('User profile fetched successfully:', response);
            console.log("Received userId:", userId); // Log userId
            return response;
        } catch (err) {
            // Log the full error details
            console.error('Error fetching user profile:', err.response ? err.response.data : err.message);
            throw new Error(err.response ? err.response.data.message : err.message); // Log server response error
        }
    },

    // * Update user profile 
    updateUserProfile: async ({ userId, display_name, username, description, selected_genres, user_location, cover_image_url, profile_image_url, token, last_updated_username, }) => {
        try {
            const profileData = {
                display_name,
                username,
                description,
                selected_genres,
                user_location,
                cover_image_url,
                profile_image_url,
                last_updated_username,

            };

            console.log('About to send the following data for update:', profileData);

            const response = await axiosPatch({
                url: `${serverURL}/users/${userId}/profile`,
                body: JSON.stringify(profileData),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Update response:', response.data);
            return response.data;
        } catch (err) {
            console.error('Error updating profile:', err.message);
            throw new Error(err.message);
        }
    },

    // * fetch all artist's tracks
    fetchTracks: async (userId, lastEvaluatedKey = null) => {
        try {
            console.log('Fetching tracks for artist:', {
                userId,
                lastEvaluatedKey
            });

            const params = new URLSearchParams();
            if (lastEvaluatedKey) {
                params.append('lastEvaluatedKey', lastEvaluatedKey);
            }
            params.append('limit', '10');

            const url = `${serverURL}/tracks/api/users/${userId}/tracks?${params.toString()}`;
            console.log('Request URL:', url);

            const response = await axiosGet({
                url,
                isAuthenticated: true
            });

            console.log('Track fetch response:', {
                trackCount: response.tracks?.length,
                hasMorePages: response.hasMorePages
            });

            return {
                tracks: response.tracks || [],
                lastEvaluatedKey: response.lastEvaluatedKey,
                hasMorePages: response.hasMorePages
            };
        } catch (error) {
            console.error("Detailed fetch error:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || "Failed to fetch tracks");
        }
    },

    // * Delete artist tracks
    deleteTrack: async (trackId) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${serverURL}/tracks/delete?trackId=${encodeURIComponent(trackId)}`, // Use single trackId
                headers: {
                    Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
                },
            });
            console.log('Track deleted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to delete selected track:', error.message);
            throw new Error(error.message || 'Failed to delete selected track');
        }
    },

    // * fetch all artist's albums
    fetchAlbums: async (userId, lastEvaluatedKey = null) => {
        try {
            const params = new URLSearchParams();
            if (lastEvaluatedKey) {
                params.append('lastEvaluatedKey', lastEvaluatedKey);
            }
            params.append('limit', '10');

            const url = `${serverURL}/albums/api/users/${userId}/albums?${params.toString()}`;
            console.log('Request URL:', url);

            // Retrieve the access token
            const accessToken = await tokenManager.getAccessToken();
            console.log('Access Token:', accessToken); // Log the access token

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Use the retrieved access token here
                },
            });

            console.log('Albums fetch response:', response.data);

            return {
                albums: response.data.albums || [],
                lastEvaluatedKey: response.data.lastEvaluatedKey,
                hasMorePages: response.data.hasMorePages
            };
        } catch (error) {
            console.error("Error fetching albums:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw new Error(error.response?.data?.message || "Failed to fetch albums");
        }
    },

    // * Delete artist albums and their tracks in album
    deleteAlbum: async (albumId) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `${serverURL}/albums/delete?albumId=${encodeURIComponent(albumId)}`,
                headers: {
                    Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
                },
            });
            console.log('Album deleted successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to delete selected album:', error.message);
            throw new Error(error.message || 'Failed to delete selected album');
        }
    },

    // * Fetch all profile images by user
    getProfileImages: async (userId) => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/users/${userId}/profile-images`,
            });
            return response.images;
        } catch (error) {
            console.log("Error fetching profile images:", error.message);
            throw new Error(error.message || "Failed to fetch profile images");
        }
    },

    // * Upload Multiple images for profile image
    uploadMultipleProfileImages: async (userId, formData) => {
        const response = await axios.post(
            `${serverURL}/users/${userId}/profile-images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.uploadedFiles;
    },

    // * Update user profile image
    updateUserProfileImage: async (userId, mainPhotoUri) => {
        try {
            const response = await axiosPatch({
                url: `${serverURL}/users/${userId}/profile`,
                body: JSON.stringify({ mainPhotoUri }),
                headers: { Authorization: `Bearer ${await tokenManager.getAccessToken()}` }
            });
            console.log('Profile image updated successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Failed to update profile image:', error.response ? error.response.data : error.message);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    },

    // * Update user cover image
    updateUserCoverImage: async (userId, formData) => {
        try {
            const response = await axios.patch( // Change to patch
                `${serverURL}/users/${userId}/cover-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
                    },
                }
            );
            console.log("Cover image updated successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("Failed to update cover image:", error.response ? error.response.data : error.message);
            throw new Error(error.response ? error.response.data.message : error.message);
        }
    },

    // * Check if user is available or taken
    checkUsernameAvailability: async (username, requiresAuth = false) => {
        try {
            console.log("Checking username availability in service for:", username);

            // Prepare headers conditionally based on whether authentication is required
            const headers = requiresAuth
                ? { Authorization: `Bearer ${await tokenManager.getAccessToken()}` }
                : {};

            const response = await axios.post(
                `${serverURL}/users/check-username`,
                { username },
                { headers }
            );

            console.log("Received response from username check:", response.data);
            return response.data.available;
        } catch (err) {
            console.error('Error checking username availability:', err.message);
            return false; // Assume username is taken if an error occurs
        }
    },

    // Check if a user is following a another user
    checkIsFollowing: async (followee_id) => {
        console.log("Followee: ", followee_id);
        try {
            const response = await axiosGet({
                url: `${serverURL}/follow/isFollowing/${followee_id}`
            })
            console.log("Check if following: ", response, `${serverURL}/follow/isFollowing/${followee_id}`);
            return response.isFollowing;
        } catch (err) {
            console.error(`Error checking if user is following user ${followee_id}:`, err.message);
            return false;
        }
    },

    // Follow another user
    follow: async (followee_id) => {
        try {
            const response = await axiosPost({
                url: `${serverURL}/follow`,
                body: {followee_id: followee_id}
            })
            console.log(`Followed user:  ${followee_id}`, response);
            return true;
        } catch (err) {
            console.error(`Error following user ${followee_id}:`, err.message);
            return false;
        }
    },

    // Unfollow another user
    unfollow: async (followee_id) => {
        try {
            const response = await axiosDelete({
                url: `${serverURL}/follow`,
                body: {followee_id: followee_id}
            })
            console.log(`Unfollowed user:  ${followee_id}`, response);
            return false;
        } catch (err) {
            console.error(`Error unfollowing user ${followee_id}:`, err.message);
            return true;
        }
    },
};




