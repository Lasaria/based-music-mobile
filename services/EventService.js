import { axiosPost, axiosGet, axiosPut, axiosDelete } from '../utils/axiosCalls';

const serverURL = 'http://10.3.65.248:3000';

export const EventService = {
  createEvent: async (eventData) => {
    try {
      // Check if eventData has an eventId
      if (eventData.eventId) {
        // Update an existing event
        return await this.updateEvent(eventData.eventId, eventData);
      } else {
        // Create a new event
        const response = await axiosPost({
          url: `${serverURL}/events`,
          body: eventData,
        });
        console.log('Event created successfully with no image:', response);
        return response;
      }
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
      
      console.log('Using eventId:', eventId); // Debug log
      console.log('Update payload:', updatedEventData); // Debug log
      
      const response = await axiosPut({
        url: `${serverURL}/events/${eventId}`,
        body: updatedEventData,
        
      });
      
      console.log('Event updated successfully:', response);
      return response;
    } catch (err) {
      console.error('API Request Error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message);
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