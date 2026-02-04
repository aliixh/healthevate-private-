import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GameInfoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Meditation circles - 5 centered hollow rings */}
        <View style={[styles.circle, {width: 600, height: 600, left: '50%', top: '50%', marginLeft: -300, marginTop: -300}]} />
        <View style={[styles.circle, {width: 450, height: 450, left: '50%', top: '50%', marginLeft: -225, marginTop: -225}]} />
        <View style={[styles.circle, {width: 300, height: 300, left: '50%', top: '50%', marginLeft: -150, marginTop: -150}]} />
        <View style={[styles.circle, {width: 180, height: 180, left: '50%', top: '50%', marginLeft: -90, marginTop: -90}]} />
        <View style={[styles.circle, {width: 80, height: 80, left: '50%', top: '50%', marginLeft: -40, marginTop: -40}]} />
        
        {/* Scattered nature decorations */}
        <Text style={[styles.leafEmoji, {position: 'absolute', left: 15, top: 80}]}>🍃</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', right: 20, top: 120}]}>🌿</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', left: 30, top: 200}]}>🌱</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', right: 15, top: 280}]}>🍂</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', left: 10, top: 350}]}>🌾</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', right: 25, top: 420}]}>🍃</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', left: 20, top: 500}]}>🌿</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', right: 10, top: 580}]}>🌱</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', left: 35, top: 650}]}>🍂</Text>
        <Text style={[styles.leafEmoji, {position: 'absolute', right: 30, top: 700}]}>🌾</Text>

        {/* Main content */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Game Information</Text>
            <View style={styles.underline} />
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview:</Text>
            <Text style={styles.sectionText}>
              Healthevate is a mobile game that blends habit tracking with an integrated story element. Players complete real-world daily activities that carry over into the game, earning rewards that unlock new story paths and customization options. By linking healthy habits to in-game progress, the game motivates players to stay engaged while working toward improved mental and physical wellbeing.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purpose:</Text>
            <Text style={styles.sectionText}>
              The purpose of this game is to support players in improving their mental health and wellbeing by encouraging the development of healthy habits through structured gameplay.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Best Practices:</Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.boldText}>Set realistic goals:</Text> Start with small, achievable daily habits and gradually build up.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.boldText}>Be consistent:</Text> Regular participation helps reinforce healthy routines and unlocks more in-game rewards.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.boldText}>Track your progress:</Text> Use the game to monitor your activities and reflect on your growth.
            </Text>
            <Text style={styles.bulletPoint}>
              • <Text style={styles.boldText}>Engage with the story:</Text> Exploring story paths can make habit-building more motivating.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2d1f', // Darker forest background
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  leafEmoji: {
    fontSize: 28,
    opacity: 0.12,
    transform: [{ rotate: '25deg' }],
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e8f5e8',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  underline: {
    width: 200,
    height: 2,
    backgroundColor: '#a8d8a8',
    marginTop: 8,
  },
  section: {
    marginBottom: 25,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a8d8a8',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    color: '#00ffff',
    lineHeight: 24,
    textAlign: 'center',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#00ffff',
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
});