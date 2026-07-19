import ContinuerButton from "@/components/continuerButton";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getPrestataire } from "@/services/prestataireService";
import { formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, Star } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FicheArtisan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { loading, data: prestataire } = useAsync(() => getPrestataire(id), [id]);

  const contacter = () => {
    if (!prestataire) return;
    router.push({
      pathname: "/(client)/message",
      params: {
        prestataireId: prestataire.id,
        nom: prestataire.nom,
        avatarUrl: prestataire.avatarUrl,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
      </View>

      {loading && !prestataire ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : !prestataire ? (
        <View style={styles.center}>
          <Text style={styles.empty}>Artisan introuvable.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Image source={{ uri: prestataire.avatarUrl }} style={styles.avatar} contentFit="cover" />
            <Text style={styles.nom}>{prestataire.nom}</Text>
            <Text style={styles.metier}>{prestataire.metier}</Text>

            <View style={styles.locationRow}>
              <MapPin size={14} color={Colors.brand.orange} />
              <Text style={styles.locationText}>À {prestataire.distanceKm} km de vous</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <View style={styles.statRatingRow}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <Text style={styles.statValue}>{prestataire.note}</Text>
                </View>
                <Text style={styles.statLabel}>{prestataire.nbAvis} avis</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatFcfa(prestataire.tarifHoraire)}</Text>
                <Text style={styles.statLabel}>par heure</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <ContinuerButton filled text="Contacter" onPress={contacter} style={styles.contacterButton} />
          </View>
        </>
      )}
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
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.light.backgroundElement,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: Radii.lg,
    backgroundColor: Colors.brand.tintOr,
    marginBottom: Spacing.three,
  },
  nom: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  metier: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.two,
  },
  locationText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.three,
    marginTop: Spacing.four,
    width: "100%",
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    alignItems: "center",
  },
  statRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    alignItems: "center",
  },
  contacterButton: {
    width: "100%",
  },
});
