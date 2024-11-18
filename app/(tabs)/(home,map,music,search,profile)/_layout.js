import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import { Stack } from "expo-router";

export default function DynamicLayout({ segment }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {segment === "(home)" ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="homeIndex" options={{ title: "Home" }} />
          <Stack.Screen name="inbox" options={{ title: "Inbox" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen
            name="listenerProfile"
            options={{ title: "ListenerProfile" }}
          />
        </Stack>
      ) : segment === "(map)" ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="mapIndex" options={{ title: "Map" }} />
          <Stack.Screen
            name="listenerProfile"
            options={{ title: "ListenerProfile" }}
          />
        </Stack>
      ) : segment === "(music)" ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="musicIndex" options={{ title: "Music" }} />
          <Stack.Screen name="favorites" options={{ title: "Favorites" }} />
        </Stack>
      ) : segment === "(search)" ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="searchIndex" options={{ title: "Search" }} />
        </Stack>
      ) : segment === "(profile)" ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="profileIndex" options={{ title: "Profile" }} />
          <Stack.Screen name="inbox" options={{ title: "Inbox" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
          <Stack.Screen
            name="listenerProfile"
            options={{ title: "ListenerProfile" }}
          />
        </Stack>
      ) : null}
    </GestureHandlerRootView>
  );
}
