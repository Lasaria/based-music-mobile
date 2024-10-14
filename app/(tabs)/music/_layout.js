import React from 'react';
import { Stack } from 'expo-router';

export default function MusicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Music' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
      {/* Add more nested profile screens here */}
    </Stack>
  );
}