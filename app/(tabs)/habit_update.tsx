// https://colorhunt.co/palette/fff1caffb823708a582d4f2b

import Checkbox from "expo-checkbox";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const undo = true;

const habits = {
  one: { name: "Write in Journal", coin: 20, difficulty: "hard" },
  two: { name: "8 Hours of Sleep", coin: 15, difficulty: "medium" },
  three: { name: "10 mins of reading", coin: 10, difficulty: "easy" },
};

export default function Index() {
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
