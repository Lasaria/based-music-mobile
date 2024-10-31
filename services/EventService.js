import { axiosPost, axiosGet, axiosPut, axiosDelete } from '../utils/axiosCalls';

const serverURL = 'http://10.3.65.248:3000';

export const EventService = {
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
  },

  getEvent: async (eventId) => {
    try {
      const response = await axiosGet({
        url: `${serverURL}/events/${eventId}`,
      });
      console.log('Event retrieved successfully:', response);
      return response;
    } catch (err) {
      console.error('Error fetching event:', err.message);
      throw new Error(err.message);
    }
  },

  getAllEvents: async () => {
    try {
      const response = await axiosGet({
        url: `${serverURL}/events`,
      });
      console.log('All events retrieved successfully:', response);
      return response;
    } catch (err) {
      console.error('Error fetching all events:', err.message);
      throw new Error(err.message);
    }
  },

  updateEvent: async (eventId, updatedEventData) => {
    try {
      const response = await axiosPut({
        url: `${serverURL}/events/${eventId}`,
        body: updatedEventData,
      });
      console.log('Event updated successfully:', response);
      return response;
    } catch (err) {
      console.error('Error:', err.message);
      throw new Error(err.message);
    }
  },

  deleteEvent: async (eventId) => {
    try {
      const response = await axiosDelete({
        url: `${serverURL}/events/${eventId}`,
      });
      console.log('Event deleted successfully:', response);
      return response;
    } catch (err) {
      console.error('Error:', err.message);
      throw new Error(err.message);
    }
  }
};