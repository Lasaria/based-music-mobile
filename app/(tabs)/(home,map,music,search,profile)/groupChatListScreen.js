import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    Modal,
    TextInput,
} from "react-native";
import { Text } from "react-native";
import { ChatService } from "../../../services/ChatService";
import { router } from "expo-router";



export default function GroupChatListScreen() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);

    const fetchGroups = async () => {
        try {
            setError(null);
            const response = await ChatService.getAllGroupChats();
            setGroups(response);
        } catch (err) {
            setError("Unable to load groups");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            const users = await ChatService.getAllChatUsers();
            setAvailableUsers(users);
        } catch (err) {
            setError("Unable to load users");
        }
    };

    const createGroup = async () => {
        if (groupName.trim() === "" || selectedUsers.length < 2) {
            setError("Please enter a group name and select at least 2 users");
            return;
        }

        try {
            await ChatService.createGroupChat(groupName, selectedUsers);
            setModalVisible(false);
            setGroupName("");
            setSelectedUsers([]);
            fetchGroups();
        } catch (err) {
            setError("Failed to create group");
        }
    };

    useEffect(() => {
        fetchGroups();
        fetchAvailableUsers();
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchGroups();
    }, []);

    const toggleUserSelection = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const renderGroupItem = ({ item }) => (
        <TouchableOpacity
            style={styles.groupItem}
            onPress={() =>
                router.push({
                    pathname: "groupChatScreen",
                    params: {
                        groupId: item.id || item.chat_id,
                        groupName: item.name,
                    },
                })
            }
        >
            <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>
                    {item.name?.charAt(0)?.toUpperCase() || "G"}
                </Text>
            </View>
            <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.memberCount}>
                    {item.memberCount || 0} members
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

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.createButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.createButtonText}>Create New Group</Text>
            </TouchableOpacity>

            <FlatList
                data={groups}
                renderItem={renderGroupItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.centerContainer}>
                        <Text style={styles.emptyText}>No groups yet</Text>
                    </View>
                )}
            />

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Create New Group</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Group Name"
                            value={groupName}
                            onChangeText={setGroupName}
                        />
                        <FlatList
                            data={availableUsers}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.userSelectItem,
                                        selectedUsers.includes(item.id) && styles.selectedUser
                                    ]}
                                    onPress={() => toggleUserSelection(item.id)}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            style={styles.userList}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.createButton]}
                                onPress={createGroup}
                            >
                                <Text style={styles.buttonText}>Create</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    },
    groupItem: {
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
    groupInfo: {
        flex: 1,
    },
    groupName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    memberCount: {
        fontSize: 14,
        color: "#666",
    },
    createButton: {
        margin: 15,
        padding: 15,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        alignItems: "center",
    },
    createButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    userList: {
        maxHeight: 200,
        marginBottom: 15,
    },
    userSelectItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    selectedUser: {
        backgroundColor: "#e3f2fd",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: "#ff3b30",
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "500",
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});