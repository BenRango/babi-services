import DemandeDescription from "@/components/demandeDescription";
import Timeline from "@/components/timeline";
import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { formatFcfa } from "@/utils/format";
import { getMesPrestations } from "@api/prestations";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, ChevronLeft, KeyRound, ShieldCheck, User } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuiviPrestation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loading, data: prestations, reload } = useAsync(getMesPrestations);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const prestation = prestations?.find((p) => p.offre.demande.id === id);

  if (loading && !prestation) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!prestation) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/(client)/demande")}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi de la mission</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.providerCard}>
          <View style={styles.avatar}>
            <User size={22} color={Colors.brand.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerNom}>{prestation.prestataire.nom}</Text>
            <Text style={styles.providerMetier}>{categorieLabel(prestation.offre.demande.categorie)}</Text>
          </View>
        </View>

        <DemandeDescription demande={prestation.offre.demande} textStyle={styles.description} />

        <View style={styles.timelineCard}>
          <Timeline historique={[]} statutActuel={prestation.statut} />
        </View>

        <View style={styles.paymentInfo}>
          <ShieldCheck size={18} color={Colors.brand.vert} />
          <Text style={styles.paymentInfoText}>
            {formatFcfa(prestation.montantFcfa)} sera libéré au prestataire uniquement après validation du code de
            confirmation.
          </Text>
        </View>

        {prestation.codeConfirmation && (
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => router.push(`/(client)/demande/${id}/code-confirmation`)}
          >
            <KeyRound size={16} color="#FFFFFF" />
            <Text style={styles.codeButtonText}>Voir mon code de confirmation</Text>
          </TouchableOpacity>
        )}

        {prestation.statut === "terminee" && (
          <View style={styles.successBlock}>
            <CheckCircle2 size={40} color={Colors.brand.vert} />
            <Text style={styles.successText}>Prestation terminée.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  center: {
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
    fontSize: 17,
    color: Colors.brand.encre,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  providerNom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  providerMetier: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  description: {
    marginBottom: Spacing.three,
  },
  timelineCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    backgroundColor: Colors.brand.tintVert,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  paymentInfoText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.brand.encre,
    lineHeight: 18,
  },
  codeButton: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
    justifyContent: "center",
  },
  codeButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
  successBlock: {
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  successText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.brand.encre,
  },
});
