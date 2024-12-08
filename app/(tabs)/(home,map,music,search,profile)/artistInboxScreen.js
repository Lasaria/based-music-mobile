import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { UserService } from "../../../services/UserService";



const messagesData = [
  {
    id: 1,
    name: "Marina Martinez",
    message: "I'm watching Friends, what are u doin? 😍",
    time: "34 min",
   profileImage: require("../../../assets/images/profile3.jpg"),
    unreadCount: 3,
  },
  {
    id: 2,
    name: "Lusy Ivka",
    message: "I'm watching Friends, what are u doin? 👍",
    time: "34 min",
   profileImage: require("../../../assets/images/profile4.jpg"),
    unreadCount: 1,
  },
  {
    id: 3,
    name: "Yana Kot",
    message: "I'm watching Friends, what are u doin?",
    time: "34 min",
   profileImage: require("../../../assets/images/profile5.jpg"),
    unreadCount: 2,
  },
];

const recentContacts = [
  {
    id: 1,
    name: "John Doe",
   profileImage: require("../../../assets/images/profile6.jpg"),
  },
  {
    id: 2,
    name: "Stef",
    profileImage: require("../../../assets/images/profile7.jpg"),
  },
  {
    id: 3,
    name: "Loran",
    profileImage: require("../../../assets/images/profile8.jpg"),
  },
  {
    id: 4,
    name: "Simon",
   profileImage: require("../../../assets/images/profile3.jpg"),
  },
  {
    id: 5,
    name: "Drake",
   profileImage: require("../../../assets/images/profile2.jpg"),
  },
  {
    id: 6,
    name: "Kendrick",
   profileImage: require("../../../assets/images/profile4.jpg"),
  },
  {
    id: 7,
    name: "Jonas",
   profileImage: require("../../../assets/images/profile5.jpg"),
  },
  {
    id: 8,
    name: "Taylor",
   profileImage: require("../../../assets/images/profile8.jpg"),
  },
];

const ArtistInboxScreen = () => {
  const [searchText, setSearchText] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () =>{
      const userData = await UserService.getUserInfo();
      
    };
    
    fetchData();
  }, []);

  const renderRecentContact = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={item.profileImage} style={styles.contactImage} />
      <Text style={styles.contactName}>{item.name}</Text>
    </View>
  );

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Image source={item.profileImage} style={styles.messageImage} />
      <View style={styles.messageInfo}>
        <Text style={styles.messageName}>{item.name}</Text>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <View style={styles.messageMeta}>
        <Text style={styles.messageTime}>{item.time}</Text>
        {item.unreadCount > 0 && (
          <View style={styles.unreadCountContainer}>
            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Text style={styles.editButton}>✎</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="search"
        placeholderTextColor="#888"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={recentContacts}
        renderItem={renderRecentContact}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recentContactsContainer}
      />
      <Text style={styles.recentText}>Recent</Text>
      <FlatList
        data={messagesData}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    color: "#fff",
    fontSize: 30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  editButton: {
    color: "#fff",
    fontSize: 24,
  },
  recentContactsContainer: {
    paddingBottom: 5, 
    marginBottom: -20, 
    height:80,
  },
  searchInput: {
    backgroundColor: "#1e1e1e",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 20,
    color: "#fff",
    marginBottom: 10,
  },
  contactContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  contactName: {
    color: "#fff",
    marginTop: 5,
    fontSize: 12,
  },
  recentText: {
    color: 'white',
    fontSize: 20,
    marginTop: '-50%',
    marginBottom: 10, 
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  messageImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageInfo: {
    flex: 1,
    marginLeft: 15,
  },
  messageName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  messageText: {
    color: "#888",
  },
  messageMeta: {
    alignItems: "flex-end",
  },
  messageTime: {
    color: "#888",
    fontSize: 12,
  },
  unreadCountContainer: {
    backgroundColor: "#6e00ff",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
  },
  unreadCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ArtistInboxScreen;