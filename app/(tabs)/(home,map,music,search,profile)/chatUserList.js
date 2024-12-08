import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Text } from "react-native";
import { ChatService } from "../../../services/ChatService";
import { router } from "expo-router";

export default function UserListScreen({ navigation }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setError(null);
            const response = await ChatService.getAllChatUsers();
            console.log(response);
            setUsers(response);
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("Unable to load users");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchUsers();
    }, []);

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
                router.push({
                    pathname: "chatScreen",
                    params: {
                        otherUserId: item.id,
                        otherUserName: item.name,
                    },
                })
            }
        >
            <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>
                    {item.name?.charAt(0)?.toUpperCase() || "?"}
                </Text>
            </View>
            <View style={styles.userInfo}>
                <View style={styles.topRow}>
                    <Text style={styles.userName}>{item.name || "Unknown User"}</Text>
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    Tap to start chatting
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.centerContainer}>
                        <Text style={styles.errorText}>Unable to load users</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        padding: 15,
        marginLeft: 15,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '500',
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    userItem: {
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    placeholderAvatar: {
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    userInfo: {
        flex: 1,
        justifyContent: "center",
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    lastMessage: {
        fontSize: 14,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "#ff3b30",
        textAlign: "center",
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    retryButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007AFF",
        borderRadius: 8,
    },
    retryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
});
