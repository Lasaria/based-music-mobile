import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { tokenManager } from '../utils/tokenManager';

const useChatSocket = (chatId) => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        const connectSocket = async () => {
            try {
                const token = await tokenManager.getAccessToken();
                
                // Initialize socket connection with auth token
                socketRef.current = io('ws://localhost:3000', {
                    auth: { token },
                    transports: ['websocket'],
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                });

                // Connection event handlers
                socketRef.current.on('connect', () => {
                    console.log('Socket connected');
                    setIsConnected(true);
                    
                    // Join the chat room
                    socketRef.current.emit('join_chat', chatId);
                });

                // Message handlers
                socketRef.current.on('new_message', (message) => {
                    console.log('New message received:', message);
                    setMessages(prev => {
                        // Avoid duplicate messages
                        const exists = prev.some(m => m.message_id === message.message_id);
                        if (!exists) {
                            return [...prev, message];
                        }
                        return prev;
                    });
                });

                socketRef.current.on('message_deleted', (data) => {
                    setMessages(prev => 
                        prev.filter(msg => msg.message_id !== data.messageId)
                    );
                });

                socketRef.current.on('error', (error) => {
                    console.error('Socket error:', error);
                });

                socketRef.current.on('disconnect', () => {
                    console.log('Socket disconnected');
                    setIsConnected(false);
                });

            } catch (error) {
                console.error('Error connecting socket:', error);
            }
        };

        connectSocket();

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.emit('leave_chat', chatId);
                socketRef.current.disconnect();
            }
        };
    }, [chatId]);

    const sendMessage = async (content) => {
        if (!socketRef.current?.connected) {
            console.error('Socket not connected');
            return;
        }

        try {
            socketRef.current.emit('send_message', {
                chatId,
                content,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = (messageId) => {
        if (!socketRef.current?.connected) return;
        
        socketRef.current.emit('delete_message', {
            messageId,
            chatId
        });
    };

    return {
        isConnected,
        messages,
        sendMessage,
        deleteMessage
    };
};

export default useChatSocket;