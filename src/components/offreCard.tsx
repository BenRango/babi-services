import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Offre } from "@/types/offre";
import { formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OffreCardProps {
  offre: Offre;
  onPress: () => void;
}

export default function OffreCard({ offre, onPress }: OffreCardProps) {
  const { prestataire } = offre;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {offre.recommandee && (
        <View style={styles.recommandeeBar}>
          <Text style={styles.recommandeeText}>Recommandée · Meilleur rapport qualité/prix</Text>
        </View>
      )}
      <View style={styles.body}>
        <Image source={{ uri: prestataire.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <View style={styles.info}>
          <Text style={styles.nom}>{prestataire.nom}</Text>
          <Text style={styles.metier}>{prestataire.metier}</Text>
          <View style={styles.row}>
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.note}>{prestataire.note}</Text>
            <Text style={styles.nbAvis}>({prestataire.nbAvis})</Text>
            <Text style={styles.distance}>· {prestataire.distanceKm} km</Text>
          </View>
        </View>
        <View style={styles.priceBlock}>
          <Text style={styles.prix}>{formatFcfa(offre.prix)}</Text>
          <Text style={styles.delai}>~{offre.delaiHeures}h</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    overflow: "hidden",
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  recommandeeBar: {
    backgroundColor: Colors.brand.orange,
    paddingVertical: 6,
    paddingHorizontal: Spacing.three,
  },
  recommandeeText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: "#FFFFFF",
  },
  body: {
    flexDirection: "row",
    padding: Spacing.three,
    alignItems: "center",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.two,
  },
  nom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  metier: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  note: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.brand.encre,
  },
  nbAvis: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  distance: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  priceBlock: {
    alignItems: "flex-end",
  },
  prix: {
    fontFamily: Fonts.title,
    fontSize: 15,
    color: Colors.brand.orange,
  },
  delai: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
