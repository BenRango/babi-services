import { Colors, Fonts, Spacing } from "@/constants/theme";
import { EtapePrestation, StatutPrestation } from "@/types/prestation";
import { Check } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ETAPES: { statut: StatutPrestation; titre: string; description: string }[] = [
  { statut: "confirmee", titre: "Confirmée", description: "Le prestataire a accepté votre demande." },
  { statut: "en_route", titre: "En route", description: "Le prestataire se dirige vers vous." },
  { statut: "en_cours", titre: "Intervention en cours", description: "Le prestataire travaille sur place." },
  { statut: "terminee", titre: "Terminée", description: "Donnez le code au prestataire pour clôturer." },
];

interface TimelineProps {
  historique: EtapePrestation[];
  statutActuel: StatutPrestation;
  onAvancer?: () => void;
}

export default function Timeline({ historique, statutActuel, onAvancer }: TimelineProps) {
  const indexActuel = ETAPES.findIndex((e) => e.statut === statutActuel);

  return (
    <View style={styles.container}>
      {ETAPES.map((etape, index) => {
        const atteinte = index <= indexActuel;
        const estProchaine = index === indexActuel + 1;
        const estDerniere = index === ETAPES.length - 1;

        const contenu = (
          <View style={styles.step} key={etape.statut}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.dot,
                  atteinte && styles.dotDone,
                  estProchaine && onAvancer && styles.dotNext,
                ]}
              >
                {atteinte && <Check size={14} color="#FFFFFF" />}
              </View>
              {!estDerniere && (
                <View style={[styles.line, index < indexActuel && styles.lineDone]} />
              )}
            </View>
            <View style={styles.stepBody}>
              <Text style={[styles.stepTitle, atteinte && styles.stepTitleDone]}>{etape.titre}</Text>
              <Text style={styles.stepDescription}>{etape.description}</Text>
            </View>
          </View>
        );

        if (estProchaine && onAvancer) {
          return (
            <TouchableOpacity key={etape.statut} onPress={onAvancer} activeOpacity={0.7}>
              {contenu}
            </TouchableOpacity>
          );
        }
        return contenu;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.two,
  },
  step: {
    flexDirection: "row",
  },
  stepLeft: {
    alignItems: "center",
    width: 28,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: {
    backgroundColor: Colors.brand.vert,
  },
  dotNext: {
    backgroundColor: Colors.brand.tintOr,
    borderWidth: 2,
    borderColor: Colors.brand.orange,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 32,
    backgroundColor: Colors.light.backgroundSelected,
  },
  lineDone: {
    backgroundColor: Colors.brand.vert,
  },
  stepBody: {
    flex: 1,
    paddingLeft: Spacing.two,
    paddingBottom: Spacing.four,
  },
  stepTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  stepTitleDone: {
    color: Colors.brand.encre,
  },
  stepDescription: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
});
