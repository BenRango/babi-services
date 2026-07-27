import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { COMMUNES_ABIDJAN, disponibilitePrestataire } from "@/services/_mockPrestataireData";
import { useRouter } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_COMMUNES = 3;

export default function Disponibilite() {
  const router = useRouter();
  const [disponible, setDisponible] = useState(disponibilitePrestataire.disponible);
  const [communes, setCommunes] = useState<string[]>(disponibilitePrestataire.communes);

  const basculerDisponible = (valeur: boolean) => {
    setDisponible(valeur);
    disponibilitePrestataire.disponible = valeur;
  };

  const basculerCommune = (commune: string) => {
    const dejaChoisie = communes.includes(commune);
    let nouvelles: string[];
    if (dejaChoisie) {
      nouvelles = communes.filter((c) => c !== commune);
    } else {
      if (communes.length >= MAX_COMMUNES) return;
      nouvelles = [...communes, commune];
    }
    setCommunes(nouvelles);
    disponibilitePrestataire.communes = nouvelles;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disponibilité</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.dispoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dispoTitle}>{disponible ? "Vous êtes disponible" : "Vous êtes indisponible"}</Text>
            <Text style={styles.dispoSubtitle}>
              {disponible ? "Vous recevez de nouvelles demandes." : "Vous ne recevez plus de nouvelles demandes."}
            </Text>
          </View>
          <Switch
            value={disponible}
            onValueChange={basculerDisponible}
            trackColor={{ false: Colors.light.backgroundSelected, true: Colors.brand.orange }}
            thumbColor="#FFFFFF"
          />
        </View>

        <Text style={styles.sectionTitle}>Vos communes d&apos;intervention</Text>
        <Text style={styles.sectionSubtitle}>
          Choisissez jusqu&apos;à {MAX_COMMUNES} communes où vous pouvez intervenir ({communes.length}/{MAX_COMMUNES}).
        </Text>

        <View style={styles.communesGrid}>
          {COMMUNES_ABIDJAN.map((commune) => {
            const choisie = communes.includes(commune);
            const desactivee = !choisie && communes.length >= MAX_COMMUNES;
            return (
              <TouchableOpacity
                key={commune}
                style={[styles.communeChip, choisie && styles.communeChipActive, desactivee && styles.communeChipDisabled]}
                onPress={() => basculerCommune(commune)}
                disabled={desactivee}
              >
                {choisie && <Check size={13} color="#FFFFFF" style={{ marginRight: 4 }} />}
                <Text style={[styles.communeText, choisie && styles.communeTextActive]}>{commune}</Text>
              </TouchableOpacity>
            );
          })}
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
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  dispoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  dispoTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  dispoSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.three,
  },
  communesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  communeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
  },
  communeChipActive: {
    backgroundColor: Colors.brand.orange,
    borderColor: Colors.brand.orange,
  },
  communeChipDisabled: {
    opacity: 0.4,
  },
  communeText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  communeTextActive: {
    color: "#FFFFFF",
  },
});
