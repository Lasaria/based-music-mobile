import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Style from "../../../style";
import AudioPlayer from "./audioPlayer";

function MusicScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("My Library");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const handlePlayPause = (playing) => {
    console.log("Play/Pause handled:", playing);
    setIsPlaying(playing);
  };

  const handlePlayerReady = () => {
    setIsPlayerReady(true);
  };

  const handlePlayButtonPress = () => {
    if (isPlayerReady) {
      setIsPlaying(!isPlaying);
    } else {
      console.log("Player not ready yet");
    }
  };

  const renderMyLibrary = () => (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingHorizontal: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 24,
            fontWeight: "bold",
            marginRight: 240,
          }}
        >
          My Library
        </Text>
        <Ionicons name="settings-outline" size={24} color="white" />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#333",
          borderRadius: 10,
          padding: 8,
          marginBottom: 10,
        }}
      >
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor="gray"
          style={{ color: "white", flex: 1 }}
        />
      </View>

      <ScrollView style={{ marginBottom: 70 }}>
        <Button
          title={isPlaying ? "Stop Test Track" : "Play Test Track"}
          onPress={handlePlayButtonPress}
          disabled={!isPlayerReady}
        />
        {!isPlayerReady && (
          <Text style={{ color: "gray", textAlign: "center", marginTop: 10 }}>
            Loading audio player...
          </Text>
        )}
      </ScrollView>
    </View>
  );

  const renderForYou = () => (
    <ScrollView style={{ paddingHorizontal: 15, marginBottom: 70 }}>
      <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
        For You content coming soon...
      </Text>
    </ScrollView>
  );

  return (
    <View style={[Style.container, { backgroundColor: "#000", flex: 1 }]}>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          zIndex: 1,
          paddingTop: 60,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={[
              {
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor:
                  selectedTab === "My Library" ? "purple" : "#fff",
                marginRight: 5,
              },
            ]}
            onPress={() => setSelectedTab("My Library")}
          >
            <Text
              style={{
                color: selectedTab === "My Library" ? "#fff" : "#000",
                fontWeight: "bold",
              }}
            >
              MY LIBRARY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: selectedTab === "For You" ? "purple" : "#fff",
                marginLeft: 5,
              },
            ]}
            onPress={() => setSelectedTab("For You")}
          >
            <Text
              style={{
                color: selectedTab === "For You" ? "#fff" : "#000",
                fontWeight: "bold",
              }}
            >
              FOR YOU
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingTop: 120, flex: 1 }}>
        {selectedTab === "My Library" ? renderMyLibrary() : renderForYou()}
      </View>

      {/* Always render the AudioPlayer but hide it when not playing */}
      <View
        style={{
          position: "absolute",
          bottom: 50,
          left: 0,
          right: 0,
          paddingHorizontal: 10,
          opacity: isPlaying ? 1 : 0,
          height: isPlaying ? "auto" : 0,
        }}
      >
        <AudioPlayer
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onReady={handlePlayerReady}
        />
      </View>
    </View>
  );
}

export default MusicScreen;
