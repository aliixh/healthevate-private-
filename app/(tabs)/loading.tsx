import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontFamily } from '@/constants/theme';

export default function LoadingScreen() {
  const [progress, setProgress] = React.useState(0);
  const [destination, setDestination] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
  let cancelled = false;

  async function init() {
    const value = await AsyncStorage.getItem('hasCompletedOnboarding');
    const dest = value === 'true' ? '/(tabs)/new_habit' : '/onboarding/gameIntro';

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.01;
        if (next >= 1) {
          clearInterval(interval);
          if (!cancelled) router.replace(dest as any);
          return 1;
        }
        return next;
      });
    }, 30);
  }

  void init();
  return () => { cancelled = true; };
}, []);

  return (
    <View style={styles.container}>
        <Stack.Screen options={{ title: 'Loading' }} /> 

        {/* Left border line */}
        <View style = {styles.borderLine} /> 
        {/* Left flowers */}
        <View style={styles.flowerBorder}>
            {Array.from({ length: 8 }).map((_, i) => (
                <Image
                    key={i}
                    source={require('@/assets/images/flower.png')}
                    style={[styles.flowerIcon, i % 2 === 1 && { transform: [{ scaleX: -1 }] }]}
                />
            ))}
        </View>

        {/* Main content */}
        <View style={styles.content}>
            <Text style={styles.title}>healthevate</Text>
            <Progress.Bar
                progress={progress}
                width={530}
                color={Colors.greenOutline}
                unfilledColor={'transparent'}
                borderColor={Colors.greenOutline}
                borderWidth={6}
                borderRadius={0}
                style={styles.progressBar}
                height={26}
            />
        </View>

        {/* Right flowers */}
        <View style={styles.flowerBorder}>
            {Array.from({ length: 8 }).map((_, i) => (
                <Image
                    key={i}
                    source={require('@/assets/images/flower.png')}
                    style={[styles.flowerIcon, i % 2 === 1 && { transform: [{ scaleX: -1}] }]}
                />
            ))}
        </View>
        
        {/* Right border line */}
        <View style={styles.borderLine} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    flexDirection: 'row',
  },
  borderLine: {
    width: 3,
    backgroundColor: Colors.orange,
    alignSelf: 'stretch',
    marginLeft: 8,
    marginRight: 8,
  },
  flowerBorder: {
    width: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  flowerIcon: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  title: {
    fontFamily: FontFamily.novaCut,
    fontSize: 72,
    color: Colors.greenOutline,
    letterSpacing: 4,
  },
  progressBar: {
  },
});
