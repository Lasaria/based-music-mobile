import React from 'react'
import { View, Text, Button } from 'react-native'
import Style from '../../../style'
import { router } from 'expo-router';
import ArtistProfileScreen from './artistProfile';


function ProfileScreen() {
  return (
    <View style={Style.container}>
      <Text style={Style.text}>Profile Screen</Text>
      <Button title="Listener Profile" onPress={() => router.push("/listenerProfile")} />
      <Button title="Artist Profile" onPress={() => router.push("/artistProfile")} />
    </View>
  )
}

export default ProfileScreen