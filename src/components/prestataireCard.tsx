import BadgeArtisanChip from "@/components/badgeArtisanChip";
import { categorieLabel } from "@/constants/categories";
import { communeLabel } from "@/constants/communes";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { PrestataireRecherche } from "@api/prestataires";
import { couleurAvatar, initiales } from "@/utils/avatar";
import { MapPin } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PrestataireCardProps {
  prestataire: PrestataireRecherche;
  onPress: () => void;
}

export default function PrestataireCard({ prestataire, onPress }: PrestataireCardProps) {
  const categories = prestataire.categories.map(categorieLabel).join(", ");
  const communes = prestataire.communes.map(communeLabel).join(", ");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.avatar, { backgroundColor: couleurAvatar(prestataire.id) }]}>
        <Text style={styles.avatarText}>{initiales(prestataire.nom)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nom} numberOfLines={1}>{prestataire.nom}</Text>
        <Text style={styles.categories} numberOfLines={1}>{categories || "Aucune catégorie"}</Text>
        {communes.length > 0 && (
          <View style={styles.communeRow}>
            <MapPin size={11} color={Colors.light.textSecondary} />
            <Text style={styles.communes} numberOfLines={1}>{communes}</Text>
          </View>
        )}
        <BadgeArtisanChip badge={prestataire.badge} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radii.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 18,
    color: "#FFFFFF",
  },
  info: {
    flex: 1,
    marginLeft: Spacing.two,
    gap: 2,
  },
  nom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  categories: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  communeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  communes: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    flexShrink: 1,
  },
});
