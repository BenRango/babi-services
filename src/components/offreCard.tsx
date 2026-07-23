import BadgeArtisanChip from "@/components/badgeArtisanChip";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Offre, OffreStatut } from "@/types/offre";
import { couleurAvatar, initiales } from "@/utils/avatar";
import { formatDelai, formatFcfa } from "@/utils/format";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OffreCardProps {
  offre: Offre;
  meilleurPrix?: boolean;
  onAccepter: () => Promise<void>;
  onRefuser: () => Promise<void>;
}

function statutResolu(statut: OffreStatut): { label: string; color: string } | null {
  if (statut === OffreStatut.ACCEPTEE) return { label: "✓ Offre acceptée", color: Colors.brand.vert };
  if (statut === OffreStatut.REFUSEE) return { label: "Offre refusée", color: Colors.light.textSecondary };
  if (statut === OffreStatut.EXPIREE) return { label: "Offre expirée", color: Colors.light.textSecondary };
  return null;
}

export default function OffreCard({ offre, meilleurPrix, onAccepter, onRefuser }: OffreCardProps) {
  const [enCours, setEnCours] = useState<"accepter" | "refuser" | null>(null);
  const { prestataire } = offre;
  const nom = prestataire?.nom ?? "Prestataire";
  const resolu = statutResolu(offre.statut);

  const accepter = async () => {
    setEnCours("accepter");
    try {
      await onAccepter();
    } finally {
      setEnCours(null);
    }
  };

  const refuser = async () => {
    setEnCours("refuser");
    try {
      await onRefuser();
    } finally {
      setEnCours(null);
    }
  };

  return (
    <View style={styles.card}>
      {meilleurPrix && (
        <View style={styles.meilleurPrixBadge}>
          <Text style={styles.meilleurPrixText}>Meilleur prix</Text>
        </View>
      )}

      <View style={styles.body}>
        <View style={[styles.avatar, { backgroundColor: couleurAvatar(prestataire?.id ?? nom) }]}>
          <Text style={styles.avatarText}>{initiales(nom)}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nomRow}>
            <Text style={styles.nom}>{nom}</Text>
            {prestataire?.badge && <BadgeArtisanChip badge={prestataire.badge} />}
          </View>
          <Text style={styles.delai}>{formatDelai(offre.delaiMinutes)}</Text>
        </View>
        <Text style={styles.prix}>{formatFcfa(offre.prixProposeFcfa)}</Text>
      </View>

      {offre.message && (
        <View style={styles.messageBox}>
          <Text style={styles.message}>« {offre.message.trim()} »</Text>
        </View>
      )}

      {resolu ? (
        <Text style={[styles.statutResolu, { color: resolu.color }]}>{resolu.label}</Text>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.refuserButton]}
            onPress={refuser}
            disabled={enCours !== null}
          >
            {enCours === "refuser" ? (
              <ActivityIndicator color={Colors.brand.encre} />
            ) : (
              <Text style={styles.refuserText}>Refuser</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.accepterButton]}
            onPress={accepter}
            disabled={enCours !== null}
          >
            {enCours === "accepter" ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.accepterText}>Accepter</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  meilleurPrixBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.brand.tintVert,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: Spacing.two,
  },
  meilleurPrixText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.brand.vert,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.two,
    gap: 4,
  },
  nomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  nom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  delai: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  prix: {
    fontFamily: Fonts.title,
    fontSize: 16,
    color: Colors.brand.orange,
  },
  messageBox: {
    backgroundColor: Colors.brand.fond,
    borderRadius: Radii.sm,
    padding: Spacing.two,
    marginTop: Spacing.three,
  },
  message: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    fontStyle: "italic",
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: Radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  refuserButton: {
    backgroundColor: Colors.light.backgroundSelected,
  },
  refuserText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  accepterButton: {
    backgroundColor: Colors.brand.vert,
  },
  accepterText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: "#FFFFFF",
  },
  statutResolu: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    textAlign: "center",
    marginTop: Spacing.three,
  },
});
