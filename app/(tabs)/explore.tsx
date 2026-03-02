import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.text}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D4F2B',
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#FFF1CA',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  text: {
    color: '#FFF1CA',
    fontSize: 18,
  },
});
