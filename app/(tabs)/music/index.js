import React from 'react'
import { View, Text, Button } from 'react-native'
import Style from '../../../style'
import { router } from 'expo-router';

function MusicScreen() {
  return (
    <View style={Style.container}>
      <Text style={Style.text}>Music Screen</Text>
      <Button title="Favorites" onPress={() => router.push("music/favorites")} />
    </View>
  )
}

export default MusicScreen