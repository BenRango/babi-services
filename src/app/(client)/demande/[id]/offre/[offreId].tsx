import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { accepterOffre, getOffre, refuserOffre } from "@/services/offreService";
import { formatFcfa } from "@/utils/format";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Clock, MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailOffre() {
  const { id, offreId } = useLocalSearchParams<{ id: string; offreId: string }>();
  const router = useRouter();
  const { loading, data: offre } = useAsync(() => getOffre(offreId), [offreId]);
  const [enCours, setEnCours] = useState<"accepter" | "refuser" | null>(null);

  const accepter = async () => {
    setEnCours("accepter");
    try {
      await accepterOffre(offreId);
      router.replace(`/(client)/demande/${id}/paiement`);
    } finally {
      setEnCours(null);
    }
  };

  const refuser = async () => {
    setEnCours("refuser");
    try {
      await refuserOffre(offreId);
      router.back();
    } finally {
      setEnCours(null);
    }
  };

  if (loading && !offre) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!offre) return null;
  const { prestataire } = offre;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail de l&apos;offre</Text>
      </View>

      <View style={styles.body}>
        <Image source={{ uri: prestataire.avatarUrl }} style={styles.avatar} contentFit="cover" />
        <Text style={styles.nom}>{prestataire.nom}</Text>
        <Text style={styles.metier}>{prestataire.metier}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Star size={13} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.statText}>{prestataire.note} ({prestataire.nbAvis})</Text>
          </View>
          <View style={styles.statChip}>
            <MapPin size={13} color={Colors.light.textSecondary} />
            <Text style={styles.statText}>{prestataire.distanceKm} km</Text>
          </View>
          <View style={styles.statChip}>
            <Clock size={13} color={Colors.light.textSecondary} />
            <Text style={styles.statText}>~{offre.delaiHeures}h</Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Prix proposé</Text>
          <Text style={styles.price}>{formatFcfa(offre.prix)}</Text>
        </View>

        <Text style={styles.message}>{offre.message}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.refuserButton]}
          onPress={refuser}
          disabled={enCours !== null}
        >
          {enCours === "refuser" ? (
            <ActivityIndicator color={Colors.brand.encre} />
          ) : (
            <Text style={styles.refuserText}>Refuser</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.accepterButton]}
          onPress={accepter}
          disabled={enCours !== null}
        >
          {enCours === "accepter" ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.accepterText}>Accepter</Text>
          )}
        </TouchableOpacity>
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
    alignItems: "center",
    paddingHorizontal: Spacing.four,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.brand.tintOr,
    marginBottom: Spacing.two,
  },
  nom: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  metier: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.three,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.light.backgroundElement,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.encre,
  },
  priceCard: {
    backgroundColor: Colors.brand.tintOr,
    borderRadius: Radii.md,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    alignItems: "center",
    marginBottom: Spacing.three,
  },
  priceLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.brand.orange,
  },
  price: {
    fontFamily: Fonts.title,
    fontSize: 26,
    color: Colors.brand.orange,
    marginTop: 2,
  },
  message: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.brand.encre,
    textAlign: "center",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    marginTop: "auto",
  },
  actionButton: {
    flex: 1,
    height: 56,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  refuserButton: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 2,
    borderColor: Colors.light.backgroundSelected,
  },
  refuserText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  accepterButton: {
    backgroundColor: Colors.brand.orange,
  },
  accepterText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
