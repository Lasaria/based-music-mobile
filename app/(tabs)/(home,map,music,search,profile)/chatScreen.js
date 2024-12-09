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
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "react-native";
import { ChatService } from "../../../services/ChatService";
import { router, useLocalSearchParams } from "expo-router";
import MessageBubble from "../../../components/messageBubble";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "../../../services/AuthService";
import { Ionicons } from "@expo/vector-icons";

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
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMessage(message),
        },
      ],
      { cancelable: true }
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
      setMessages((prev) =>
        prev.filter((msg) => msg.message_id !== message.message_id)
      );
    } catch (err) {
      console.log("[chatScreen.js] Error deleting message:", err);
      Alert.alert("Error", "Failed to delete message", [{ text: "OK" }]);
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
                prev.filter((msg) => msg.message_id !== message.data.messageId)
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
      const accessToken = await tokenManager.getAccessToken();

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
      console.log("[chatScreen.js] Error sending message:", err);
      Alert.alert("Error", "Failed to send message", [{ text: "OK" }]);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>{otherUserName || "Chat"}</Text>
          <View style={styles.connectionIndicator}>
            <View
              style={[
                styles.connectionDot,
                { backgroundColor: isConnected ? "#34C759" : "#FF3B30" },
              ]}
            />
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => {
            const isOwnMessage = item.sender_id
              ? item.sender_id.toString() === currentUserId._j
              : true;
            return (
              <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                delayLongPress={500}
                activeOpacity={0.9}
              >
                <MessageBubble message={item} isOwnMessage={isOwnMessage} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.message_id || Date.now().toString()}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        <View style={styles.inputContainer}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message"
            placeholderTextColor="#8E8E93"
            style={styles.input}
            multiline
            maxHeight={100}
            returnKeyType="default"
            enablesReturnKeyAutomatically
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!inputText.trim()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="send"
              size={20}
              color="#FFFFFF"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  headerText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    textAlign: "center",
    marginRight: 40, // Offset for back button
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    left: 16,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 17,
    color: "#007AFF",
    marginLeft: 4,
  },
  connectionIndicator: {
    position: "absolute",
    right: 16,
    zIndex: 1,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  messageList: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#C6C6C8",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    borderRadius: 18,
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    marginRight: 8,
    fontSize: 16,
    color: "#000000",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sendButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  sendIcon: {
    marginLeft: 2, // Adjust for visual center
  },
});
