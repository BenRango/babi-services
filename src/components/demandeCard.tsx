import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Demande, DemandeStatut } from "@/types/demande";
import { StatutPrestation } from "@/types/prestation";
import { apercuDescription, formatDateRelative, formatFcfa } from "@/utils/format";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface DemandeCardProps {
  demande: Demande;
  /** Statut en direct de la prestation liée, si une offre a été acceptée. */
  statutPrestation?: StatutPrestation;
  onPress: () => void;
}

function labelStatutPrestation(statut: StatutPrestation): string {
  switch (statut) {
    case "confirmee":
      return "Confirmée";
    case "en_route":
      return "En route";
    case "en_cours":
      return "Intervention en cours";
    case "terminee":
      return "Terminée";
  }
}

function statutBadge(statut: DemandeStatut): { label: string; color: string; background: string } {
  switch (statut) {
    case DemandeStatut.OUVERTE:
      return { label: "Ouverte", color: Colors.brand.orange, background: Colors.brand.tintOr };
    case DemandeStatut.EN_COURS:
      return { label: "En cours", color: "#B45309", background: "#FEF3C7" };
    case DemandeStatut.FERMEE:
      return { label: "Terminée", color: Colors.brand.vert, background: Colors.brand.tintVert };
    case DemandeStatut.ANNULEE:
      return { label: "Annulée", color: "#B91C1C", background: "#FEE2E2" };
    case DemandeStatut.EXPIREE:
      return { label: "Expirée", color: Colors.light.textSecondary, background: Colors.light.backgroundSelected };
  }
}

function infoContextuelle(
  demande: Demande,
  statutPrestation?: StatutPrestation
): { label: string; color: string; background?: string } | null {
  if (demande.statut === DemandeStatut.OUVERTE) {
    if (demande.offres.length === 0) return null;
    return {
      label: `${demande.offres.length} offre${demande.offres.length > 1 ? "s" : ""}`,
      color: Colors.brand.vert,
      background: Colors.brand.tintVert,
    };
  }
  if (demande.statut === DemandeStatut.EN_COURS) {
    if (!statutPrestation) return null;
    return {
      label: labelStatutPrestation(statutPrestation),
      color: Colors.brand.vert,
      background: Colors.brand.tintVert,
    };
  }
  if (demande.statut === DemandeStatut.ANNULEE) {
    return { label: "Annulé", color: Colors.light.textSecondary };
  }
  return null;
}

export default function DemandeCard({ demande, statutPrestation, onPress }: DemandeCardProps) {
  const statut = statutBadge(demande.statut);
  const info = infoContextuelle(demande, statutPrestation);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.topRow}>
        <View style={styles.categorieChip}>
          <Text style={styles.categorieText}>{categorieLabel(demande.categorie)}</Text>
        </View>
        <View style={[styles.statutChip, { backgroundColor: statut.background }]}>
          <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={1}>
        {apercuDescription(demande)}
      </Text>
      <View style={styles.bottomRow}>
        <Text style={styles.budgetDate}>
          ≤ {formatFcfa(demande.budgetMaxFcfa)} · {formatDateRelative(demande.createdAt)}
        </Text>
        {info &&
          (info.background ? (
            <View style={[styles.infoBadge, { backgroundColor: info.background }]}>
              <Text style={[styles.infoBadgeText, { color: info.color }]}>{info.label}</Text>
            </View>
          ) : (
            <Text style={[styles.infoText, { color: info.color }]}>{info.label}</Text>
          ))}
      </View>
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
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  categorieChip: {
    backgroundColor: Colors.brand.tintOr,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
  },
  categorieText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.brand.orange,
  },
  statutChip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statutText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },
  description: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
    marginBottom: Spacing.two,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  budgetDate: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  infoText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
  infoBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
  },
  infoBadgeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
  },
});
