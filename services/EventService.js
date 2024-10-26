import { tokenManager } from '../utils/tokenManager';
import { axiosPost } from '../utils/axiosCalls';

const serverURL = 'http://10.3.65.223:3000';

export const EventService = {
  /*uploadImage: async (formData) => {
    const response = await fetch(`${serverURL}/events/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await tokenManager.getAccessToken()}`
      },
      body: formData
    });
    return response.json();
  },*/

  createEvent: async (eventData) => {
    try {
      const response = await axiosPost({
        url: `${serverURL}/events`,
        body: eventData,
      });


      console.log('Event created successfully with no image:', response);
      return response;
    } catch (err) {
      console.error('Error:', err.message);
      throw new Error(err.message);
    }
  }
};