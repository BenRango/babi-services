import OffreCard from "@/components/offreCard";
import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { accepterOffre, refuserOffre } from "@api/offres";
import { getMesDemandes } from "@api/demandes";
import { apercuDescription, formatDateRelative, formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OffresDemande() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // GET /demandes/:id ne renvoie pas encore le profil du prestataire dans les
  // offres imbriquées (juste prestataireId), contrairement à /mes-demandes —
  // on passe par la liste complète en attendant que le backend soit aligné.
  const { loading, data: demandes, reload } = useAsync(getMesDemandes);
  const demande = demandes?.find((d) => d.id === id);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const offresTriees = [...(demande?.offres ?? [])].sort((a, b) => a.prixProposeFcfa - b.prixProposeFcfa);

  const gererAccepter = async (offreId: string) => {
    try {
      const { codeConfirmation } = await accepterOffre(offreId);
      Alert.alert(
        "Offre acceptée",
        `Code de confirmation à donner au prestataire à la fin de la prestation : ${codeConfirmation}`,
        [{ text: "OK", onPress: () => router.replace("/(client)/demande") }]
      );
    } catch {
      Alert.alert("Erreur", "Impossible d'accepter cette offre pour l'instant.");
    }
  };

  const gererRefuser = async (offreId: string) => {
    try {
      await refuserOffre(offreId);
      reload();
    } catch {
      Alert.alert("Erreur", "Impossible de refuser cette offre pour l'instant.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(client)/demande")}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ma demande</Text>
      </View>

      {loading && !demande ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : !demande ? null : (
        <FlatList
          data={offresTriees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <>
              <View style={styles.demandeCard}>
                <View style={styles.demandeTopRow}>
                  <View style={styles.categorieChip}>
                    <Image source={categorieIcon(demande.categorie)} contentFit="contain" style={styles.categorieIcon} />
                    <Text style={styles.categorieText}>{categorieLabel(demande.categorie)}</Text>
                  </View>
                  <Text style={styles.publieeText}>publiée {formatDateRelative(demande.createdAt).toLowerCase()}</Text>
                </View>
                <Text style={styles.description}>{apercuDescription(demande)}</Text>
                <View style={styles.chipsRow}>
                  <View style={styles.budgetChip}>
                    <Text style={styles.budgetText}>Budget max {formatFcfa(demande.budgetMaxFcfa)}</Text>
                  </View>
                  {demande.commune && (
                    <View style={styles.communeChip}>
                      <MapPin size={12} color="#B91C1C" />
                      <Text style={styles.communeText}>{demande.commune}</Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.offresHeaderRow}>
                <Text style={styles.offresTitle}>
                  {offresTriees.length} offre{offresTriees.length > 1 ? "s" : ""} reçue{offresTriees.length > 1 ? "s" : ""}
                </Text>
                {offresTriees.length > 1 && <Text style={styles.trieesText}>triées par prix</Text>}
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <OffreCard
              offre={item}
              meilleurPrix={index === 0 && offresTriees.length > 1}
              onAccepter={() => gererAccepter(item.id)}
              onRefuser={() => gererRefuser(item.id)}
            />
          )}
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
  headerTitle: {
    fontFamily: Fonts.title,
    fontSize: 18,
    color: Colors.brand.encre,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  demandeCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  demandeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  categorieChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.brand.tintOr,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
  },
  categorieIcon: {
    width: 14,
    height: 14,
  },
  categorieText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.brand.orange,
  },
  publieeText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  description: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.brand.encre,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  budgetChip: {
    backgroundColor: Colors.brand.tintVert,
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 999,
  },
  budgetText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.brand.vert,
  },
  communeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 999,
  },
  communeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: "#B91C1C",
  },
  offresHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  offresTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
  },
  trieesText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.six,
  },
});
