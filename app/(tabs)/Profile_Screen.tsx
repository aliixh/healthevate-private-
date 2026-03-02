import { Colors, FontFamily } from '@/constants/theme';
import { Gluten_400Regular } from '@expo-google-fonts/gluten';
import { NovaCut_400Regular } from '@expo-google-fonts/nova-cut';
import { PixelifySans_400Regular, PixelifySans_700Bold, useFonts } from '@expo-google-fonts/pixelify-sans';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({ 
    PixelifySans_400Regular, 
    PixelifySans_700Bold,
    Gluten_400Regular,
    NovaCut_400Regular
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [editedName, setEditedName] = useState("Bob Smith");
  const [editedCharacter, setEditedCharacter] = useState("Indrani");
  const [savedCharacter, setSavedCharacter] = useState("Indrani");
  const [savedName, setSavedName] = useState("Bob Smith");
  const [savedPlayerName, setSavedPlayerName] = useState("Indrani");
  const [hasChanges, setHasChanges] = useState(false);
  
  if (!fontsLoaded) return null;

  // FOR NOW - will be game-dependent
  const coins = 4000;
  const xp = 20000;
  const streak = [true, true, true, false, false, false, false]; // 7 days

  const handleEdit = () => {
    setEditedName(savedName);
    setEditedCharacter(savedCharacter);
    setIsEditing(true);
    setHasChanges(false);
  };

  const handleSave = () => {
    setSavedName(editedName);
    setSavedCharacter(editedCharacter);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleBack = () => {
    if (hasChanges) {
      setShowExitModal(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleDontSave = () => {
    setShowExitModal(false);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleSaveAndExit = () => {
    setSavedName(editedName);
    setSavedCharacter(editedCharacter);
    setShowExitModal(false);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleNameChange = (text: string) => {
    setEditedName(text);
    setHasChanges(true);
  };

  const handlePlayerNameChange = (text: string) => {
    setEditedName(text);
    setHasChanges(true);
  };

  const handleCharacterSelect = (character: string) => {
    setEditedCharacter(character);
    setHasChanges(true);
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
        <TouchableOpacity style={styles.backButton} onPress={isEditing ? handleBack : undefined}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        {!isEditing && (
          <View style={styles.avatarCardWrapper}>
            <View style={styles.avatarCardShadow} />
            <View style={styles.avatarCard}>
              <View style={styles.avatarSquare} />
              <Text style={styles.avatarName}>{savedCharacter}</Text>
            </View>
          </View>
        )}
        {isEditing && (
          <View style={styles.editAvatarSection}>
            <TouchableOpacity onPress={() => handleCharacterSelect('Indrani')}>
              <View style={editedCharacter === 'Indrani' ? styles.avatarCardWrapper : styles.characterWrapper}>
                {editedCharacter === 'Indrani' && <View style={styles.avatarCardShadow} />}
                <View style={editedCharacter === 'Indrani' ? styles.avatarCard : styles.characterCard}>
                  <View style={styles.avatarSquare} />
                  <Text style={styles.avatarName}>Indrani</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCharacterSelect('Indra')} style={styles.secondCharacter}>
              <View style={editedCharacter === 'Indra' ? styles.avatarCardWrapper : styles.characterWrapper}>
                {editedCharacter === 'Indra' && <View style={styles.avatarCardShadow} />}
                <View style={editedCharacter === 'Indra' ? styles.avatarCard : styles.characterCard}>
                  <View style={styles.avatarSquare} />
                  <Text style={styles.avatarName}>Indra</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>{isEditing ? 'Edit Profile' : 'My Profile'}</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Name</Text>
          {!isEditing ? (
            <Text style={styles.value}>{savedName}</Text>
          ) : (
            <TextInput
              style={styles.nameInput}
              value={editedName}
              onChangeText={handleNameChange}
            />
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Coins</Text>
          <Text style={styles.value}>{coins}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>XP</Text>
          <Text style={styles.value}>{xp}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Streak</Text>
          <View style={styles.streakContainer}>
            {streak.map((active, i) => (
              <View
                key={i}
                style={[
                  styles.streakCircle,
                  active && styles.streakCircleActive,
                ]}
              />
            ))}
            <Text style={styles.giftIcon}>🎁</Text>
          </View>
        </View>

        <View style={styles.editButtonWrapper}>
          <View style={styles.editButtonShadow} />
          <TouchableOpacity style={styles.editButton} onPress={isEditing ? handleSave : handleEdit}>
            <Text style={styles.editButtonText}>{isEditing ? 'Save' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exit Modal */}
      <Modal transparent visible={showExitModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalShadow} />
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Exit without saving?</Text>
              <View style={styles.modalButtons}>
                <View style={styles.modalButtonWrapper}>
                  <View style={styles.modalButtonShadow} />
                  <TouchableOpacity style={styles.modalButton} onPress={handleDontSave}>
                    <Text style={styles.modalButtonText}>Don't Save</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalButtonWrapper}>
                  <View style={styles.modalButtonShadow} />
                  <TouchableOpacity style={styles.modalButton} onPress={handleSaveAndExit}>
                    <Text style={styles.modalButtonText}>Save and Exit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
    top: 20,
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
  },
  backText: {
    fontFamily: FontFamily.pixel,
    fontSize: 28,
    color: Colors.offWhite,
  },
  avatarSection: {
    width: 520,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCardWrapper: {
    position: 'relative',
  },
  avatarCardShadow: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 220,
    height: 280,
    backgroundColor: Colors.darkGreenShadow,
    borderRadius: 12,
  },
  avatarCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    width: 220,
    height: 280,
  },
  avatarSquare: {
    width: 140,
    height: 140,
    backgroundColor: Colors.greenButton,
    borderWidth: 3,
    borderColor: Colors.orange,
    borderRadius: 8,
    marginBottom: 20,
  },
  avatarName: {
    fontFamily: FontFamily.novaCut,
    fontSize: 24,
    color: Colors.textDark,
  },
  content: {
    flex: 1,
    paddingHorizontal: 100,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 48,
    color: Colors.greenOutline,
    marginBottom: 50,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 28,
    color: Colors.greenOutline,
    marginBottom: 10,
    textAlign: 'center',
  },
  value: {
    fontFamily: FontFamily.handwriting,
    fontSize: 24,
    color: Colors.textDark,
    textAlign: 'center',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakCircle: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.orange,
    backgroundColor: 'transparent',
  },
  streakCircleActive: {
    backgroundColor: Colors.yellowCoin,
  },
  giftIcon: {
    fontSize: 28,
    marginLeft: 10,
  },
  editButtonWrapper: {
    alignSelf: 'center',
    marginTop: 20,
  },
  editButtonShadow: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 140,
    height: 45,
    backgroundColor: Colors.darkGrey,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: Colors.greenButton,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  editButtonText: {
    fontFamily: FontFamily.pixel,
    fontSize: 20,
    color: Colors.offWhite,
  },
  editAvatarSection: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
  },
  characterWrapper: {
    position: 'relative',
  },
  characterCard: {
    padding: 30,
    alignItems: 'center',
    width: 220,
    height: 280,
  },
  secondCharacter: {
    marginLeft: 0,
  },
  nameInput: {
    backgroundColor: Colors.offWhite,
    borderWidth: 2,
    borderColor: Colors.greenOutline,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontFamily: FontFamily.handwriting,
    fontSize: 24,
    color: Colors.textDark,
    textAlign: 'center',
    minWidth: 200,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalWrapper: {
    position: 'relative',
  },
  modalShadow: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 400,
    height: 200,
    backgroundColor: Colors.darkGreenShadow,
    borderRadius: 12,
  },
  modalContent: {
    backgroundColor: Colors.offWhite,
    borderWidth: 3,
    borderColor: Colors.greenOutline,
    borderRadius: 12,
    padding: 30,
    width: 400,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontFamily: FontFamily.pixel,
    fontSize: 24,
    color: Colors.greenOutline,
    marginBottom: 30,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  modalButtonWrapper: {
    position: 'relative',
  },
  modalButtonShadow: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.darkGrey,
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: Colors.greenButton,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 130,
  },
  modalButtonText: {
    fontFamily: FontFamily.pixel,
    fontSize: 16,
    color: Colors.offWhite,
  },
});
