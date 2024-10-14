import React from 'react';
import { Stack } from 'expo-router';

export default function MapLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Map' }} />
      {/* <Stack.Screen name="listenerProfile" options={{ title: 'ListenerProfile' }} /> */}
      {/* Add more nested profile screens here */}
    </Stack>
  );
}