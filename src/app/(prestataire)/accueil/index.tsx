import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { usePolling } from "@/hooks/usePolling";
import { apercuDescription } from "@/utils/format";
import { trierDemandesPourPrestataire } from "@/utils/prestataireSort";
import { getDemandesOuvertes } from "@api/demandes";
import { getStoredUser } from "@api/client";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, MapPin } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const POLLING_MS = 18000;

export default function AccueilPrestataire() {
  const router = useRouter();
  const { data: user } = useAsync(getStoredUser);
  const { data: demandes, reload } = useAsync(getDemandesOuvertes);
  // Pas encore de champ "disponible" côté backend — reste local pour l'instant.
  const [disponible, setDisponible] = useState(true);
  const prenom = user?.nom?.split(" ")[0];

  usePolling(reload, POLLING_MS);

  const toutesLesDemandes = demandes ?? [];
  const demandesProches = trierDemandesPourPrestataire(toutesLesDemandes, user).slice(0, 3);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.brand.orange} />
              <Text style={styles.location}>{user?.communes?.join(", ") || "Abidjan"}</Text>
            </View>
            <Text style={styles.greeting}>Bonjour{prenom ? ` ${prenom}` : ""} 👋</Text>
          </View>
          <View style={styles.bellButton}>
            <Bell size={19} color={Colors.brand.encre} />
          </View>
        </View>

        <View style={styles.dispoCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dispoTitle}>{disponible ? "Vous êtes disponible" : "Vous êtes indisponible"}</Text>
            <Text style={styles.dispoSubtitle}>
              {disponible
                ? "Les clients de vos communes peuvent vous voir."
                : "Activez pour recevoir de nouvelles demandes."}
            </Text>
          </View>
          <Switch
            value={disponible}
            onValueChange={setDisponible}
            trackColor={{ false: Colors.light.backgroundSelected, true: Colors.brand.orange }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{toutesLesDemandes.length}</Text>
          <Text style={styles.statLabel}>demandes ouvertes près de vous</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Demandes à proximité</Text>
          <TouchableOpacity onPress={() => router.push("/(prestataire)/demandes")}>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {demandesProches.map((demande) => (
          <TouchableOpacity
            key={demande.id}
            style={styles.demandeCard}
            onPress={() => router.push(`/(prestataire)/demandes/${demande.id}`)}
          >
            <View style={styles.demandeIconWrap}>
              <Image source={categorieIcon(demande.categorie)} contentFit="contain" style={styles.demandeIcon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.demandeCategorie}>{categorieLabel(demande.categorie)}</Text>
              <Text style={styles.demandeDescription} numberOfLines={1}>
                {apercuDescription(demande)}
              </Text>
              {demande.commune && <Text style={styles.demandeCommune}>{demande.commune}</Text>}
            </View>
            <ChevronRight size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  greeting: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
    marginTop: 2,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  dispoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.brand.encre,
    borderRadius: Radii.lg,
    padding: Spacing.four,
    marginBottom: Spacing.three,
  },
  dispoTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  dispoSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: "#D8D0C8",
    marginTop: 2,
  },
  statCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  statValue: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.orange,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
  },
  sectionLink: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.orange,
  },
  demandeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  demandeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  demandeIcon: {
    width: 24,
    height: 24,
  },
  demandeCategorie: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  demandeDescription: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  demandeCommune: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.brand.orange,
    marginTop: 2,
  },
});
