import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Demande = {
  id: string;
  titre: string;
  statut: string;
};

const DEMANDES: Demande[] = [];

export default function Demandes() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes demandes</Text>
      </View>

      <FlatList
        data={DEMANDES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              Vous n'avez pas encore de demande.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titre}</Text>
            <Text style={styles.cardStatus}>{item.statut}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: "#1A1A1A",
  },
  list: {
    padding: 24,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#A0A0A0",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  cardStatus: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 4,
  },
});
