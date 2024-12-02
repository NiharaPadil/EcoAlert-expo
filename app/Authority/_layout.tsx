import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
      <Stack.Screen name="Screen1" options={{ headerShown: false }} />
      <Stack.Screen name="2_SOSDetail" options={{ headerShown: false }} />
      <Stack.Screen name="3_IncidentDetail" options={{ headerShown: false }} />
      <Stack.Screen name="4_Blogsauth" options={{ headerShown: false }} />
      <Stack.Screen name="5_Blogauthdetails" options={{ headerShown: false }} />
      <Stack.Screen name="6_EditBlog" options={{ headerShown: false }} />
      <Stack.Screen name="7_ShowBroadcast" options={{ headerShown: false }} />
      <Stack.Screen name="8_CapturedDetail" options={{ headerShown: false }} />
     

      
   </Stack>
    </ThemeProvider>
  );
}