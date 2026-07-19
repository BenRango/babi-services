import DemandeCard from "@/components/demandeCard";
import EmptyState from "@/components/emptyState";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { listDemandes } from "@/services/demandeService";
import { Demande } from "@/types/demande";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MesDemandes() {
  const router = useRouter();
  const { loading, error, data, reload } = useAsync(listDemandes);

  const ouvrirDemande = (demande: Demande) => {
    if (demande.prestationId) {
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
        <TouchableOpacity style={styles.cta} onPress={creerDemande}>
          <Plus size={18} color="#FFFFFF" />
          <Text style={styles.ctaText}>Créer une demande</Text>
        </TouchableOpacity>
      </View>

      {loading && !data ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Impossible de charger vos demandes.</Text>
        </View>
      ) : data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <DemandeCard demande={item} onPress={() => ouvrirDemande(item)} />}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={Colors.brand.orange} />}
        />
      ) : (
        <EmptyState
          emoji="🧰"
          title="Vous n'avez pas encore de demande"
          subtitle="Publiez votre premier besoin (plomberie, ménage, électricité...) et recevez des offres de prestataires près de chez vous."
          ctaLabel="Créer ma première demande"
          onPressCta={creerDemande}
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.encre,
    marginBottom: Spacing.three,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
  },
  ctaText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
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
