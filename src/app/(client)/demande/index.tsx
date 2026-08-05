import DemandeCard from "@/components/demandeCard";
import EmptyState from "@/components/emptyState";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getMesDemandes } from "@api/demandes";
import { getMesPrestations } from "@api/prestations";
import { Demande, DemandeStatut } from "@/types/demande";
import { useFocusEffect, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filtre = "toutes" | DemandeStatut;

const FILTRES: { id: Filtre; label: string }[] = [
  { id: "toutes", label: "Toutes" },
  { id: DemandeStatut.OUVERTE, label: "Ouverte" },
  { id: DemandeStatut.EN_COURS, label: "En cours" },
  { id: DemandeStatut.FERMEE, label: "Terminée" },
  { id: DemandeStatut.ANNULEE, label: "Annulée" },
];

export default function MesDemandes() {
  const router = useRouter();
  const { loading, error, data, reload } = useAsync(getMesDemandes);
  const { data: prestations, reload: reloadPrestations } = useAsync(getMesPrestations);
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  useFocusEffect(
    useCallback(() => {
      reload();
      reloadPrestations();
    }, [reload, reloadPrestations])
  );

  // Demande.statut ne passe jamais à "fermee" tout seul quand la prestation se
  // termine — on croise avec Prestation.statut pour savoir si c'est vraiment fini.
  const prestationParDemande = new Map((prestations ?? []).map((p) => [p.offre.demande.id, p]));

  const statutAffiche = (demande: Demande): DemandeStatut => {
    if (prestationParDemande.get(demande.id)?.statut === "terminee") return DemandeStatut.FERMEE;
    return demande.statut;
  };

  const demandesFiltrees = (data ?? []).filter(
    (d) => filtre === "toutes" || statutAffiche(d) === filtre
  );

  const ouvrirDemande = (demande: Demande) => {
    if (prestationParDemande.has(demande.id)) {
      router.push(`/(client)/demande/${demande.id}/suivi`);
    } else {
      router.push(`/(client)/demande/${demande.id}/offres`);
    }
  };

  const creerDemande = () => router.push("/(client)/demande/nouvelle");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes demandes</Text>
        <TouchableOpacity style={styles.addButton} onPress={creerDemande}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtresScroll}
        contentContainerStyle={styles.filtresRow}
      >
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

      {loading && !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Impossible de charger vos demandes.</Text>
        </View>
      ) : data && data.length === 0 ? (
        <EmptyState
          emoji="🧰"
          title="Vous n'avez pas encore de demande"
          subtitle="Publiez votre premier besoin (plomberie, ménage, électricité...) et recevez des offres de prestataires près de chez vous."
          ctaLabel="Créer ma première demande"
          onPressCta={creerDemande}
        />
      ) : demandesFiltrees.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Aucune demande avec ce statut.</Text>
        </View>
      ) : (
        <FlatList
          data={demandesFiltrees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <DemandeCard
              demande={{ ...item, statut: statutAffiche(item) }}
              statutPrestation={prestationParDemande.get(item.id)?.statut}
              onPress={() => ouvrirDemande(item)}
            />
          )}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={Colors.brand.orange} />}
        />
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
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.encre,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  filtresScroll: {
    flexGrow: 0,
    flexShrink: 0,
    height: 60,
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
