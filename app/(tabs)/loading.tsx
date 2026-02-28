import { useFonts, NovaCut_400Regular } from '@expo-google-fonts/nova-cut';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing, Radius,
         ButtonStyles, PopupStyles, ComponentStyles } from '@/constants/theme';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({ NovaCut_400Regular });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>healthevate</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.novaCut,
    fontSize: 172,
    color: Colors.greenOutline,
  },
});
