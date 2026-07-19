import MapSection from "@/components/mapSection";
import Timeline from "@/components/timeline";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { avancerStatut, getPrestationByDemande } from "@/services/prestationService";
import { formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MessageCircle, ShieldCheck } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SuiviPrestation() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loading, data: prestation, reload } = useAsync(() => getPrestationByDemande(id), [id]);

  const avancer = async () => {
    if (!prestation) return;
    await avancerStatut(prestation.id);
    reload();
  };

  if (loading && !prestation) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!prestation) return null;
  const { prestataire } = prestation;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Suivi de la mission</Text>
          <Text style={styles.subtitle}>Prestataire en intervention</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.providerCard}>
          <Image source={{ uri: prestataire.avatarUrl }} style={styles.avatar} contentFit="cover" />
          <View style={styles.providerInfo}>
            <Text style={styles.providerNom}>{prestataire.nom}</Text>
            <Text style={styles.providerMetier}>{prestataire.metier}</Text>
          </View>
          <TouchableOpacity style={styles.chatButton} onPress={() => router.push("/(client)/message")}>
            <MessageCircle size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {prestation.statut === "en_route" && (
          <MapSection prestataireNom={prestataire.nom} arriveeEstimee="12 min" />
        )}

        <View style={styles.timelineCard}>
          <Timeline
            historique={prestation.historique}
            statutActuel={prestation.statut}
            onAvancer={prestation.statut !== "terminee" ? avancer : undefined}
          />
        </View>

        <View style={styles.paymentInfo}>
          <ShieldCheck size={18} color={Colors.brand.vert} />
          <Text style={styles.paymentInfoText}>
            {formatFcfa(prestation.montant)} sera libéré au prestataire uniquement après validation du code de
            confirmation.
          </Text>
        </View>

        {prestation.statut === "terminee" && (
          <TouchableOpacity
            style={styles.codeButton}
            onPress={() => router.push(`/(client)/demande/${id}/code-confirmation`)}
          >
            <Text style={styles.codeButtonText}>Voir mon code de confirmation</Text>
          </TouchableOpacity>
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
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 17,
    color: Colors.brand.encre,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  providerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand.tintOr,
  },
  providerInfo: {
    flex: 1,
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
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.brand.orange,
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  codeButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
