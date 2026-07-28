import { COMMUNES_ABIDJAN } from "@/constants/communes";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getMe, updateProfile } from "@api/users";
import { useRouter } from "expo-router";
import { Check, ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_COMMUNES = 3;

export default function Disponibilite() {
  const router = useRouter();
  const { loading, data: user } = useAsync(getMe);

  // Pas encore de champ "disponible" côté backend — reste local pour l'instant.
  const [disponible, setDisponible] = useState(true);
  const [communes, setCommunes] = useState<string[]>([]);
  const [initialise, setInitialise] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    if (user && !initialise) {
      setCommunes(user.communes ?? []);
      setInitialise(true);
    }
  }, [user, initialise]);

  const basculerCommune = (id: string) => {
    setSucces(false);
    setCommunes((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_COMMUNES) return prev;
      return [...prev, id];
    });
  };

  const enregistrer = async () => {
    if (enregistrement) return;
    setEnregistrement(true);
    setErreur(null);
    setSucces(false);
    try {
      await updateProfile({ communes });
      setSucces(true);
    } catch {
      setErreur("Impossible d'enregistrer vos communes pour l'instant.");
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disponibilité</Text>
      </View>

      {loading && !user ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
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
              onValueChange={setDisponible}
              trackColor={{ false: Colors.light.backgroundSelected, true: Colors.brand.orange }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Text style={styles.sectionTitle}>Vos communes d&apos;intervention</Text>
          <Text style={styles.sectionSubtitle}>
            Choisissez jusqu&apos;à {MAX_COMMUNES} communes où vous pouvez intervenir ({communes.length}/
            {MAX_COMMUNES}).
          </Text>

          <View style={styles.communesGrid}>
            {COMMUNES_ABIDJAN.map((commune) => {
              const choisie = communes.includes(commune.id);
              const desactivee = !choisie && communes.length >= MAX_COMMUNES;
              return (
                <TouchableOpacity
                  key={commune.id}
                  style={[
                    styles.communeChip,
                    choisie && styles.communeChipActive,
                    desactivee && styles.communeChipDisabled,
                  ]}
                  onPress={() => basculerCommune(commune.id)}
                  disabled={desactivee}
                >
                  {choisie && <Check size={13} color="#FFFFFF" style={{ marginRight: 4 }} />}
                  <Text style={[styles.communeText, choisie && styles.communeTextActive]}>{commune.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {erreur && <Text style={styles.erreur}>{erreur}</Text>}
          {succes && <Text style={styles.succes}>Communes enregistrées.</Text>}

          <TouchableOpacity
            style={[styles.submitButton, enregistrement && styles.submitButtonDisabled]}
            onPress={enregistrer}
            disabled={enregistrement}
          >
            {enregistrement ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  center: {
    flex: 1,
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
  erreur: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#DC2626",
    marginTop: Spacing.three,
  },
  succes: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.vert,
    marginTop: Spacing.three,
  },
  submitButton: {
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.four,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
