import { useFonts, PixelifySans_400Regular, PixelifySans_700Bold } from '@expo-google-fonts/pixelify-sans';
import { NovaCut_400Regular } from '@expo-google-fonts/nova-cut';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, FontFamily } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function CharacterSelectionScreen() {
  const [fontsLoaded] = useFonts({ 
    PixelifySans_400Regular, 
    PixelifySans_700Bold,
    NovaCut_400Regular 
  });
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

  const handleCharacterSelect = (character: string) => {
    setSelectedCharacter(character);
  };

  // 1. Add import at the top


// 2. Add inside the component
const router = useRouter();

// 3. Add onPress to the TouchableOpacity

  if (!fontsLoaded) return null;

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

      {/* Main content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Character</Text>

        <View style={styles.charactersContainer}>
          {/* Indrani */}
          <TouchableOpacity onPress={() => handleCharacterSelect('Indrani')}>
            <View style={selectedCharacter === 'Indrani' ? styles.characterCardWrapper : styles.characterWrapper}>
              {selectedCharacter === 'Indrani' && <View style={styles.characterCardShadow} />}
              <View style={selectedCharacter === 'Indrani' ? styles.characterCard : styles.characterCardUnselected}>
                <View style={styles.characterSquare} />
                <Text style={styles.characterName}>Indrani</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Indra */}
          <TouchableOpacity onPress={() => handleCharacterSelect('Indra')}>
            <View style={selectedCharacter === 'Indra' ? styles.characterCardWrapper : styles.characterWrapper}>
              {selectedCharacter === 'Indra' && <View style={styles.characterCardShadow} />}
              <View style={selectedCharacter === 'Indra' ? styles.characterCard : styles.characterCardUnselected}>
                <View style={styles.characterSquare} />
                <Text style={styles.characterName}>Indra</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Next button */}
        {selectedCharacter && (
          <View style={styles.nextButtonWrapper}>
            <View style={styles.nextButtonShadow} />
            <TouchableOpacity style={styles.nextButton} onPress={() => router.push('/loading')}>
              <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
          </View>
        )}
      </View>

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
  content: {
    flex: 1,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FontFamily.pixel,
    fontSize: 42,
    color: Colors.greenOutline,
    marginTop: 60,
    marginBottom: 10,
    textAlign: 'center',
  },
  charactersContainer: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 10,
  },
  characterWrapper: {
    position: 'relative',
  },
  characterCardWrapper: {
    position: 'relative',
  },
  characterCardShadow: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 200,
    height: 220,
    backgroundColor: Colors.darkGreenShadow,
    borderRadius: 12,
  },
  characterCard: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: 200,
    height: 220,
  },
  characterCardUnselected: {
    padding: 30,
    alignItems: 'center',
    width: 220,
    height: 280,
  },
  characterSquare: {
    width: 120,
    height: 120,
    backgroundColor: Colors.greenButton,
    borderWidth: 3,
    borderColor: Colors.orange,
    borderRadius: 8,
    marginBottom: 20,
  },
  characterName: {
    fontFamily: FontFamily.novaCut,
    fontSize: 24,
    color: Colors.textDark,
  },
  nextButtonWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  nextButtonShadow: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 80,
    height: 50,
    backgroundColor: Colors.darkGrey,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: Colors.orange,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    cursor: 'pointer',
  },
  nextButtonText: {
    fontFamily: FontFamily.pixel,
    fontSize: 20,
    color: Colors.offWhite,
  },
});
