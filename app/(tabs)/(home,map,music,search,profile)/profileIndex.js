import React from 'react'
import { View, Text, Button } from 'react-native'
import Style from '../../../style'
import { router } from 'expo-router';

function ProfileScreen() {
  return (
    <View style={Style.container}>
      <Text style={Style.text}>Profile Screen</Text>
      <Button title="Listener Profile" onPress={() => router.push("/listenerProfile")} />
    </View>
  )
}

export default ProfileScreen