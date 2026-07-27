import { categorieIcon, categorieLabel, CATEGORIES } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { usePolling } from "@/hooks/usePolling";
import { apercuDescription, formatDateRelative, formatFcfa } from "@/utils/format";
import { getDemandesOuvertes } from "@api/demandes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POLLING_MS = 18000;

export default function DemandesOuvertes() {
  const router = useRouter();
  const [filtreCategorie, setFiltreCategorie] = useState("toutes");
  const [filtreCommune, setFiltreCommune] = useState("toutes");
  const { loading, data: demandes, reload } = useAsync(getDemandesOuvertes);

  usePolling(reload, POLLING_MS);

  const toutesLesDemandes = demandes ?? [];

  const communesDisponibles = Array.from(
    new Set(toutesLesDemandes.map((d) => d.commune).filter((c): c is string => !!c))
  );

  const demandesFiltrees = toutesLesDemandes.filter(
    (d) =>
      (filtreCategorie === "toutes" || d.categorie === filtreCategorie) &&
      (filtreCommune === "toutes" || d.commune === filtreCommune)
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Demandes ouvertes</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtresScroll} contentContainerStyle={styles.filtresRow}>
        <FiltreChip label="Toutes" actif={filtreCategorie === "toutes"} onPress={() => setFiltreCategorie("toutes")} />
        {CATEGORIES.map((cat) => (
          <FiltreChip
            key={cat.id}
            label={cat.label}
            actif={filtreCategorie === cat.id}
            onPress={() => setFiltreCategorie(cat.id)}
          />
        ))}
      </ScrollView>

      {communesDisponibles.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtresScroll} contentContainerStyle={styles.filtresRow}>
          <FiltreChip label="Toutes communes" actif={filtreCommune === "toutes"} onPress={() => setFiltreCommune("toutes")} />
          {communesDisponibles.map((commune) => (
            <FiltreChip
              key={commune}
              label={commune}
              actif={filtreCommune === commune}
              onPress={() => setFiltreCommune(commune)}
            />
          ))}
        </ScrollView>
      )}

      {loading && !demandes ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {demandesFiltrees.map((demande) => (
            <TouchableOpacity
              key={demande.id}
              style={styles.card}
              onPress={() => router.push(`/(prestataire)/demandes/${demande.id}`)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.iconWrap}>
                  <Image source={categorieIcon(demande.categorie)} contentFit="contain" style={styles.icon} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.categorie}>{categorieLabel(demande.categorie)}</Text>
                  <Text style={styles.date}>{formatDateRelative(demande.createdAt)}</Text>
                </View>
                <Text style={styles.budget}>{formatFcfa(demande.budgetMaxFcfa)}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {apercuDescription(demande)}
              </Text>
              {demande.commune && (
                <View style={styles.communeRow}>
                  <MapPin size={12} color={Colors.brand.orange} />
                  <Text style={styles.commune}>{demande.commune}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
          {demandesFiltrees.length === 0 && (
            <Text style={styles.empty}>Aucune demande ne correspond à ces filtres.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function FiltreChip({ label, actif, onPress }: { label: string; actif: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.filtreChip, actif && styles.filtreChipActif]} onPress={onPress}>
      <Text style={[styles.filtreText, actif && styles.filtreTextActif]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    paddingBottom: Spacing.two,
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
    paddingTop: Spacing.two,
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.two,
  },
  icon: {
    width: 22,
    height: 22,
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
  budget: {
    fontFamily: Fonts.title,
    fontSize: 15,
    color: Colors.brand.orange,
  },
  description: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
    marginBottom: Spacing.two,
  },
  communeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commune: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
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
