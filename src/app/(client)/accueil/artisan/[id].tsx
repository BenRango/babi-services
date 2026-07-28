import BadgeArtisanChip from "@/components/badgeArtisanChip";
import ContinuerButton from "@/components/continuerButton";
import { categorieLabel } from "@/constants/categories";
import { communeLabel } from "@/constants/communes";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { couleurAvatar, initiales } from "@/utils/avatar";
import { rechercherPrestataires } from "@api/prestataires";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, ShieldCheck } from "lucide-react-native";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function kycMeta(statut: string): { label: string; color: string; background: string } {
  if (statut === "verifie") return { label: "Vérifié", color: Colors.brand.vert, background: Colors.brand.tintVert };
  if (statut === "en_cours") {
    return { label: "Vérification en cours", color: Colors.brand.orange, background: Colors.brand.tintOr };
  }
  return { label: "Non vérifié", color: Colors.light.textSecondary, background: Colors.light.backgroundSelected };
}

export default function FicheArtisan() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { loading, data: prestataires } = useAsync(() => rechercherPrestataires());
  const prestataire = prestataires?.find((p) => p.id === id);

  const contacter = () => {
    if (!prestataire) return;
    router.push(`/(client)/message/${prestataire.id}`);
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
            <View style={[styles.avatar, { backgroundColor: couleurAvatar(prestataire.id) }]}>
              <Text style={styles.avatarText}>{initiales(prestataire.nom)}</Text>
            </View>
            <Text style={styles.nom}>{prestataire.nom}</Text>
            <Text style={styles.categories}>{prestataire.categories.map(categorieLabel).join(", ")}</Text>

            {prestataire.communes.length > 0 && (
              <View style={styles.locationRow}>
                <MapPin size={14} color={Colors.brand.orange} />
                <Text style={styles.locationText}>{prestataire.communes.map(communeLabel).join(", ")}</Text>
              </View>
            )}

            <View style={styles.badgesRow}>
              <BadgeArtisanChip badge={prestataire.badge} />
              {(() => {
                const kyc = kycMeta(prestataire.statutKyc);
                return (
                  <View style={[styles.kycBadge, { backgroundColor: kyc.background }]}>
                    <ShieldCheck size={12} color={kyc.color} />
                    <Text style={[styles.kycText, { color: kyc.color }]}>{kyc.label}</Text>
                  </View>
                );
              })()}
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
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  avatarText: {
    fontFamily: Fonts.title,
    fontSize: 32,
    color: "#FFFFFF",
  },
  nom: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  categories: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
    textAlign: "center",
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
  badgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.four,
  },
  kycBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  kycText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
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
