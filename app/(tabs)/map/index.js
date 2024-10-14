import React from 'react'
import { View, Text, Button } from 'react-native'
import Style from '../../../style'
import { router } from 'expo-router';

function MapScreen() {
  return (
    <View style={Style.container}>
      <Text style={Style.text}>Map Screen</Text>
      <Button title="Listener Profile" onPress={() => router.push("/listenerProfile")} />
    </View>
  )
}

export default MapScreen