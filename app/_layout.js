// app/_layout.js
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs, Stack } from "expo-router";
import { usePathname } from "expo-router";
import { AudioProvider } from "../contexts/AudioContext";
import { QueueProvider } from "../contexts/QueueContext";
import AudioPlayer from "../components/audioPlayer";

export default function RootLayout() {
  const pathname = usePathname();
  console.log(pathname);

  // List of routes that should not have bottom tabs
  const routesWithoutTabs = [
    "/welcome",
    "/signIn",
    "/signUp",
    "/confirmSignUp",
    "/forgotPassword",
    "/resetPassword",
    "/userTypeChoice",
  ];

  // Check if the current route should have tabs
  const shouldShowTabs = !routesWithoutTabs.includes(pathname);

  return (
    <QueueProvider>
      <AudioProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          {shouldShowTabs ? (
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          ) : (
            // For screens that shouldn't have tabs, use a Stack navigator
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="welcome" />
              <Stack.Screen name="signIn" />
              <Stack.Screen name="signUp" />
              <Stack.Screen name="confirmSignUp" />
              <Stack.Screen name="forgotPassword" />
              <Stack.Screen name="resetPassword" />
              <Stack.Screen name="userTypeChoice" />
            </Stack>
          )}

          {/* Render AudioPlayer globally at the bottom */}
          <AudioPlayer />
        </GestureHandlerRootView>
      </AudioProvider>
    </QueueProvider>
  );
}
