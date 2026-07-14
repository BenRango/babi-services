import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Mon wallet</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>0 FCFA</Text>
        </View>

        <Text style={styles.sectionTitle}>Transactions récentes</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Aucune transaction pour le moment.
          </Text>
        </View>
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
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: "#1A1A1A",
  },
  balanceCard: {
    backgroundColor: "#ff5608",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  balanceLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#FFE8D6",
  },
  balanceAmount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    color: "#FFFFFF",
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#1A1A1A",
    marginTop: 28,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#A0A0A0",
  },
});
