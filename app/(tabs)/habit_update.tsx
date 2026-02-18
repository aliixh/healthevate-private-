// https://colorhunt.co/palette/fff1caffb823708a582d4f2b

import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs";
import Checkbox from "expo-checkbox";
import { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, View, type AppStateStatus } from "react-native";

const LAST_RESET_KEY = "lastResetDate";

const habits = {
  one: { name: "Write in Journal", coin: 20, difficulty: "hard" },
  two: { name: "8 Hours of Sleep", coin: 15, difficulty: "medium" },
  three: { name: "10 mins of reading", coin: 10, difficulty: "easy" },
};

AppState.addEventListener("change", (state) => {
  if (state === "active") ensureDailyReset();
});

export default function Index() {
  ensureDailyReset();

  useEffect(() => {
    ensureDailyReset();

    let sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") ensureDailyReset();
    });

    return () => sub.remove();
  }, []);

  const [user, setUser] = useState({
    name: "Lucy Lee",
    coin: 10000,
    xp: 20260201,
  });

  const [checked, setChecked] = useState<Record<string, boolean>>({
    one: false,
    two: false,
    three: false,
  });

  const handleCheck = (key: string, coin: number) => {
    setChecked((prev) => ({ ...prev, [key]: true }));
    setUser((prev) => ({
      ...prev,
      coin: prev.coin + coin,
    }));
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.text}>Coins: {user.coin}</Text>
        <Text style={styles.text}>XP: {user.xp}</Text>
      </View>

      <Text style={styles.title}>Habits</Text>

      <View style={styles.container}>
        {Object.entries(habits).map(([key, habit]) => (
          <View key={key} style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={checked[key]}
              disabled={checked[key]}
              onValueChange={() => {
                if (!checked[key]) handleCheck(key, habit.coin)
              }}
            />
            <Text style={styles.text}>
              {habit.name} (+{habit.coin})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

async function ensureDailyReset() {
  try {
    let today = todayKey();
    let last = await getData(LAST_RESET_KEY);

    if (last === null) {
      await storeData(LAST_RESET_KEY, today);
      return;
    }

    if (last !== today) {
      resetHabit();
      updateStreak();
      await storeData(LAST_RESET_KEY, today);
    }
  } catch (err) {
    handleError(err);
  }
}

function resetHabit() {
  // TODO
}
function updateStreak() {
  // TODO
}

function todayKey() {
  return dayjs().format("YYYY-MM-DD");
}

async function storeData(key: string, value: string) {
  await AsyncStorage.setItem(key, value);
};

async function getData(key: string) {
  return await AsyncStorage.getItem(key);
};

function handleError(err) {
  // TO DO
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
