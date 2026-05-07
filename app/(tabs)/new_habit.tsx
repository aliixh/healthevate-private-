import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { getHabits } from '@/api/habits';
import { HabitListFilterModal, type HabitListItem } from '@/components/habit-list-filter-modal';
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
  const totalSlots = 5;
  const requiredSlots = 3;

  const [selectedHabitSlots, setSelectedHabitSlots] = useState<(string | null)[]>(
    Array.from({ length: totalSlots }, () => null)
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const [habitListOpen, setHabitListOpen] = useState(false);
  const [habitListLoading, setHabitListLoading] = useState(false);
  const [habitListItems, setHabitListItems] = useState<HabitListItem[]>([]);
  const [habitListCategories, setHabitListCategories] = useState<string[]>([]);

  const selectedHabitIds = useMemo(
    () => selectedHabitSlots.filter(Boolean) as string[],
    [selectedHabitSlots]
  );
  const selectedHabitIdSet = useMemo(() => new Set(selectedHabitIds), [selectedHabitIds]);

  const fallbackHabitListItems = useMemo<HabitListItem[]>(() => {
    const categoryPool = ["Physical", "Mental", "Emotional", "Relationships"];
    const fallback = [
      { id: "one", name: "Write in Journal" },
      { id: "two", name: "8 Hours of Sleep" },
      { id: "three", name: "10 mins of reading" },
    ];
    return fallback.map((h, index) => ({
      id: h.id,
      name: h.name,
      category: categoryPool[index % categoryPool.length],
    }));
  }, []);

  const getHabitLabelById = (id: string) => {
    const fromSupabase = habitListItems.find((h) => h.id === id);
    if (fromSupabase) return fromSupabase.name;
    const fromFallback = fallbackHabitListItems.find((h) => h.id === id);
    return fromFallback ? fromFallback.name : id;
  };

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

  const persistSelectedHabitIds = async (ids: string[]) => {
    await AsyncStorage.setItem("selectedHabitIds", JSON.stringify(ids));
  };

  useEffect(() => {
    void loadHabitListFromSupabase();
    (async () => {
      try {
        const raw = await AsyncStorage.getItem("selectedHabitIds");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return;
        const ids = parsed.filter((v) => typeof v === "string") as string[];
        if (ids.length === 0) return;
        setSelectedHabitSlots((prev) => {
          const next = [...prev];
          for (let i = 0; i < Math.min(totalSlots, ids.length); i++) next[i] = ids[i];
          return next;
        });
      } catch {
        // ignore
      }
    })();
  }, []);

  const toggleHabit = (index: number) => {
    const current = selectedHabitSlots[index];
    if (current) {
      // Remove habit from this slot
      const next = [...selectedHabitSlots];
      next[index] = null;
      setSelectedHabitSlots(next);
      void persistSelectedHabitIds(next.filter(Boolean) as string[]);
      return;
    }

    // Open the habit database, respecting locked slots
    setActiveSlotIndex(index);
    setHabitListOpen(true);
    if (!habitListLoading && habitListItems.length === 0) {
      void loadHabitListFromSupabase();
    }
  };

  const isSlotEnabled = (index: number) => {
    return selectedHabitIds.length >= requiredSlots || index < requiredSlots;
  };

  const isNextEnabled = selectedHabitIds.length >= requiredSlots;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={true} />
      <View style={styles.container}>
        {/* Help Button - Top Right */}
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.helpButtonWrapper} onPress={() => router.push('/help')}
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
                {selectedHabitSlots[index] ? (
                  <View style={[styles.habitSlot, styles.habitSlotEnabled]}>
                    <Text style={styles.habitLabel} numberOfLines={1}>
                      {getHabitLabelById(selectedHabitSlots[index] as string)}
                    </Text>
                  </View>
                ) : (
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
                )}
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
                disabled={!isSlotEnabled(index) && !selectedHabitSlots[index]}
                style={styles.habitSlotWrapper}
              >
                {selectedHabitSlots[index] ? (
                  <View style={[styles.habitSlot, styles.habitSlotEnabled]}>
                    <Text style={styles.habitLabel} numberOfLines={1}>
                      {getHabitLabelById(selectedHabitSlots[index] as string)}
                    </Text>
                  </View>
                ) : (
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
                )}
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
            await persistSelectedHabitIds(selectedHabitIds);
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

      <HabitListFilterModal
        visible={habitListOpen}
        habits={habitListItems.length > 0 ? habitListItems : fallbackHabitListItems}
        categories={
          habitListCategories.length > 0
            ? habitListCategories
            : ["Physical", "Mental", "Emotional", "Relationships"]
        }
        disabledHabitIds={selectedHabitIds}
        loading={habitListLoading}
        onRequestClose={() => {
          setHabitListOpen(false);
          setActiveSlotIndex(null);
        }}
        onConfirm={(habit) => {
          if (selectedHabitIdSet.has(habit.id)) {
            Alert.alert("Already selected", "Pick a different habit.");
            return;
          }
          if (activeSlotIndex === null) {
            setHabitListOpen(false);
            return;
          }

          const next = [...selectedHabitSlots];
          next[activeSlotIndex] = habit.id;
          setSelectedHabitSlots(next);
          void persistSelectedHabitIds(next.filter(Boolean) as string[]);

          setHabitListOpen(false);
          setActiveSlotIndex(null);
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
  habitLabel: {
    fontFamily: FontFamily.pixel,
    fontSize: 16,
    color: Colors.textGreen,
    paddingHorizontal: 16,
    textAlign: 'center',
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
