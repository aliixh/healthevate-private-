import { Colors, FontFamily } from '@/constants/theme';
import { PixelifySans_400Regular, PixelifySans_700Bold, useFonts } from '@expo-google-fonts/pixelify-sans';
import { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function GameInformationScreen() {
  const [fontsLoaded] = useFonts({ PixelifySans_400Regular, PixelifySans_700Bold });
  const [currentSlide, setCurrentSlide] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  if (!fontsLoaded) return null;

  const slides = [
    {
      title: 'Purpose of Healthevate',
      content: 'Healthevate is designed to support mental and physical wellbeing through structured, goal-oriented gameplay. By completing real-world habits, players advance in the story, unlock new features, and customize the game experience. This integration of habit tracking and narrative progression reinforces routines and encourages consistent personal growth over time.'
    },
    {
      title: 'How to Play',
      content: 'Players begin by setting achievable daily habits. When a habit is completed in real life, the app awards XP and coins, which enable progression through story chapters and access to interactive choices or customization options. Habit completion is tracked over time, providing insight into progress and encouraging regular engagement with both the game and daily routines.'
    },
    {
      title: 'Best Practices',
      items: [
        { label: 'Set realistic goals:', text: 'Start with small, achievable daily habits and gradually build up.' },
        { label: 'Be consistent:', text: 'Regular participation helps reinforce healthy routines and unlocks more in-game rewards.' },
        { label: 'Track your progress:', text: 'Use the game to monitor your activities and reflect on your growth.' },
        { label: 'Engage with the story:', text: 'Exploring story paths can make habit-building more motivating.' }
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < 2) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      setTimeout(() => setCurrentSlide(currentSlide + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      setTimeout(() => setCurrentSlide(currentSlide - 1), 150);
    }
  };

  const getTitleWidth = (title: string) => {
    const charCount = title.length;
    return charCount * 28;
  };

  return (
    <View style={styles.container}>
      {/* Left border line */}
      <View style={styles.borderLine} />
      {/* Left dashed line */}
      <View style={styles.dashedLineContainer}>
        {Array.from({ length: 15 }).map((_, i) => (
          <View key={i} style={styles.dash} />
        ))}
      </View>

      {/* Back button */}
      <View style={styles.backButtonWrapper}>
        <View style={styles.backButtonShadow} />
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
      </View>

      {/* Left arrow */}
      {currentSlide > 0 && (
        <TouchableOpacity style={styles.leftArrow} onPress={handlePrev}>
          <Text style={styles.arrowText}>{'← '}</Text>
        </TouchableOpacity>
      )}

      {/* Slide indicator */}
      <View style={styles.slideIndicator}>
        <Text style={styles.slideText}>{currentSlide + 1}/3</Text>
      </View>

      <Animated.View style={[styles.animatedContent, { opacity: fadeAnim }]}>
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <View style={[styles.underline, { width: getTitleWidth(slides[currentSlide].title) }]} />

          {currentSlide < 2 ? (
            <Text style={styles.paragraph}>{slides[currentSlide].content}</Text>
          ) : (
            slides[currentSlide].items?.map((item, i) => (
              <View key={i} style={styles.section}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.text}>{item.text}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Right arrow */}
      {currentSlide < 2 && (
        <TouchableOpacity style={styles.rightArrow} onPress={handleNext}>
          <Text style={styles.arrowText}>{' →'}</Text>
        </TouchableOpacity>
      )}

      {/* Right dashed line */}
      <View style={styles.dashedLineContainer}>
        {Array.from({ length: 15 }).map((_, i) => (
          <View key={i} style={styles.dash} />
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
  dashedLineContainer: {
    width: 2,
    alignSelf: 'stretch',
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'space-evenly',
  },
  dash: {
    width: 2,
    height: 15,
    backgroundColor: Colors.orange,
  },
  backButtonWrapper: {
    position: 'absolute',
    top: 0,
    left: 40,
    zIndex: 10,
  },
  backButtonShadow: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 50,
    height: 50,
    backgroundColor: Colors.darkGrey,
    borderRadius: 8,
  },
  backButton: {
    backgroundColor: '#B85A28',
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  backText: {
    fontFamily: FontFamily.pixel,
    fontSize: 28,
    color: Colors.offWhite,
  },
  slideIndicator: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: '#D3D3D3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    zIndex: 10,
  },
  slideText: {
    fontFamily: FontFamily.pixel,
    fontSize: 16,
    color: '#808080',
  },
  leftArrow: {
    position: 'absolute',
    left: 50,
    top: '50%',
    marginTop: -25,
    backgroundColor: '#D3D3D3',
    width: 60,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    cursor: 'pointer',
  },
  rightArrow: {
    position: 'absolute',
    right: 50,
    top: '50%',
    marginTop: -25,
    backgroundColor: '#D3D3D3',
    width: 60,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    cursor: 'pointer',
  },
  arrowText: {
    fontFamily: FontFamily.pixel,
    fontSize: 24,
    color: '#808080',
  },
  animatedContent: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 80,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.pixel,
    fontSize: 52,
    color: Colors.greenOutline,
    marginBottom: 12,
    textAlign: 'center',
  },
  underline: {
    height: 3,
    backgroundColor: Colors.greenOutline,
    marginBottom: 50,
  },
  paragraph: {
    fontFamily: FontFamily.pixel,
    fontSize: 22,
    color: Colors.textDark,
    lineHeight: 36,
    textAlign: 'center',
    maxWidth: 800,
  },
  section: {
    marginBottom: 40,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 26,
    color: Colors.greenOutline,
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontFamily: FontFamily.pixel,
    fontSize: 20,
    color: Colors.textDark,
    lineHeight: 32,
    textAlign: 'center',
  },
});
