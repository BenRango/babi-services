import OffreCard from "@/components/offreCard";
import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getDemande } from "@/services/demandeService";
import { listOffresForDemande } from "@/services/offreService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OffresDemande() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: demande } = useAsync(() => getDemande(id), [id]);
  const { loading, data: offres } = useAsync(() => listOffresForDemande(id), [id]);

  const ouvrirOffre = useCallback(
    (offreId: string) => router.push(`/(client)/demande/${id}/offre/${offreId}`),
    [id, router]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Offres reçues</Text>
          {demande && (
            <Text style={styles.subtitle}>
              {categorieLabel(demande.categorie)} · {demande.description}
            </Text>
          )}
        </View>
        {offres && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{offres.length} offre{offres.length > 1 ? "s" : ""}</Text>
          </View>
        )}
      </View>

      {loading && !offres ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <FlatList
          data={offres ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <OffreCard offre={item} onPress={() => ouvrirOffre(item.id)} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucune offre pour l&apos;instant, revenez bientôt.</Text>
          }
        />
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
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 17,
    color: Colors.brand.encre,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  countBadge: {
    backgroundColor: Colors.brand.tintOr,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
  },
  countText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.brand.orange,
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
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
    marginTop: Spacing.six,
  },
});
