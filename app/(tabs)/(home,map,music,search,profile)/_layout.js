import React from 'react';
import { Stack } from 'expo-router';

// function ProfileLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" options={{ title: 'Profile' }} />
//       <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
//       <Stack.Screen name="settings" options={{ title: 'Settings' }} />
//       {/* Add more nested profile screens here */}
//     </Stack>
//   );
// }

export default function DynamicLayout({ segment }) {
  if (segment === '(home)') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="homeIndex" options={{ title: 'Home' }} />
        <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="listenerProfile" options={{ title: 'ListenerProfile' }} />
        {/* Add more nested profile screens here */}
      </Stack>
    )
  } else if (segment === '(map)') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="mapIndex" options={{ title: 'Home' }} />
        <Stack.Screen name="listenerProfile" options={{ title: 'ListenerProfile' }} />
        {/* Add more nested profile screens here */}
      </Stack>
    )
  } else if (segment === '(music)') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="musicIndex" options={{ title: 'Home' }} />
        <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
        {/* Add more nested profile screens here */}
      </Stack>
    )
  } else if (segment === '(search)') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="searchIndex" options={{ title: 'Home' }} />
        {/* Add more nested profile screens here */}
      </Stack>
    )
  } else if (segment === '(profile)') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="profileIndex" options={{ title: 'Profile' }} />
        <Stack.Screen name="inbox" options={{ title: 'Inbox' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="listenerProfile" options={{ title: 'ListenerProfile' }} />
        <Stack.Screen name="artistProfile" options={{ title: 'Artist Profile', headerShown: true }} />
        {/* Add more nested profile screens here */}
      </Stack>
    )
  }
}
