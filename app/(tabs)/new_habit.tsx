import { getHabits } from "@/api/habits";
import { HabitListFilterModal, type HabitListItem } from "@/components/habit-list-filter-modal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import { AppState, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from "react";

import {
  ButtonStyles,
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from '../../constants/theme';

const LAST_RESET_KEY = "lastResetDate";

const habits = {
  one: { name: "Write in Journal", coin: 20, difficulty: "hard" },
  two: { name: "8 Hours of Sleep", coin: 15, difficulty: "medium" },
  three: { name: "10 mins of reading", coin: 10, difficulty: "easy" },
};

export default function ChooseDailyHabits() {
  const router = useRouter();
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  const [habitListOpen, setHabitListOpen] = useState(false);
  const [habitListLoading, setHabitListLoading] = useState(false);
  const [habitListItems, setHabitListItems] = useState<HabitListItem[]>([]);
  const [habitListCategories, setHabitListCategories] = useState<string[]>([]);

  // NEW
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [slotHabits, setSlotHabits] = useState<Record<number, string>>({});

  const [checked, setChecked] = useState<Record<string, boolean>>({
    one: false,
    two: false,
    three: false,
  });

  const [user, setUser] = useState({
    name: "Lucy Lee",
    coin: 0,
    xp: 0,
  });

  const totalSlots = 5;
  const requiredSlots = 3;

  const fallbackHabitListItems = useMemo<HabitListItem[]>(() => {
    const categoryPool = ["Physical", "Mental", "Emotional", "Relationships"];
    return Object.entries(habits).map(([id, habit], index) => ({
      id,
      name: habit.name,
      category: categoryPool[index % categoryPool.length],
    }));
  }, []);

  const loadHabitListFromSupabase = async () => {
    setHabitListLoading(true);
    try {
      const data = await getHabits();
      const rows = Array.isArray(data) ? data : [];

      const items: HabitListItem[] = rows
        .map((row: any) => {
          const name = typeof row?.name === "string" ? row.name : null;
          if (!name) return null;
          const category = typeof row?.category === "string" ? row.category : undefined;
          const idRaw = row?.id ?? row?.habit_id ?? `${category ?? "Uncategorized"}:${name}`;
          return { id: String(idRaw), name, category };
        })
        .filter(Boolean) as HabitListItem[];

      const cats = Array.from(
        new Set(items.map((h) => (h.category ? h.category : "Uncategorized")))
      );

      setHabitListItems(items);
      setHabitListCategories(cats);
    } finally {
      setHabitListLoading(false);
    }
  };

  const loadUserData = async () => {
    try {
      const savedCoins = await AsyncStorage.getItem("userCoins");
      const savedXP = await AsyncStorage.getItem("userXP");
      const savedChecked = await AsyncStorage.getItem("habitsChecked");

      if (savedCoins) setUser(prev => ({ ...prev, coin: parseInt(savedCoins) }));
      if (savedXP) setUser(prev => ({ ...prev, xp: parseInt(savedXP) }));
      if (savedChecked) setChecked(JSON.parse(savedChecked));
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  const handleCheck = async (key: string, coin: number) => {
    const newChecked = { ...checked, [key]: true };
    const newCoins = user.coin + coin;

    setChecked(newChecked);
    setUser(prev => ({ ...prev, coin: newCoins }));

    await AsyncStorage.setItem("userCoins", newCoins.toString());
    await AsyncStorage.setItem("habitsChecked", JSON.stringify(newChecked));
  };

  async function updateStreak(yesterdayHabits: Record<string, boolean>) {
    try {
      const currentStreak = await AsyncStorage.getItem("userStreak");
      const streak = currentStreak ? parseInt(currentStreak) : 0;

      const completedAnyHabit = Object.values(yesterdayHabits).some(val => val === true);
      if (completedAnyHabit) {
        const newStreak = streak + 1;
        await AsyncStorage.setItem("userStreak", newStreak.toString());
        console.log(`Streak updated: ${newStreak}`);
      } else {
        await AsyncStorage.setItem("userStreak", "0");
        console.log("Streak reset to 0 - no habits completed yesterday");
      }
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  }

  async function resetHabits() {
    await updateStreak(checked);

    const resetChecked = { one: false, two: false, three: false };
    setChecked(resetChecked);
    await AsyncStorage.setItem("habitsChecked", JSON.stringify(resetChecked));
  }

  async function ensureDailyReset() {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const last = await AsyncStorage.getItem(LAST_RESET_KEY);

      if (last === null) {
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
        return;
      }

      if (last !== today) {
        await resetHabits();
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
      }
    } catch (err) {
      console.error("Error in daily reset:", err);
    }
  }

  useEffect(() => {
    loadUserData();
    ensureDailyReset();
    loadHabitListFromSupabase();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") ensureDailyReset();
    });

    return () => sub.remove();
  }, []);

  const toggleHabit = (index: number) => {
    const habitId = `habit-${index}`;

    if (selectedHabits.includes(habitId)) {
      setSelectedHabits(selectedHabits.filter(id => id !== habitId));
    } else if (selectedHabits.length < totalSlots) {
      setActiveSlot(index); // NEW
      setHabitListOpen(true);
      if (!habitListLoading && habitListItems.length === 0) {
        void loadHabitListFromSupabase();
      }
      const updated = [...selectedHabits, habitId];
      setSelectedHabits(updated);
      if (updated.length >= requiredSlots) setShowWarning(false);
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Left lines */}
          <View style={styles.borderLine} />
          <View style={styles.dashedLineContainer}>
            {Array.from({ length: 15 }).map((_, i) => (
              <View key={i} style={styles.dash} />
            ))}
          </View>

          {/* Center content */}
          <View style={{ flex: 1 }}>
        {/* Help Button - Top Right */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.helpButtonWrapper}
          onPress={() => router.push('/help')}
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {slotHabits[index] ?? '+'}
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
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {slotHabits[index] ?? '+'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {/* NEW - optional hint text */}
            <Text style={styles.optionalHintText}>
              Feel free to add additional habits{'\n'}(optional)
            </Text>
          </View>
        </View>

        {/* Warning Message */}
        {showWarning && (
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsText}>
              Please choose at least 3 habits!
            </Text>
          </View>
        )}
          
          
          </View>{/* end center content */}

      {/* Right lines */}
      <View style={styles.dashedLineContainer}>
        {Array.from({ length: 15 }).map((_, i) => (
        <View key={i} style={styles.dash} />
          ))}
        </View>
        <View style={styles.borderLine} />
      </View>{/* end row */}

        {/* Next Button */}
        <View style={styles.nextButtonWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={async () => {
              if (!isNextEnabled) {
                setShowWarning(true);
                return;
              }
              await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
              router.replace('/(tabs)/habit_update');
            }}
          >
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
        
      </View>

      <HabitListFilterModal
        visible={habitListOpen}
        habits={habitListItems.length > 0 ? habitListItems : fallbackHabitListItems}
        categories={
          habitListCategories.length > 0
            ? habitListCategories
            : ["Physical", "Mental", "Emotional", "Relationships"]
        }
        loading={habitListLoading}
        onRequestClose={() => setHabitListOpen(false)}
        onConfirm={(habit) => {
          if (activeSlot !== null && habit?.name) {
            setSlotHabits(prev => ({ ...prev, [activeSlot]: habit.name }));
          }
          setHabitListOpen(false);
        }}
      />
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
  helpButtonWrapper: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 10,
  },
  helpText: {
    fontFamily: FontFamily.pixel,
    fontSize: FontSize.xl,
    color: Colors.offWhite,
  },
  title: {
    fontFamily: FontFamily.pixel,
    fontSize: 42,
    color: Colors.greenOutline,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
    marginLeft: Spacing.xl,
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
    bottom: 10,
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
  // NEW
  optionalHintText: {
    fontFamily: FontFamily.novaCut,
    fontSize: FontSize.md,
    color: Colors.greenOutline,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginRight: Spacing.xxl,
  },
});