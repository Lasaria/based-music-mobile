import axios from 'axios';
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from '../utils/axiosCalls';
import { tokenManager } from '../utils/tokenManager';

// const serverURL = 'http://localhost:3000'
const serverURL = `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000`;


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

    getArtistProfile: async (artistId) => {
        try {
            // Pass artistId dynamically as a parameter
            const response = await axiosGet({
                url: `${serverURL}/artists/${artistId}/profile`,
            });
            console.log('Artist profile fetched successfully:', response);
            return response;
        } catch (err) {
            // Log the full error details
            console.error('Error fetching artist profile:', err.response ? err.response.data : err.message);
            throw new Error(err.response ? err.response.data.message : err.message); // Log server response error
        }
    },

    updateArtistProfile: async ({ artistId, name, bio, genre, location, contactEmail, profileImageURL, coverImageURL }) => {
        try {
            console.log('Sending the following data to update:', { name, bio, genre, location, contactEmail, profileImageURL, coverImageURL });

            const response = await axiosPatch({
                url: `${serverURL}/artists/${artistId}/profile`,
                body: JSON.stringify({ name, bio, genre, location, contactEmail, profileImageURL, coverImageURL }), // Ensure profileImageURL is sent
            });

            console.log('Artist profile updated successfully:', response);
            return response;
        } catch (err) {
            console.error('Error updating artist profile:', err.response ? err.response.data : err.message);
            throw new Error(err.response ? err.response.data.message : err.message);
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
    getProfileImages: async (artistId) => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/artists/${artistId}/profile-images`,
            });
            return response.images;
        } catch (error) {
            console.log("Error fetching profile images:", error.message);
            throw new Error(error.message || "Failed to fetch profile images");
        }
    },
    // Function to upload multiple profile images
    uploadMultipleProfileImages: async (artistId, formData) => {
        const response = await axios.post(
            `${serverURL}/artists/${artistId}/profile-images`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.uploadedFiles;
    },

    updateArtistProfileImage: async (artistId, mainPhotoUri) => {
        try {
            const response = await axiosPatch({
                url: `${serverURL}/artists/${artistId}/profile`,
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
}