import { useFonts, PixelifySans_400Regular, PixelifySans_700Bold } from '@expo-google-fonts/pixelify-sans';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, FontFamily } from '@/constants/theme';

export default function BestPracticesScreen() {
  const [fontsLoaded] = useFonts({ PixelifySans_400Regular, PixelifySans_700Bold });
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

      {/* Back button */}
      <View style={styles.backButtonWrapper}>
        <View style={styles.backButtonShadow} />
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Best Practices</Text>
        <View style={styles.underline} />

        <View style={styles.section}>
          <Text style={styles.label}>Set realistic goals:</Text>
          <Text style={styles.text}>
            Start with small, achievable daily habits and gradually build up.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Be consistent:</Text>
          <Text style={styles.text}>
            Regular participation helps reinforce healthy routines and unlocks more in-game rewards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Track your progress:</Text>
          <Text style={styles.text}>
            Use the game to monitor your activities and reflect on your growth.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Engage with the story:</Text>
          <Text style={styles.text}>
            Exploring story paths can make habit-building more motivating.
          </Text>
        </View>
      </ScrollView>

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
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 50,
    paddingTop: 100,
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.pixel,
    fontSize: 48,
    color: Colors.greenOutline,
    marginBottom: 8,
    textAlign: 'center',
  },
  underline: {
    width: 320,
    height: 3,
    backgroundColor: Colors.greenOutline,
    marginBottom: 40,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontFamily: FontFamily.pixelBold,
    fontSize: 24,
    color: Colors.greenOutline,
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontFamily: FontFamily.pixel,
    fontSize: 18,
    color: Colors.textDark,
    lineHeight: 26,
    textAlign: 'center',
  },
});
