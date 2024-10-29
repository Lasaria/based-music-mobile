import { axiosGet, axiosPatch, axiosPost } from '../utils/axiosCalls';

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
};