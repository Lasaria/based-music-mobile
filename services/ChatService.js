import { axiosGet, axiosPost, axiosPatch } from '../utils/axiosCalls';
import { SERVER_URL, AUTHSERVER_URL } from '@env';

const serverURL = SERVER_URL;

export const ChatService = {
    getAllChatUsers: async () => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chats/get-all-chat-users`
            });

            if (response.data && response.success) {
                const newDataFormat = response.data.map(user => ({
                    id: user._id || user.id,
                    name: user.display_name || user.username || `${user.first_name} ${user.last_name}`.trim(),
                }));

                return newDataFormat;
            }
            return [];
        } catch (error) {
            console.error('Error fetching chat users:', error);
            throw error;
        }
    },

    initializeChat: async (otherUserId) => {
        try {
            // TODO: Need to think of a way to avoid sending real otherUserId.
            console.log("[ChatService][InitializeChat] otheruserid----------------", otherUserId)
            const response = await axiosPost({
                url: `${serverURL}/chats/initialize`,
                body: { otherUserId }
            });

            return {
                success: response.success,
                chatId: response.data.chatId,
                messages: response.data.messages || []
            };
        } catch (error) {
            console.error('Error initializing chat:', error);
            throw error;
        }
    },

    getChatMessages: async (chatId) => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chats/${chatId}/messages`
            });
            return response;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    getAllGroupChats: async () => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chats/groups`
            });

            if (response.success && response.data) {  // Changed to match backend response structure
                const formattedGroups = response.data.map(group => ({
                    id: group.id,  // Backend already sends it as 'id'
                    name: group.name,
                    memberCount: group.memberCount,  // Backend already calculates this
                    // lastMessage: group.lastMessage
                }));
                return formattedGroups;
            }
            return [];
        } catch (error) {
            console.error('Error fetching group chats:', error);
            throw error;
        }
    },

    createGroupChat: async (name, userIds) => {
        // Self user added on the server

        try {
            const response = await axiosPost({
                url: `${serverURL}/chats/groups/create`,
                // TODO: Need to encode them, or find another way to not send ids directly.
                body: { name, members: userIds }
            });

            return {
                success: response.success,
                groupId: response.data.groupId,
                name: response.data.name,
                members: response.data.members
            };
        } catch (error) {
            console.error('Error creating group chat:', error);
            throw error;
        }
    }
};