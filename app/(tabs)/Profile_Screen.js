import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [name, setName] = useState("Julius Ceaser");
  const [coins, setCoins] = useState("1");
  const [xp, setXp] = useState("0");
  const [streak, setStreak] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState("");
  
  // Track which days user logged in (true = logged in, false = didn't log in)
  const [streakDays, setStreakDays] = useState([
    true,   // Day 1
    true,   // Day 2
    true,   // Day 3
    false,  // Day 4
    false,  // Day 5
    false,  // Day 6
    false,  // Day 7
  ]);

  // Toggle a specific day's login status
  const toggleDay = (index) => {
    const newStreakDays = [...streakDays];
    newStreakDays[index] = !newStreakDays[index];
    setStreakDays(newStreakDays);
    
    // Update streak count based on consecutive days from the start
    let newStreak = 0;
    for (let i = 0; i < newStreakDays.length; i++) {
      if (newStreakDays[i]) {
        newStreak++;
      } else {
        break; // Stop counting at first gap
      }
    }
    setStreak(newStreak);
  };

  const openEditModal = () => {
    setTempName(name);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTempName("");
  };

  const saveName = () => {
    setName(tempName);
    closeModal();
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem("userName", name);
      await AsyncStorage.setItem("userCoins", coins);
      await AsyncStorage.setItem("userXP", xp);
      await AsyncStorage.setItem("userStreak", streak.toString());
      alert("Profile saved!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Left Side - Avatar */}
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
          </View>
        </View>

        {/* Right Side - Profile Info */}
        <View style={styles.rightSection}>
          <Text style={styles.title}>Profile</Text>

          {/* Name Input */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              editable={false}
              keyboardType="default"
              placeholder=""
              placeholderTextColor="#ffffff80"
            />
            <TouchableOpacity onPress={openEditModal}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Coins Input */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Coins:</Text>
            <TextInput
              style={styles.input}
              value={coins}
              onChangeText={setCoins}
              keyboardType="numeric"
              placeholder=""
              placeholderTextColor="#ffffff80"
            />
          </View>

          {/* XP Input */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>XP:</Text>
            <TextInput
              style={styles.input}
              value={xp}
              onChangeText={setXp}
              keyboardType="numeric"
              placeholder=""
              placeholderTextColor="#ffffff80"
            />
          </View>
        
          {/* Streak Display */}
          <View style={styles.streakContainer}>
            <Text style={styles.streakLabel}>Streak: {streak}</Text>
            <View style={styles.streakDots}>
              {streakDays.map((isActive, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleDay(index)}
                  style={[
                    styles.streakDot,
                    isActive ? styles.streakDotActive : styles.streakDotInactive,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Edit Name Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Name</Text>
              
              <TextInput
                style={styles.modalInput}
                value={tempName}
                onChangeText={setTempName}
                placeholder="Enter your name"
                placeholderTextColor="#00000050"
                autoFocus={true}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveName}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d5f4f",
    flexDirection: "row",
    padding: 40,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 32,
    color: "#2d5f4f",
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 200,
    height: 200,
    backgroundColor: "#5fa88f",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 100,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    textDecorationLine: "underline"
  },
  rightSection: {
    flex: 1.5,
    justifyContent: "center",
    paddingLeft: 40,
  },
  title: {
    fontSize: 60,
    color: "#ffffff",
    fontWeight: "300",
    marginBottom: 0,
    fontFamily: "serif",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  label: {
    fontSize: 32,
    color: "#ffffff",
    marginRight: 20,
    minWidth: 150,
    fontFamily: "serif",
  },
  input: {
    flex: 1,
    borderBottomWidth: 0,
    fontSize: 32,
    color: "#ffffff",
    paddingVertical: 5,
    maxWidth: 300,
  },
  streakContainer: {
    marginTop: 30,
  },
  streakLabel: {
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 15,
    fontFamily: "serif",
  },
  streakDots: {
    flexDirection: "row",
    gap: 10,
  },
  streakDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  streakDotActive: {
    backgroundColor: "#ff8c42",
    borderColor: "#ff8c42",
  },
  streakDotInactive: {
    backgroundColor: "#b8c5be",
    borderColor: "#b8c5be",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#2d5f4f",
    marginBottom: 20,
    fontFamily: "serif",
  },
  modalInput: {
    borderWidth: 2,
    borderColor: "#2d5f4f",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    color: "#000000",
    marginBottom: 25,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#b8c5be",
  },
  saveButton: {
    backgroundColor: "#2d5f4f",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  }
});