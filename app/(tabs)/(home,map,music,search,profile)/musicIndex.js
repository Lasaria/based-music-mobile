import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  Button,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Style from "../../../style";
import AudioPlayer from "./audioPlayer";
import { FlatList } from "react-native-gesture-handler";
import { color } from "react-native-elements/dist/helpers";

function MusicScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("My Library");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaylist, setIsPlaylist] = useState(true);
  const [isSongs, setIsSongs] = useState(false);
  const [isAlbums, setIsAlbums] = useState(false);
  const [isUploads, setIsUploads] = useState(false);

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

  const displayPlaylist = () => {
    setIsPlaylist(true);
    setIsSongs(false);
    setIsAlbums(false);
    setIsUploads(false);
  };

  const displaySongs = () => {
    setIsPlaylist(false);
    setIsAlbums(false);
    setIsUploads(false);
    setIsSongs(true);
   
  };

  const displayAlbums = () => {
    setIsAlbums(true);
    setIsSongs(false);
    setIsPlaylist(false);
    setIsUploads(false);
  };

  const displayUploads = () => {
    setIsUploads(true);
    setIsAlbums(false);
    setIsSongs(false);
    setIsPlaylist(false);
  };

  const playlist = [
    {
      id: "1",
      title: "Favorites",
      num: 6,
      duration: "3:24",
      profileImage: require("../../../assets/images/profile1.png"),
    },
    {
      id: "2",
      title: "English pop",
      num: 4,
      duration: "2:24",
      profileImage: require("../../../assets/images/profile2.jpg"),
    },
    {
      id: "3",
      title: "Only for me",
      num: 3,
      duration: "3:26",
      profileImage: require("../../../assets/images/profile3.jpg"),
    },
    {
      id: "4",
      title: "My daily playlist",
      num: 8,
      duration: "4:20",
      profileImage: require("../../../assets/images/profile4.jpg"),
    },
    {
      id: "5",
      title: "Best friend",
      num: 2,
      duration: "4:50",
      profileImage: require("../../../assets/images/profile5.jpg"),
    },
    {
      id: "6",
      title: "Beach",
      num: 620,
      duration: "3:47",
      profileImage: require("../../../assets/images/profile6.jpg"),
    },
  ];

  const songs = [
    {
      id: "1",
      title: "Eat your young",
      artistName:"Drake",
      duration: "3:24",
      profileImage: require("../../../assets/images/profile1.png"),
    },
    {
      id: "2",
      title: "Little things",
      artistName:"Sabrina Carpenter",
      duration: "2:24",
      profileImage: require("../../../assets/images/profile2.jpg"),
    },
    {
      id: "3",
      title: "Only you",
      artistName:"Kendrick Lamar",
      duration: "3:26",
      profileImage: require("../../../assets/images/profile3.jpg"),
    },
    {
      id: "4",
      title: "Trash",
      artistName:"Kanye West",
      duration: "4:20",
      profileImage: require("../../../assets/images/profile4.jpg"),
    },
    {
      id: "5",
      title: "Best friend",
      artistName:"Anuv Jain",
      duration: "4:50",
      profileImage: require("../../../assets/images/profile5.jpg"),
    },
    {
      id: "6",
      title: "Beach",
      artistName:"Travis Scott",
      duration: "3:47",
      profileImage: require("../../../assets/images/profile6.jpg"),
    },
  ];

  const albums = [
    {
      id: "1",
      title: "Eat your young",
      artistName:"Drake",
     tracks: 10,
      profileImage: require("../../../assets/images/profile1.png"),
    },
    {
      id: "2",
      title: "Little things",
      artistName:"Sabrina Carpenter",
      tracks: 22,
      profileImage: require("../../../assets/images/profile5.jpg"),
    },
    {
      id: "3",
      title: "Only you",
      artistName:"Kendrick Lamar",
      tracks: 11,
      profileImage: require("../../../assets/images/profile3.jpg"),
    },
    {
      id: "4",
      title: "Trash",
      artistName:"Kanye West",
      tracks: 5,
      profileImage: require("../../../assets/images/profile2.jpg"),
    },
    {
      id: "5",
      title: "Best friend",
      artistName:"Anuv Jain",
      tracks: 13,
      profileImage: require("../../../assets/images/profile5.jpg"),
    },
    {
      id: "6",
      title: "Beach",
      artistName:"Travis Scott",
      tracks: 19,
      profileImage: require("../../../assets/images/profile6.jpg"),
    },
  ];


  const renderList = ({ item }) => {
    return (
      <View style={{ flex: 1,  }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginLeft:10,
          }}
        >
          <Image
            source={item.profileImage}
            style={{ borderRadius: 12, width: 50, height: 50 , marginRight:10}}
          />
          <View style={{ marginLeft: 10, marginVertical:10,  }}>
            <Text style={{ color: "white", paddingVertical:5 }}>{item.title}</Text>
            <Text style={{ color: "white" }}>
              {item.num}# of songs • {item.duration} min 
            </Text>
          </View>
          <Ionicons name="play" size={24} color="white" style={{position:'absolute', right:20}} />
        </View>
      </View>
    );
  };

  const renderSongs = ({ item }) => {
    return (
      <View style={{ flex: 1}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginLeft:10,
          }}
        >
          <Image
            source={item.profileImage}
            style={{ borderRadius: 12, width: 50, height: 50 , marginRight:10}}
          />
          <View style={{ marginLeft: 10, marginVertical:10,  }}>
            <Text style={{ color: "white", paddingVertical:5 }}>{item.title}</Text>
            <Text style={{ color: "white" }}>
              {item.artistName} • {item.duration} sec
            </Text>
          </View>

          <Ionicons name="play" size={24} color="white" style={{position:'absolute', right:20}} />
        </View>
      </View>
    );
  };

  const renderAlbums = ({ item }) => {
    return (
      <View style={{ flex: 1}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
            marginLeft:10,
          }}
        >
          <Image
            source={item.profileImage}
            style={{ borderRadius: 12, width: 50, height: 50 , marginRight:10}}
          />
          <View style={{ marginLeft: 10, marginVertical:10,  }}>
            <Text style={{ color: "white", paddingVertical:5 }}>{item.title}</Text>
            <Text style={{ color: "white" }}>
              {item.artistName} • {item.tracks} tracks
            </Text>
          </View>
          <Ionicons name="play" size={24} color="white" style={{position:'absolute', right:20}} />
        </View>
      </View>
    );
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

      <View
        style={styles.container}
      >
        <TouchableOpacity
          onPress={displayPlaylist}
          style={[styles.touchable, {borderColor: isPlaylist?"purple" :"white"}]}
        >
          <Text
            style={{
              textAlign: "center",
              color: isPlaylist ? "purple" : "white",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Playlist
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
              style={[styles.touchable, {borderColor: isSongs?"purple" :"white"}]}
              onPress={ displaySongs}
        >
          <Text
            style={{
              textAlign: "center",
              color: isSongs ? "purple" : "white",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Songs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.touchable, {borderColor: isAlbums?"purple" :"white"}]}
          onPress={displayAlbums}
        >
          <Text
            style={{
              textAlign: "center",
              color: isAlbums ? "purple" : "white",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Albums
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
         style={[styles.touchable, {borderColor: isUploads?"purple" :"white"}, {width:67}]}
         onPress={() => displayUploads}
        >
          <Text
            style={{
              textAlign: "center",
              color: isUploads ? "purple" : "white",
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            Uploads
          </Text>
        </TouchableOpacity>
      </View>

      {isPlaylist ? (
        <>
          <Text style={styles.currentScreenText}>Playlist</Text>
          <FlatList
            data={playlist}
            renderItem={renderList}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{paddingBottom:100}}
          />
        </>
      ) : isSongs? (
        <>
        <Text style={styles.currentScreenText}>
          Songs
          </Text>
          <FlatList
          data={songs}
          renderItem={renderSongs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{paddingBottom:100}}
          />
        </>
      ): isAlbums? (
        <>
        <Text style={styles.currentScreenText}>
          Albums
          </Text>
          <FlatList
          data={albums}
          renderItem={renderAlbums}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{paddingBottom:100}}
          />
        </>
      ): null}

      

      {/* <ScrollView style={{ marginBottom: 70 }}>
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
      </ScrollView> */}
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

const styles = StyleSheet.create({
  currentScreenText:{ color: "white", padding: 10, fontSize:18, fontWeight:'500' },
  container: {
    marginHorizontal: 20,
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  touchable:{
    borderRadius: 10,
    borderWidth: 1,
    padding: 5,
    width: 60,
    height: 30,
  }
})

export default MusicScreen;
