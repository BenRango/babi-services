import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Navigation } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

interface MapSectionProps {
  prestataireNom: string;
  arriveeEstimee: string;
}

/**
 * Carte statique illustrative — pas de vraie librairie de cartographie
 * dans cette passe (décision produit). À remplacer par une vraie carte
 * (expo-maps / react-native-maps) dans une passe ultérieure.
 */
export default function MapSection({ prestataireNom, arriveeEstimee }: MapSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, row) => (
          <View key={row} style={styles.gridRow} />
        ))}
      </View>

      <View style={[styles.marker, styles.markerProvider]}>
        <View style={styles.markerDotProvider} />
      </View>
      <View style={[styles.marker, styles.markerUser]}>
        <View style={styles.markerDotUser} />
      </View>

      <View style={styles.infoBubble}>
        <Navigation size={16} color={Colors.brand.orange} />
        <Text style={styles.infoText}>
          {prestataireNom} arrive dans {arriveeEstimee}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: Radii.md,
    backgroundColor: "#E9F0EA",
    overflow: "hidden",
    marginBottom: Spacing.three,
  },
  grid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-evenly",
  },
  gridRow: {
    height: 1,
    backgroundColor: "#D3DED4",
  },
  marker: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  markerProvider: {
    top: 60,
    left: 90,
  },
  markerDotProvider: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.brand.orange,
  },
  markerUser: {
    width: 24,
    height: 24,
    borderRadius: 12,
    top: 140,
    right: 70,
  },
  markerDotUser: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.brand.vert,
  },
  infoBubble: {
    position: "absolute",
    bottom: Spacing.two,
    left: Spacing.two,
    right: Spacing.two,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: Radii.sm,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.brand.encre,
    flexShrink: 1,
  },
});
