import React from 'react'
import { View, Text, Button } from 'react-native'
import Style from '../../../style'
import { router } from 'expo-router';

function MusicScreen() {
  return (
    <View style={Style.container}>
      <Text style={Style.text}>Music Screen</Text>
      <Button title="Favorites" onPress={() => router.push("/favorites")} />
      <Button title="Stream music" onPress={() => router.push("/streamMusic")} />
    </View>
  )
}

export default MusicScreen