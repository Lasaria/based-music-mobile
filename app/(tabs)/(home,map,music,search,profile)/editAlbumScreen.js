import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

const editAlbumScreen = () => {
 
  const router = useRouter();
  const {title, isrc, genre, tracks, artwork, lyricsMapping, nameMapping} = useLocalSearchParams();


  // Parse only if the data was stringified before passing
  const parsedTracks = tracks ? JSON.parse(tracks) : [];
  const parsedArtwork = artwork ? JSON.parse(artwork) : null;
  const parsedLyricsMapping = lyricsMapping ? JSON.parse(lyricsMapping) : {};
  const parsedNameMapping = nameMapping ? JSON.parse(nameMapping) : {};

  return (
   <View style={{flex:1, justifyContent:'center', padding:10, paddingVertical:10, paddingHorizontal:5}}>
      <Text style={{color:"black", fontSize:14}}  >Title: {title}</Text>
      <Text style={{color:"black", fontSize:14}} >ISRC: {isrc}</Text>
      <Text style={{color:"black", fontSize:14}}>Genre: {genre}</Text>
       {/* Display only the URIs for each track */}
       <Text style={{ color: "black", fontSize: 14 }}>Tracks URIs:</Text>
      {parsedTracks.map((track, index) => (
        <Text key={index} style={{ color: "black", fontSize: 12, marginLeft: 10 }}>
          {track.uri}
        </Text>
      ))}
      <Text style={{color:"black", fontSize:14}}>Lyrics Mapping: {JSON.stringify(parsedLyricsMapping, null, 2)}</Text>
      <Text style={{color:"black", fontSize:14}}>Name Mapping: {JSON.stringify(parsedNameMapping, null, 2)}</Text>
    </View>
  )
}

export default editAlbumScreen