import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { listCategoriesAvecCompte } from "@/services/prestataireService";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ChevronLeft, Search } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TousLesServices() {
  const router = useRouter();
  const { loading, data: categories } = useAsync(listCategoriesAvecCompte);
  const [recherche, setRecherche] = useState("");

  const categoriesFiltrees = (categories ?? []).filter((cat) =>
    cat.label.toLowerCase().includes(recherche.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tous les services</Text>
      </View>

      <View style={styles.searchBar}>
        <Search size={16} color={Colors.light.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un service..."
          placeholderTextColor={Colors.light.textSecondary}
          value={recherche}
          onChangeText={setRecherche}
        />
      </View>

      {loading && !categories ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} keyboardShouldPersistTaps="handled">
          {categoriesFiltrees.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.card}
              onPress={() => router.push(`/(client)/accueil/services/${cat.id}`)}
            >
              <View style={styles.cardIconWrap}>
                <Image source={cat.icon} contentFit="contain" style={styles.cardIcon} />
              </View>
              <View>
                <Text style={styles.cardLabel}>{cat.label}</Text>
                <Text style={styles.cardCount}>{cat.nbArtisans} artisans</Text>
              </View>
            </TouchableOpacity>
          ))}
          {categoriesFiltrees.length === 0 && (
            <Text style={styles.empty}>Aucun service ne correspond à votre recherche.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: Fonts.title,
    fontSize: 18,
    color: Colors.brand.encre,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.three,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  grid: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  card: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIcon: {
    width: 24,
    height: 24,
  },
  cardLabel: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  cardCount: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    width: "100%",
    marginTop: Spacing.six,
  },
});
