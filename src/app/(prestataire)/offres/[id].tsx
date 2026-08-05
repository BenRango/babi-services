import DemandeDescription from "@/components/demandeDescription";
import OffreMessage from "@/components/offreMessage";
import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { OffreStatut } from "@/types/offre";
import { formatDateRelative, formatDelai, formatFcfa } from "@/utils/format";
import { getMesOffres } from "@api/offres";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function statutMeta(statut: OffreStatut): { label: string; color: string; background: string } {
  switch (statut) {
    case OffreStatut.EN_ATTENTE:
      return { label: "En attente", color: Colors.brand.orange, background: Colors.brand.tintOr };
    case OffreStatut.ACCEPTEE:
      return { label: "Acceptée", color: Colors.brand.vert, background: Colors.brand.tintVert };
    case OffreStatut.REFUSEE:
      return { label: "Refusée", color: "#B91C1C", background: "#FEE2E2" };
    case OffreStatut.EXPIREE:
      return { label: "Expirée", color: Colors.light.textSecondary, background: Colors.light.backgroundSelected };
  }
}

export default function DetailOffre() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loading, data: offres } = useAsync(getMesOffres);
  const offre = offres?.find((o) => o.id === id);

  if (loading && !offre) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!offre) return null;

  const statut = statutMeta(offre.statut);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de l&apos;offre</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.statutBadge, { backgroundColor: statut.background, alignSelf: "flex-start" }]}>
          <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
        </View>

        <View style={styles.demandeCard}>
          <View style={styles.demandeTopRow}>
            <View style={styles.iconWrap}>
              <Image source={categorieIcon(offre.demande.categorie)} contentFit="contain" style={styles.icon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.categorie}>{categorieLabel(offre.demande.categorie)}</Text>
              <Text style={styles.budget}>Budget max {formatFcfa(offre.demande.budgetMaxFcfa)}</Text>
            </View>
          </View>
          <DemandeDescription demande={offre.demande} textStyle={styles.description} />
          {offre.demande.picture_url && (
            <Image source={{ uri: offre.demande.picture_url }} style={styles.photo} contentFit="cover" />
          )}
          {offre.demande.commune && (
            <View style={styles.communeRow}>
              <MapPin size={12} color={Colors.brand.orange} />
              <Text style={styles.commune}>{offre.demande.commune}</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Votre offre</Text>
        <View style={styles.offreCard}>
          <View style={styles.offreRow}>
            <Text style={styles.offreLabel}>Prix proposé</Text>
            <Text style={styles.offreValue}>{formatFcfa(offre.prixProposeFcfa)}</Text>
          </View>
          <View style={styles.offreRow}>
            <Text style={styles.offreLabel}>Délai</Text>
            <Text style={styles.offreValue}>{formatDelai(offre.delaiMinutes)}</Text>
          </View>
          <View style={styles.offreRow}>
            <Text style={styles.offreLabel}>Envoyée</Text>
            <Text style={styles.offreValue}>{formatDateRelative(offre.createdAt)}</Text>
          </View>
          {(offre.message || offre.messageAudioUrl) && (
            <>
              <Text style={styles.messageLabel}>Votre message</Text>
              <OffreMessage offre={offre} textStyle={styles.message} />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
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
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  statutBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: Spacing.three,
  },
  statutText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
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
    marginBottom: Spacing.two,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.two,
  },
  icon: {
    width: 24,
    height: 24,
  },
  categorie: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  budget: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.orange,
    marginTop: 1,
  },
  description: {
    marginBottom: Spacing.two,
  },
  photo: {
    width: "100%",
    height: 160,
    borderRadius: Radii.sm,
    marginBottom: Spacing.two,
    backgroundColor: Colors.light.backgroundSelected,
  },
  communeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commune: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.orange,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
    marginBottom: Spacing.two,
  },
  offreCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
  },
  offreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  offreLabel: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  offreValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  messageLabel: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.encre,
    marginTop: Spacing.two,
    marginBottom: 4,
  },
  message: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
  },
});
