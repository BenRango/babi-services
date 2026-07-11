import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accueil() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Bonjour 👋</Text>
        <Text style={styles.title}>Que souhaitez-vous faire aujourd'hui ?</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
  },
  content: {
    padding: 24,
  },
  greeting: {
    fontFamily: "DMSans_500Medium",
    fontSize: 14,
    color: "#8A8A8A",
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: "#1A1A1A",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
  },
  cardTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  cardDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 6,
  },
});
