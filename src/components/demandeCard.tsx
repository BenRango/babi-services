import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Demande } from "@/types/demande";
import { formatDateRelative, formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DemandeCardProps {
  demande: Demande;
  onPress: () => void;
}

function statutMeta(demande: Demande): { label: string; color: string; background: string } {
  if (demande.statut === "annulee") {
    return { label: "Annulée", color: "#B91C1C", background: "#FEE2E2" };
  }
  if (demande.statut === "fermee") {
    return { label: "Offre acceptée", color: Colors.brand.vert, background: Colors.brand.tintVert };
  }
  if (demande.statut === "en_cours") {
    return { label: `${demande.offresCount} offre${demande.offresCount > 1 ? "s" : ""}`, color: Colors.brand.orange, background: Colors.brand.tintOr };
  }
  return { label: "En attente d'offres", color: Colors.light.textSecondary, background: Colors.light.backgroundElement };
}

export default function DemandeCard({ demande, onPress }: DemandeCardProps) {
  const statut = statutMeta(demande);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Image source={categorieIcon(demande.categorie)} contentFit="contain" style={styles.icon} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.categorie}>{categorieLabel(demande.categorie)}</Text>
          <Text style={styles.date}>{formatDateRelative(demande.dateCreation)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statut.background }]}>
          <Text style={[styles.badgeText, { color: statut.color }]}>{statut.label}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {demande.description}
      </Text>
      <Text style={styles.budget}>Budget max : {formatFcfa(demande.budgetMax)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  header: {
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
  headerText: {
    flex: 1,
  },
  categorie: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  date: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  budget: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.brand.orange,
  },
});
