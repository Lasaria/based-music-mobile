import React, { useEffect, useState } from "react";
import {StyleSheet, View, Text, Image} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SERVER_URL } from "@env";
import { axiosGet } from "../../../utils/axiosCalls";

const albumComponent = () => {
  const { album_id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [albumData, setAlbumsData] = useState(null);

  useEffect(() => {
    const fetchAlbumData = async () => {

      try{
      const response = await axiosGet({
        url: `${SERVER_URL}/albums?album_id=${album_id}`,
      });
      console.log("response ",response);

      setAlbumsData(response.album);
    }catch(error){
      console.error("Error fetching album data ", error);
    }finally{
      setLoading(false)
    }
    };

    if (album_id) {
      fetchAlbumData();
    }
  }, [album_id]);

   if(loading){
    return(
      <View style = {styles.container}>
        <Text style={styles.errorText}>Album not found</Text>
      </View>
    )
   }

   return (
    <View style={styles.container}>
      <Image
      source={{
        uri: albumData.cover_image_url || "https://via.placeholder.com/200"
      }}
      style={styles.coverImage}
      />
       <Text style={styles.title}>{albumData.title}</Text>
       <Text style={styles.subtitle}>{albumData.genre}</Text>
    </View>
   )
};

const styles =  StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#000",
    padding:20,
    alignItems:"center"
  },
  errorText:{
    fontSize:16,
    color:"red",
    textAlign:"center"
  },
  coverImage:{
    width:200,
    height:200,
    borderRadius:10,
    marginBottom:20
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'gray',
    fontSize: 16,
    marginTop: 10,
  },
});

export default albumComponent;
