import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Slider from "@react-native-community/slider";


const StreamMusic = ({ navigation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const totalTime = 180;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };


  //skips the song 10 sec backward
  const backward = () => {
    if (currentTime > 10) {
      setCurrentTime(currentTime - 10);
    }
  };

  //skips the songs 10 sec forward
  const forward = () => {
    if (currentTime < 170) {
      setCurrentTime(currentTime + 10);
    }
  };

  return (
    <View style={styles.mainConatiner}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.headerView}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        {/** will be replace by the actual album name */}
        <Text style={styles.headerText}>Album Name</Text>
        <TouchableOpacity onPress={() => toggleModal()} >
        <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </TouchableOpacity>

      </View>

      {/* Album Art(Cover) */}
      <View style={styles.artView}>
        <TouchableOpacity onPress={() => setIsLike(!isLike)}>
          <Image
            source={require("../../../assets/images/profile6.jpg")}
            style={styles.artImage}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ position: "absolute", right: 2, top: 5 }}
          onPress={() => setIsLike(!isLike)}
        >
          <Ionicons
            name={isLike ? "heart" : "heart-outline"}
            size={30}
            color={isLike ? "purple" : "white"}
          />
        </TouchableOpacity>
      </View>

      {/* Song Info */}
      <View style={styles.songView}>
        <Text style={styles.songText}>Not Like Us</Text>
        <View style={styles.songView}>
          <Text style={styles.songInnerText}>kendrick Lamar</Text>
          <View style={{ position: "absolute", left: "55%" }}>
            <TouchableOpacity>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ marginTop: 50 }}>
        <Slider
          style={{ width: "100%" }}
          minimumValue={0}
          maximumValue={totalTime}
          value={currentTime}
          onValueChange={(value) => setCurrentTime(value)}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "white" }}>{formatTime(currentTime)}</Text>
          <Text style={{ color: "white" }}>
            {formatTime(totalTime - currentTime)}
          </Text>
        </View>
      </View>

      {/* Playback Controls */}
      <View style={styles.playBackView}>
        <TouchableOpacity onPress={() => backward()}>
          <Ionicons name="play-back" size={30} color="white" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayPause}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={50}
            color="purple"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => forward()}>
          <Ionicons name="play-forward" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {/* Volume Control */}
      <View style={styles.volumeView}>
        <Ionicons name="volume-mute" size={24} color="white" />
        <Slider
          style={{ flex: 1, marginHorizontal: 10 }}
          minimumValue={0}
          maximumValue={1}
          value={0.5}
          minimumTrackTintColor="purple"
          maximumTrackTintColor="gray"
          thumbTintColor="purple"
        />
        <Ionicons name="volume-high" size={24} color="white" />
      </View>

      {/* currently connected Device */}
      <Text style={styles.currentDevice}>Device 1</Text>

      {/** bottom sheet modal */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
      <TouchableWithoutFeedback  onPress={closeModal}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={toggleModal} style={styles.modalItem}>
            <Ionicons name="list" size={24} color="white" />
            <Text style={styles.modalText}>View playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.modalText}>Add to queue</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Ionicons name="albums" size={24} color="white" />
            <Text style={styles.modalText}>View queue list</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Ionicons name="share-social" size={24} color="white" />
            <Text style={styles.modalText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Ionicons name="heart" size={24} color="white" />
            <Text style={styles.modalText}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalItem}>
            <Ionicons name="information-circle" size={24} color="white" />
            <Text style={styles.modalText}>About</Text>
          </TouchableOpacity>
        </View>
        </TouchableWithoutFeedback>
      </View>
      </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

// Helper function to format time in mm:ss
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: "#1c1c1c",
    paddingHorizontal: 20,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
  },
  headerText: { color: "white", fontSize: 16 },
  artView: { alignItems: "center", marginTop: 30 },
  artImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#333",
  },
  songView: {
    alignItems: "center",
    marginTop: 20,
    justifyContent: "center",
  },
  songText: { color: "white", fontSize: 20, fontWeight: "bold" },
  songInnerView: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  songInnerText: { color: "#888", fontSize: 14 },
  playBackView: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
  },
  volumeView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 50,
  },
  currentDevice: { color: "purple", textAlign: "center", marginTop: 20 },
  modalContainer:{
    flex:1,
    justifyContent:'flex-end',
    backgroundColor:"rgba(0,0,0,0.5)",
  },
  modalContent:{
    backgroundColor:"#1c1c1c",
    padding:20,
    borderTopEndRadius:20,
    borderTopRightRadius:20,
  },
  modalItem:{
    flexDirection:'row',
    alignItems:'center',
    paddingVertical:15,
    borderBottomWidth:1,
    borderBottomColor:'grey',
  },
  modalText:{
    color:'white',
    fontSize:16,
    marginLeft:18
  }
});

export default StreamMusic;
