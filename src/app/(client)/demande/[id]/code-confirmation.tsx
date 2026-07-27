import ConfirmationCodeDisplay from "@/components/confirmationCodeDisplay";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getMesPrestations } from "@api/prestations";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, ChevronLeft } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CodeConfirmation() {
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Code de confirmation</Text>
      </View>

      <View style={styles.body}>
        {prestation.statut === "terminee" || !prestation.codeConfirmation ? (
          <View style={styles.successBlock}>
            <CheckCircle2 size={56} color={Colors.brand.vert} />
            <Text style={styles.successTitle}>Prestation validée</Text>
            <Text style={styles.successSubtitle}>
              Le prestataire a saisi le code. La prestation est terminée.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/(client)/demande")}>
              <Text style={styles.primaryButtonText}>Retour à mes demandes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.instructions}>
              Communiquez ce code à votre prestataire une fois la prestation terminée. Le paiement sera
              automatiquement libéré après validation.
            </Text>
            <ConfirmationCodeDisplay code={prestation.codeConfirmation} />
          </>
        )}
      </View>
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
  body: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: "center",
  },
  instructions: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.brand.encre,
    textAlign: "center",
    lineHeight: 20,
  },
  successBlock: {
    alignItems: "center",
  },
  successTitle: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
    marginTop: Spacing.three,
  },
  successSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
  },
  primaryButton: {
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
  },
  primaryButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
