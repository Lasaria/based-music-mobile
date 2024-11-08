import axios from 'axios';
import { axiosGet, axiosPatch, axiosPost } from '../utils/axiosCalls';
import { tokenManager } from '../utils/tokenManager';

const serverURL = 'http://localhost:3000'

export const ArtistService = {

    setArtistBasicInfo: async ({ name, bio, genre }) => {
        try {
            const response = await axiosPost({
                url: `${serverURL}/artists/set-artist-basic-info`,
                body: JSON.stringify(
                    {
                        name: name,
                        bio: bio,
                        genre: genre
                    }
                ),
            });

            console.log('Artist basic info set successfully:', response);

        } catch (err) {
            console.error('Error:', err.message);
            throw new Error(err.message);
        }
    },

    getUserProfile: async (userId) => {
        try {
            // Pass userId dynamically as a parameter
            const response = await axiosGet({
                url: `${serverURL}/artists/${userId}/profile`,
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

    updateUserProfile: async ({ userId, display_name, username, selected_genres, user_location, cover_image_url, profile_image_url, token, last_updated_username, }) => {
        try {
            const profileData = {
                display_name,
                username,
                selected_genres,
                user_location,
                cover_image_url,
                profile_image_url,
                last_updated_username,

            };

            console.log('About to send the following data for update:', profileData);

            const response = await axiosPatch({
                url: `${serverURL}/artists/${userId}/profile`,
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

    fetchTracks: async (artistId, lastEvaluatedKey = null) => {
        try {
            console.log('Fetching tracks for artist:', {
                artistId,
                lastEvaluatedKey
            });

            const params = new URLSearchParams();
            if (lastEvaluatedKey) {
                params.append('lastEvaluatedKey', lastEvaluatedKey);
            }
            params.append('limit', '10');

            const url = `${serverURL}/tracks/api/artists/${artistId}/tracks?${params.toString()}`;
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

    fetchAlbums: async (artistId, lastEvaluatedKey = null) => {
        try {
            const params = new URLSearchParams();
            if (lastEvaluatedKey) {
                params.append('lastEvaluatedKey', lastEvaluatedKey);
            }
            params.append('limit', '10');

            const url = `${serverURL}/albums/api/artists/${artistId}/albums?${params.toString()}`;
            console.log('Request URL:', url);

            // Retrieve the access token
            const accessToken = await tokenManager.getAccessToken(); // Ensure tokenManager is properly implemented
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

    getProfileImages: async (userId) => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/artists/${userId}/profile-images`,
            });
            return response.images;
        } catch (error) {
            console.log("Error fetching profile images:", error.message);
            throw new Error(error.message || "Failed to fetch profile images");
        }
    },

    uploadMultipleProfileImages: async (userId, formData) => {
        const response = await axios.post(
            `${serverURL}/artists/${userId}/profile-images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.uploadedFiles;
    },

    updateUserProfileImage: async (userId, mainPhotoUri) => {
        try {
            const response = await axiosPatch({
                url: `${serverURL}/artists/${userId}/profile`,
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

    checkUsernameAvailability: async (username) => {
        try {
            console.log("Checking username availability in service for:", username);
            const response = await axios.post(`${serverURL}/artists/check-username`, { username }, {
                headers: {
                    Authorization: `Bearer ${await tokenManager.getAccessToken()}`,
                },
            });
            console.log("Received response from username check:", response.data);
            return response.data.available; // This should be true or false based on server response
        } catch (err) {
            console.error('Error checking username availability:', err.message);
            return false; // Assume username is taken if an error occurs
        }
    },
}