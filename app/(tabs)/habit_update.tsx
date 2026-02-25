import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";

const LAST_RESET_KEY = "lastResetDate";

const habits = {
  one: { name: "Write in Journal", coin: 20, difficulty: "hard" },
  two: { name: "8 Hours of Sleep", coin: 15, difficulty: "medium" },
  three: { name: "10 mins of reading", coin: 10, difficulty: "easy" },
};

export default function HabitsScreen() {
  const [user, setUser] = useState({
    name: "Lucy Lee",
    coin: 0,
    xp: 0,
  });

  const [checked, setChecked] = useState<Record<string, boolean>>({
    one: false,
    two: false,
    three: false,
  });

  useEffect(() => {
    loadUserData();
    ensureDailyReset();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") ensureDailyReset();
    });

    return () => sub.remove();
  }, []);

  const loadUserData = async () => {
    try {
      // getData() equivalent - reading from AsyncStorage
      const savedCoins = await AsyncStorage.getItem("userCoins");
      const savedXP = await AsyncStorage.getItem("userXP");
      const savedChecked = await AsyncStorage.getItem("habitsChecked");
      
      if (savedCoins) setUser(prev => ({ ...prev, coin: parseInt(savedCoins) }));
      if (savedXP) setUser(prev => ({ ...prev, xp: parseInt(savedXP) }));
      if (savedChecked) setChecked(JSON.parse(savedChecked));
    } catch (err) {
      // handleError() equivalent - error handling
      console.error("Error loading user data:", err);
    }
  };

  const handleCheck = async (key: string, coin: number) => {
    const newChecked = { ...checked, [key]: true };
    const newCoins = user.coin + coin;
    
    setChecked(newChecked);
    setUser(prev => ({ ...prev, coin: newCoins }));
    
    // storeData() equivalent - saving to AsyncStorage
    await AsyncStorage.setItem("userCoins", newCoins.toString());
    await AsyncStorage.setItem("habitsChecked", JSON.stringify(newChecked));
  };

  async function ensureDailyReset() {
    try {
      // todayKey() equivalent - getting today's date in YYYY-MM-DD format
      const today = dayjs().format("YYYY-MM-DD");
      // getData() equivalent - reading last reset date
      const last = await AsyncStorage.getItem(LAST_RESET_KEY);

      if (last === null) {
        // storeData() equivalent - saving today as last reset date
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
        return;
      }

      if (last !== today) {
        await resetHabits(); // This calls resetHabits which resets all habits
        // storeData() equivalent - updating last reset date
        await AsyncStorage.setItem(LAST_RESET_KEY, today);
      }
    } catch (err) {
      // handleError() equivalent - error handling
      console.error("Error in daily reset:", err);
    }
  }
  
  async function updateStreak(yesterdayHabits: Record<string, boolean>) {
    try {
      const currentStreak = await AsyncStorage.getItem("userStreak");
      const streak = currentStreak ? parseInt(currentStreak) : 0;
      
      // Check if user completed at least one habit yesterday
      const completedAnyHabit = Object.values(yesterdayHabits).some(val => val === true);
      if (completedAnyHabit) {
        // Increment streak
        const newStreak = streak + 1;
        await AsyncStorage.setItem("userStreak", newStreak.toString());
        console.log(`Streak updated: ${newStreak}`);
      } else {
        // Reset streak to 0
        await AsyncStorage.setItem("userStreak", "0");
        console.log("Streak reset to 0 - no habits completed yesterday");
      }
    } catch (err) {
      console.error("Error updating streak:", err);
    }
  }

  async function resetHabits() {
    // Update streak based on yesterday's habit completion
    await updateStreak(checked);
    
    const resetChecked = { one: false, two: false, three: false };
    setChecked(resetChecked);
    // Saving reset habits
    await AsyncStorage.setItem("habitsChecked", JSON.stringify(resetChecked));
  }

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>Coins: {user.coin}</Text>
        <Text style={styles.text}>XP: {user.xp}</Text>
      </View>

      <Text style={styles.title}>Daily Habits</Text>

      <View style={styles.container}>
        {Object.entries(habits).map(([key, habit]) => (
          <View key={key} style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={checked[key]}
              disabled={checked[key]}
              onValueChange={() => {
                if (!checked[key]) handleCheck(key, habit.coin);
              }}
            />
            <Text style={styles.text}>
              {habit.name} (+{habit.coin} coins)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#2D4F2B",
    padding: 30,
    justifyContent: "center",
  },
  container: {
    gap: 12,
    marginBottom: 16,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    margin: 8,
  },
  title: {
    color: "#FFF1CA",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  text: {
    color: "#FFF1CA",
    fontSize: 18,
  },
});