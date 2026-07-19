import ArtisanCard from "@/components/artisanCard";
import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { listPrestatairesByCategorie } from "@/services/prestataireService";
import { CategorieService } from "@/types/demande";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArtisansParCategorie() {
  const { categorie } = useLocalSearchParams<{ categorie: CategorieService }>();
  const router = useRouter();

  const { loading, data: artisans } = useAsync(() => listPrestatairesByCategorie(categorie), [categorie]);

  const ouvrirArtisan = useCallback(
    (id: string) => router.push(`/(client)/accueil/artisan/${id}`),
    [router]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>{categorieLabel(categorie)}</Text>
          <Text style={styles.subtitle}>Artisans disponibles près de vous</Text>
        </View>
        {artisans && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{artisans.length} artisan{artisans.length > 1 ? "s" : ""}</Text>
          </View>
        )}
      </View>

      {loading && !artisans ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <FlatList
          data={artisans ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ArtisanCard prestataire={item} onPress={() => ouvrirArtisan(item.id)} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Aucun artisan disponible dans cette catégorie pour l&apos;instant.</Text>
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
