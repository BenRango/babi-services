import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { PrestataireResume } from "@/types/prestataire";
import { formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ArtisanCardProps {
  prestataire: PrestataireResume;
  onPress: () => void;
}

export default function ArtisanCard({ prestataire, onPress }: ArtisanCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
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
        <Text style={styles.prix}>{formatFcfa(prestataire.tarifHoraire)}</Text>
        <Text style={styles.parHeure}>/heure</Text>
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
    fontSize: 14,
    color: Colors.brand.orange,
  },
  parHeure: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
