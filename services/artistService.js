import { axiosPost } from '../utils/axiosCalls';

const serverURL = 'http://localhost:3000'

export const ArtistService = {

    setArtistBasicInfo: async ({name, bio, genre}) => {
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
    }


};