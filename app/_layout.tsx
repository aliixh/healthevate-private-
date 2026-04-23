import { Stack } from 'expo-router';
import { useFonts, PixelifySans_400Regular, PixelifySans_700Bold } from '@expo-google-fonts/pixelify-sans';
import { NovaCut_400Regular } from '@expo-google-fonts/nova-cut';
import { Gluten_400Regular, Gluten_700Bold } from '@expo-google-fonts/gluten';

export const unstable_settings = {
  initialRouteName: 'onboarding',
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PixelifySans_400Regular,
    PixelifySans_700Bold,
    NovaCut_400Regular,
    Gluten_400Regular,
    Gluten_700Bold,
  });

  if (!fontsLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
