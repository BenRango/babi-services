import { categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { MesOffre, OffreStatut } from "@/types/offre";
import { apercuDescription, formatDateRelative, formatFcfa } from "@/utils/format";
import { getMesOffres } from "@api/offres";
import { getMesPrestations } from "@api/prestations";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatutAffiche = OffreStatut | "terminee";
type Filtre = "toutes" | StatutAffiche;

const FILTRES: { id: Filtre; label: string }[] = [
  { id: "toutes", label: "Toutes" },
  { id: OffreStatut.EN_ATTENTE, label: "En attente" },
  { id: OffreStatut.ACCEPTEE, label: "Acceptées" },
  { id: "terminee", label: "Terminées" },
  { id: OffreStatut.REFUSEE, label: "Refusées" },
  { id: OffreStatut.EXPIREE, label: "Expirées" },
];

function statutMeta(statut: StatutAffiche): { label: string; color: string; background: string } {
  switch (statut) {
    case OffreStatut.EN_ATTENTE:
      return { label: "En attente", color: Colors.brand.orange, background: Colors.brand.tintOr };
    case OffreStatut.ACCEPTEE:
      return { label: "Acceptée", color: Colors.brand.vert, background: Colors.brand.tintVert };
    case "terminee":
      return { label: "Terminée", color: Colors.light.textSecondary, background: Colors.brand.tintVert };
    case OffreStatut.REFUSEE:
      return { label: "Refusée", color: "#B91C1C", background: "#FEE2E2" };
    case OffreStatut.EXPIREE:
      return { label: "Expirée", color: Colors.light.textSecondary, background: Colors.light.backgroundSelected };
  }
}

export default function MesOffresEnvoyees() {
  const router = useRouter();
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const { loading, data: offres, reload } = useAsync(getMesOffres);
  const { data: prestations, reload: reloadPrestations } = useAsync(getMesPrestations);

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadPrestations();
    }, [reload, reloadPrestations])
  );

  // OffreStatut reste "acceptee" pour toujours, même une fois la prestation
  // terminée — on croise avec Prestation.statut pour distinguer les deux.
  const prestationParOffre = new Map((prestations ?? []).map((p) => [p.offreId, p]));

  const statutAffiche = (offre: MesOffre): StatutAffiche => {
    if (offre.statut === OffreStatut.ACCEPTEE && prestationParOffre.get(offre.id)?.statut === "terminee") {
      return "terminee";
    }
    return offre.statut;
  };

  const toutesLesOffres = offres ?? [];
  const offresFiltrees = toutesLesOffres.filter((o) => filtre === "toutes" || statutAffiche(o) === filtre);

  const ouvrirOffre = (offre: MesOffre) => {
    if (offre.statut === OffreStatut.ACCEPTEE) {
      router.push({ pathname: "/(prestataire)/offres/prestation", params: { offreId: offre.id } });
    } else {
      router.push(`/(prestataire)/offres/${offre.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes offres envoyées</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtresScroll} contentContainerStyle={styles.filtresRow}>
        {FILTRES.map((f) => {
          const actif = filtre === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filtreChip, actif && styles.filtreChipActif]}
              onPress={() => setFiltre(f.id)}
            >
              <Text style={[styles.filtreText, actif && styles.filtreTextActif]}>{f.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading && !offres ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {offresFiltrees.map((offre) => {
            const statut = statutMeta(statutAffiche(offre));
            return (
              <TouchableOpacity key={offre.id} style={styles.card} activeOpacity={0.7} onPress={() => ouvrirOffre(offre)}>
                <View style={styles.cardTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.categorie}>{categorieLabel(offre.demande.categorie)}</Text>
                    <Text style={styles.date}>{formatDateRelative(offre.createdAt)}</Text>
                  </View>
                  <View style={[styles.statutBadge, { backgroundColor: statut.background }]}>
                    <Text style={[styles.statutText, { color: statut.color }]}>{statut.label}</Text>
                  </View>
                </View>
                <Text style={styles.description} numberOfLines={1}>
                  {apercuDescription(offre.demande)}
                </Text>
                <Text style={styles.prix}>{formatFcfa(offre.prixProposeFcfa)}</Text>
              </TouchableOpacity>
            );
          })}
          {offresFiltrees.length === 0 && (
            <Text style={styles.empty}>Aucune offre avec ce statut.</Text>
          )}
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
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  filtresScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 44,
  },
  filtresRow: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    paddingBottom: Spacing.three,
    alignItems: "flex-start",
  },
  filtreChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
  },
  filtreChipActif: {
    backgroundColor: Colors.brand.orange,
    borderColor: Colors.brand.orange,
  },
  filtreText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  filtreTextActif: {
    color: "#FFFFFF",
  },
  list: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  card: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  categorie: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  date: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  statutBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statutText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.two,
  },
  prix: {
    fontFamily: Fonts.title,
    fontSize: 16,
    color: Colors.brand.orange,
  },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.six,
  },
});
