import { axiosGet, axiosPost, axiosPatch } from '../utils/axiosCalls';
import { SERVER_URL } from '@env';
import { tokenManager } from '../utils/tokenManager';

const serverURL = SERVER_URL;

class WebSocketManager {
    constructor() {
        this.ws = null;
        this.messageHandlers = new Set();
        this.statusHandlers = new Set();
        this.typingHandlers = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    async connect() {
        try {
            const token = await tokenManager.getAccessToken();
            if (!token) {
                throw new Error('No token available');
            }

            // Create WebSocket URL with token
            const wsUrl = `${serverURL.replace('http', 'ws')}/ws?token=${encodeURIComponent(token)}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.statusHandlers.forEach(handler => handler(true));
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.statusHandlers.forEach(handler => handler(false));
                this.handleReconnect();
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (this.ws.readyState === WebSocket.CLOSED) {
                    this.handleReconnect();
                }
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.messageHandlers.forEach(handler => handler(data));
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            this.handleReconnect();
        }
    }

    setupWebSocket() {
        this.ws.onopen = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
            this.statusHandlers.forEach(handler => handler(true));
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
            this.statusHandlers.forEach(handler => handler(false));
            this.handleReconnect();
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(message));
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            setTimeout(() => this.connect(), delay);
        }
    }

    send(data) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            throw new Error('WebSocket is not connected');
        }
    }

    onMessage(handler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    onConnectionStatus(handler) {
        this.statusHandlers.add(handler);
        return () => this.statusHandlers.delete(handler);
    }

    onTypingStatus(handler) {
        this.typingHandlers.add(handler);
        return () => this.typingHandlers.delete(handler);
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.messageHandlers.clear();
        this.statusHandlers.clear();
        this.typingHandlers.clear();
    }
}

const wsManager = new WebSocketManager();

export const ChatService = {
    wsManager,

    getAllChatUsers: async () => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chat/people`
            });

            console.log(response);

            if (response) {
                return response.map(user => ({
                    id: user.id,
                    name: user.display_name || user.username || `${user.first_name} ${user.last_name}`.trim(),
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching chat users:', error);
            throw error;
        }
    },

    initializeChat: async (otherUserId) => {
        try {
            const response = await axiosPost({
                url: `${serverURL}/chat`,
                body: { 
                    members: [otherUserId]
                }
            });

            console.log(response);

            if (response.chatId) {
                // Connect WebSocket after chat initialization
                await wsManager.connect();
                
                // Get initial messages
                const messagesResponse = await ChatService.getChatMessages(response.chatId);
                console.log("MESSAGES RESPONSE: ", messagesResponse);
                
                return {
                    success: true,
                    chatId: response.chatId,
                    messages: messagesResponse.messages || []
                };
            }
            throw new Error('Failed to initialize chat');
        } catch (error) {
            console.error('Error initializing chat:', error);
            throw error;
        }
    },

    getChatMessages: async (chatId) => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chat/${chatId}/messages`
            });
            console.log(response);
            return response;
        } catch (error) {
            console.error('Error getting messages:', error);
            throw error;
        }
    },

    sendMessage: async (chatId, content, files = []) => {
        try {
            if (files.length > 0) {
                const formData = new FormData();
                formData.append('content', content);
                
                files.forEach(file => {
                    formData.append('files', {
                        uri: file.uri,
                        type: file.type,
                        name: file.name
                    });
                });

                wsManager.send({
                    event: 'send_message',
                    chat_id: chatId,
                    content,
                    files: formData
                });
            } else {
                wsManager.send({
                    event: 'send_message',
                    chat_id: chatId,
                    content
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    deleteMessage: async (chatId, messageId) => {
        try {
            wsManager.send({
                event: 'delete_message',
                chat_id: chatId,
                message_id: messageId
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    },

    updateTypingStatus: (chatId, isTyping) => {
        try {
            wsManager.send({
                event: isTyping ? 'typing_start' : 'typing_stop',
                chat_id: chatId
            });
        } catch (error) {
            console.error('Error updating typing status:', error);
        }
    },

    markMessagesAsSeen: (chatId) => {
        try {
            wsManager.send({
                event: 'message_seen',
                chat_id: chatId
            });
        } catch (error) {
            console.error('Error marking messages as seen:', error);
        }
    },

    // Group chat methods remain the same but need to be updated to use WebSocket
    getAllGroupChats: async () => {
        try {
            const response = await axiosGet({
                url: `${serverURL}/chat`
            });

            if (response.success && response.data) {
                return response.data.filter(chat => chat.chat_type === 'GROUP')
                    .map(group => ({
                        id: group.chat_id,
                        name: group.chat_name,
                        memberCount: group.members.length,
                        lastMessage: group.last_message
                    }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching group chats:', error);
            throw error;
        }
    },

    createGroupChat: async (name, userIds) => {
        try {
            const response = await axiosPost({
                url: `${serverURL}/chat`,
                body: { 
                    chat_name: name, 
                    members: userIds,
                    chat_type: "GROUP"
                }
            });

            if (response.success) {
                await wsManager.connect();
                return {
                    success: true,
                    groupId: response.data.chat_id,
                    name: response.data.chat_name,
                    members: response.data.members
                };
            }
            throw new Error('Failed to create group chat');
        } catch (error) {
            console.error('Error creating group chat:', error);
            throw error;
        }
    }
};