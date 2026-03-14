import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    ButtonStyles,
    Colors,
    FontFamily,
    FontSize,
    Radius,
    Spacing,
} from '../../constants/theme';

export default function ChooseDailyHabits() {
  const router = useRouter();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  // Total slots available
  const totalSlots = 5;
  const requiredSlots = 3;

  const toggleHabit = (index: number) => {
    // Only allow adding habits if we haven't reached the limit
    const habitId = `habit-${index}`;
    
    if (selectedHabits.includes(habitId)) {
      // Remove habit
      setSelectedHabits(selectedHabits.filter(id => id !== habitId));
    } else if (selectedHabits.length < totalSlots) {
      // Add habit
      setSelectedHabits([...selectedHabits, habitId]);
    }
  };

  const isSlotEnabled = (index: number) => {
    return selectedHabits.length >= requiredSlots || index < requiredSlots;
  };

  const isNextEnabled = selectedHabits.length >= requiredSlots;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Help Button - Top Right */}
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.helpButtonWrapper}
        >
          <View style={ButtonStyles.wrapper}>
            <View style={ButtonStyles.helpShadow} />
            <View style={ButtonStyles.help}>
              <Text style={styles.helpText}>?</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Choose daily habits</Text>

        {/* Habit Slots Grid */}
        <View style={styles.habitsGrid}>
          {/* Left Column - First 3 slots (required) */}
          <View style={styles.column}>
            {[0, 1, 2].map((index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => toggleHabit(index)}
                style={styles.habitSlotWrapper}
              >
                <View
                  style={[
                    styles.habitSlot,
                    isSlotEnabled(index) && styles.habitSlotEnabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.plusSign,
                      isSlotEnabled(index) && styles.plusSignEnabled,
                    ]}
                  >
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Right Column - Last 2 slots (optional, greyed out initially) */}
          <View style={styles.column}>
            {[3, 4].map((index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => toggleHabit(index)}
                disabled={!isSlotEnabled(index)}
                style={styles.habitSlotWrapper}
              >
                <View
                  style={[
                    styles.habitSlot,
                    isSlotEnabled(index) && styles.habitSlotEnabled,
                    !isSlotEnabled(index) && styles.habitSlotDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.plusSign,
                      isSlotEnabled(index) && styles.plusSignEnabled,
                      !isSlotEnabled(index) && styles.plusSignDisabled,
                    ]}
                  >
                    +
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Button */}
        <View style={styles.nextButtonWrapper}>
          <TouchableOpacity
            activeOpacity={isNextEnabled ? 0.85 : 1}
            disabled={!isNextEnabled}
          onPress={async () => {
            await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
            router.replace('/(tabs)/habit_update');
          }}>
            <View style={ButtonStyles.wrapper}>
              <View
                style={
                  isNextEnabled
                    ? ButtonStyles.nextShadow
                    : ButtonStyles.nextDisabledShadow
                }
              />
              <View
                style={
                  isNextEnabled ? ButtonStyles.next : ButtonStyles.nextDisabled
                }
              >
                <Text
                  style={
                    isNextEnabled
                      ? ButtonStyles.nextText
                      : ButtonStyles.nextDisabledText
                  }
                >
                  next
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Instructions */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsText}>
            Clicking the plus signs will open the habit database, first 3 are
            required.
          </Text>
          <Text style={styles.instructionsText}>
            Last 2 habits are greyed out until they have entered 3 required
            habits.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  helpButtonWrapper: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.xl,
    zIndex: 10,
  },
  helpText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xl,
    color: Colors.offWhite,
  },
  title: {
    fontFamily: FontFamily.novaCut,
    fontSize: 42,
    color: Colors.greenOutline,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  habitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  column: {
    flex: 1,
    gap: Spacing.lg,
  },
  habitSlotWrapper: {
    width: '100%',
  },
  habitSlot: {
    height: 60,
    borderRadius: Radius.full,
    borderWidth: 4,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitSlotEnabled: {
    borderColor: Colors.greenOutline,
    backgroundColor: Colors.textbox,
  },
  habitSlotDisabled: {
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.lightGrey,
  },
  plusSign: {
    fontFamily: FontFamily.pixel,
    fontSize: 48,
    color: Colors.lightGrey,
  },
  plusSignEnabled: {
    color: Colors.greenOutline,
  },
  plusSignDisabled: {
    color: Colors.greyOutText,
  },
  nextButtonWrapper: {
    position: 'absolute',
    bottom: 140,
    right: Spacing.xl,
  },
  instructionsBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.darkGrey,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  instructionsText: {
    fontFamily: FontFamily.novaCut,
    fontSize: FontSize.md,
    color: Colors.offWhite,
    textAlign: 'center',
    lineHeight: FontSize.md * 1.5,
  },
});