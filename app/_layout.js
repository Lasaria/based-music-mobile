import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { usePathname } from 'expo-router';

export default function RootLayout() {
  const pathname = usePathname();
  console.log(pathname)

  // List of routes that should not have bottom tabs
  const routesWithoutTabs = [
    '/welcome',
    '/signIn',
    '/signUp',
    '/confirmSignUp',
    '/forgotPassword',
    '/resetPassword',
    '/userTypeChoice'
  ];

  // Check if the current route should have tabs
  const shouldShowTabs = !routesWithoutTabs.includes(pathname);

  


  if (shouldShowTabs) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="(tabs)" options={{ headerShown: false }} />
        
        
        {/* Hide these screens from the tab bar */}
        {/* <Stack.Screen name="index" options={{ href: null }} />
        <Stack.Screen name="favorites" options={{ href: null }} />
        <Stack.Screen name="inbox" options={{ href: null }} />
        <Stack.Screen name="listenerProfile" options={{ href: null }} />
        <Stack.Screen name="settings" options={{ href: null }} />
        <Stack.Screen name="venueBookings" options={{ href: null }} />
        <Stack.Screen name="venueEvents" options={{ href: null }} />
        <Stack.Screen name="venueInfo" options={{ href: null }} />
        <Stack.Screen name="venueProfile" options={{ href: null }} /> */}
      </Stack>
    );
  } else {
    // For screens that shouldn't have tabs, use a Stack navigator
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signIn" />
        <Stack.Screen name="signUp" />
        <Stack.Screen name="confirmSignUp" />
        <Stack.Screen name="forgotPassword" />
        <Stack.Screen name="resetPassword" />
        <Stack.Screen name="userTypeChoice" />
      </Stack>
    );
  }
}