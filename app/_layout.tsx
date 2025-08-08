import { initDatabase } from '@/services/database';
import { UserProvider } from '@/services/userContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import './global.css';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      try {
        initDatabase((error) => {
          if (error) {
            console.log("Database init failed", error);
          } else {
            console.log("Database initialized successfully");
          }
        });
      } catch (err) {
        console.log("Database init failed", err)
      }
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="favorite" options={{ headerShown: false }} />
        <Stack.Screen name="notificari" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </UserProvider>
  );
}
