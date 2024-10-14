import React from 'react';
import { Stack } from 'expo-router';

export default function SearchLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Search' }} />
      {/* <Stack.Screen name="listenerProfile" options={{ title: 'ListenerProfile' }} /> */}
      {/* Add more nested profile screens here */}
    </Stack>
  );
}