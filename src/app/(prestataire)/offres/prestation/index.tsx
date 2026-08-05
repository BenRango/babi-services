import DemandeDescription from "@/components/demandeDescription";
import Timeline from "@/components/timeline";
import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { usePolling } from "@/hooks/usePolling";
import { PrestationDetail, StatutPrestation } from "@/types/prestation";
import { formatFcfa } from "@/utils/format";
import { commencerPrestation, demarrerPrestation, getMesPrestations } from "@api/prestations";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckCircle2, ChevronLeft, MapPin, User } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POLLING_MS = 7000;

const ACTION_PAR_STATUT: Record<StatutPrestation, { label: string; suivant?: StatutPrestation } | null> = {
  confirmee: { label: "Je prends la route", suivant: "en_route" },
  en_route: { label: "Je suis arrivé, je commence", suivant: "en_cours" },
  en_cours: { label: "Terminer et saisir le code" },
  terminee: null,
};

export default function PrestationEnCours() {
  const router = useRouter();
  const { offreId } = useLocalSearchParams<{ offreId: string }>();
  const { loading, data: prestations, reload } = useAsync(getMesPrestations);
  const [override, setOverride] = useState<PrestationDetail | null>(null);
  const [enCours, setEnCours] = useState(false);

  const prestation = override ?? prestations?.find((p) => p.offreId === offreId) ?? null;
  usePolling(reload, POLLING_MS, prestation?.statut !== "terminee");

  if (loading && !prestation) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!prestation) return null;

  const action = ACTION_PAR_STATUT[prestation.statut];

  const gererAction = async () => {
    if (!action || enCours) return;
    if (action.suivant === "en_route") {
      setEnCours(true);
      try {
        // demarrerPrestation() ne renvoie pas offre/client/prestataire imbriqués
        // (contrairement à mes-prestations) — on fusionne au lieu de remplacer.
        const miseAJour = await demarrerPrestation(prestation.id);
        setOverride({ ...prestation, ...miseAJour });
      } catch {
        Alert.alert("Erreur", "Impossible de démarrer la prestation pour l'instant.");
      } finally {
        setEnCours(false);
      }
    } else if (action.suivant === "en_cours") {
      setEnCours(true);
      try {
        const miseAJour = await commencerPrestation(prestation.id);
        setOverride({ ...prestation, ...miseAJour });
      } catch {
        Alert.alert("Erreur", "Impossible de démarrer le travail pour l'instant.");
      } finally {
        setEnCours(false);
      }
    } else {
      router.push({ pathname: "/(prestataire)/offres/prestation/code", params: { prestationId: prestation.id, offreId } });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prestation en cours</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.clientCard}>
          <View style={styles.avatar}>
            <User size={22} color={Colors.brand.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.clientNom}>{prestation.client.nom}</Text>
            <Text style={styles.categorie}>{categorieLabel(prestation.offre.demande.categorie)}</Text>
          </View>
        </View>

        <DemandeDescription demande={prestation.offre.demande} textStyle={styles.description} />

        {prestation.offre.demande.picture_url && (
          <Image source={{ uri: prestation.offre.demande.picture_url }} style={styles.photo} contentFit="cover" />
        )}

        {prestation.offre.demande.commune && (
          <View style={styles.communeRow}>
            <MapPin size={13} color={Colors.brand.orange} />
            <Text style={styles.commune}>{prestation.offre.demande.commune}</Text>
          </View>
        )}

        <View style={styles.timelineCard}>
          <Timeline historique={[]} statutActuel={prestation.statut} perspective="prestataire" />
        </View>

        <View style={styles.montantCard}>
          <Text style={styles.montantLabel}>Montant de la prestation</Text>
          <Text style={styles.montant}>{formatFcfa(prestation.montantFcfa)}</Text>
        </View>

        {prestation.statut === "terminee" ? (
          <View style={styles.successBlock}>
            <CheckCircle2 size={40} color={Colors.brand.vert} />
            <Text style={styles.successText}>Prestation terminée, code validé.</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.actionButton} onPress={gererAction} disabled={enCours}>
            {enCours ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.actionButtonText}>{action?.label}</Text>
            )}
          </TouchableOpacity>
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
    fontSize: 18,
    color: Colors.brand.encre,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  clientCard: {
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
  clientNom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  categorie: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  photo: {
    width: "100%",
    height: 160,
    borderRadius: Radii.sm,
    marginBottom: Spacing.two,
    backgroundColor: Colors.light.backgroundSelected,
  },
  communeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: Spacing.three,
  },
  commune: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.orange,
  },
  timelineCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  montantCard: {
    backgroundColor: Colors.brand.tintOr,
    borderRadius: Radii.md,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  montantLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.brand.orange,
  },
  montant: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.orange,
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  actionButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  successBlock: {
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  successText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.brand.encre,
  },
});
