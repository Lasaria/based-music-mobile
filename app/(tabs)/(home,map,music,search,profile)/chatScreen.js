import { tokenManager } from "../../../utils/tokenManager";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { Text } from "react-native";
import { ChatService } from "../../../services/ChatService";
import { router, useLocalSearchParams } from "expo-router";
import MessageBubble from "../../../components/messageBubble";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../../../services/AuthService";

export default function ChatScreen() {
  const [currentUserId] = useState(async () => {
    const tokenString = await tokenManager.getAccessToken();
    try {
      const decoded = jwtDecode(tokenString);
      return decoded.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  });

  const { otherUserId, otherUserName } = useLocalSearchParams();
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef(null);

  const handleBack = () => {
    router.back();
  };

  const handleLongPress = (message) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMessage(message)
        }
      ]
    );
  };

  const deleteMessage = async (message) => {
    if (!ws || !chatId) return;

    try {
      const accessToken = await tokenManager.getAccessToken();

      const deleteData = {
        type: "delete_message",
        chatId,
        messageId: message.message_id,
        timestamp: new Date().toISOString(),
        token: accessToken,
      };

      ws.send(JSON.stringify(deleteData));

      // Optimistically remove message from UI
      setMessages((prev) => prev.filter(msg => msg.message_id !== message.message_id));
    } catch (err) {
      console.log("[chatScreen.js] Error deleting message:", err);
      Alert.alert("Error", "Failed to delete message. Please try again.");
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    let isMounted = true;

    const initializeChat = async () => {
      try {
        const response = await ChatService.initializeChat(otherUserId);
        if (isMounted && response.success) {
          setChatId(response.chatId);
          setMessages(response.messages || []);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [otherUserId]);

  useEffect(() => {
    if (!chatId) return;

    let ws = null;
    const connectWebSocket = () => {
      const token = tokenManager.getAccessToken();
      ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setWs(ws);
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        switch (message.type) {
          case "new_message":
            if (message.data.chatId === chatId) {
              setMessages((prev) => [...prev, message.data]);
            }
            break;
          case "message_deleted":
            if (message.data.chatId === chatId) {
              setMessages((prev) =>
                prev.filter(msg => msg.message_id !== message.data.messageId)
              );
            }
            break;
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setWs(null);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [chatId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !ws || !chatId) return;
    try {
      const accessToken = await tokenManager.getAccessToken()

      const messageData = {
        type: "chat_message",
        chatId,
        recipientId: otherUserId,
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
        token: accessToken,
      };

      ws.send(JSON.stringify(messageData));

      const newMessage = {
        message_id: Date.now().toString(),
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
        chatId: chatId,
      };

      setMessages((prev) => [...prev, newMessage]);
      setInputText("");
    } catch (err) {
      console.log("[chatScreen.js] Error fetching token while sending message", err)
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{otherUserName || "Chat"}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => {
          const isOwnMessage = item.sender_id ? item.sender_id.toString() === currentUserId._j : true;
          return (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              delayLongPress={500}
            >
              <MessageBubble
                message={item}
                isOwnMessage={isOwnMessage}
              />
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.message_id || Date.now().toString()}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
        onLayout={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          style={styles.input}
          multiline
          maxHeight={100}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[
            styles.sendButton,
            !inputText.trim() && styles.sendButtonDisabled,
          ]}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 20,
    flex: 1,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  messageList: {
    paddingVertical: 16,
    justifyContent: "flex-start",
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: "#fff",
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});