import { CATEGORIES, categorieLabel } from "@/constants/categories";
import { communeLabel } from "@/constants/communes";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getMesDemandes } from "@api/demandes";
import { getStoredUser } from "@api/client";
import { rechercherPrestataires } from "@api/prestataires";
import { DemandeStatut } from "@/types/demande";
import { apercuDescription, formatFcfa } from "@/utils/format";
import { couleurAvatar, initiales } from "@/utils/avatar";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, MapPin, Search, ShieldCheck } from "lucide-react-native";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Accueil() {
  const router = useRouter();
  const { data: user } = useAsync(getStoredUser);
  const { data: prestataires } = useAsync(
    () => rechercherPrestataires(user?.commune ? { commune: user.commune } : undefined),
    [user?.commune]
  );
  const { data: demandes } = useAsync(getMesDemandes);
  const prenom = user?.nom?.split(" ")[0];

  const demandeEnCours = demandes?.find(
    (d) => d.statut === DemandeStatut.EN_COURS || d.statut === DemandeStatut.FERMEE
  );

  const ouvrirDemandeEnCours = () => {
    if (!demandeEnCours) return;
    router.push(`/(client)/demande/${demandeEnCours.id}/suivi`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <View style={styles.locationRow}>
              <MapPin size={12} color={Colors.brand.orange} />
              <Text style={styles.location}>{user?.commune ? `${communeLabel(user.commune)}, Abidjan` : "Abidjan"}</Text>
            </View>
            <Text style={styles.greeting}>Bonjour{prenom ? ` ${prenom}` : ""} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => Alert.alert("Bientôt disponible", "Les notifications arrivent prochainement.")}
          >
            <Bell size={19} color={Colors.brand.encre} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={16} color={Colors.light.textSecondary} />
          <Text style={styles.searchPlaceholder}>Chercher un service ou artisan...</Text>
        </View>

        <TouchableOpacity style={styles.hero} onPress={() => router.push("/(client)/demande/nouvelle")}>
          <Text style={styles.heroKicker}>Rapide & Fiable</Text>
          <Text style={styles.heroTitle}>Un artisan chez vous{"\n"}en moins de 30 min</Text>
          <View style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Publier une demande →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services populaires</Text>
          <TouchableOpacity onPress={() => router.push("/(client)/accueil/services")}>
            <Text style={styles.sectionLink}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => router.push({ pathname: "/(client)/demande/nouvelle", params: { categorie: cat.id } })}
            >
              <View style={styles.categoryIconWrap}>
                <Image source={cat.icon} contentFit="contain" style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommandés près de vous</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.artisansRow}>
          {(prestataires ?? []).slice(0, 10).map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.artisanCard}
              onPress={() => router.push(`/(client)/accueil/artisan/${p.id}`)}
            >
              <View style={[styles.artisanAvatar, { backgroundColor: couleurAvatar(p.id) }]}>
                <Text style={styles.artisanAvatarText}>{initiales(p.nom)}</Text>
              </View>
              <Text style={styles.artisanNom} numberOfLines={1}>{p.nom}</Text>
              <Text style={styles.artisanMetier} numberOfLines={1}>
                {p.categories.map(categorieLabel).join(", ")}
              </Text>
            </TouchableOpacity>
          ))}
          {prestataires && prestataires.length === 0 && (
            <Text style={styles.artisansEmpty}>Aucun prestataire disponible pour l&apos;instant.</Text>
          )}
        </ScrollView>

        <View style={styles.securityBanner}>
          <View style={styles.securityIcon}>
            <ShieldCheck size={20} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Paiement 100% sécurisé</Text>
            <Text style={styles.securitySubtitle}>Votre argent est protégé jusqu&apos;à la validation.</Text>
          </View>
        </View>

        {demandeEnCours && (
          <TouchableOpacity style={styles.activeCard} onPress={ouvrirDemandeEnCours}>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeTitle}>Demande en cours</Text>
              <Text style={styles.activeDescription} numberOfLines={1}>{apercuDescription(demandeEnCours)}</Text>
              <Text style={styles.activeBudget}>Budget max : {formatFcfa(demandeEnCours.budgetMaxFcfa)}</Text>
            </View>
            <ChevronRight size={20} color={Colors.brand.orange} />
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    marginBottom: Spacing.three,
  },
  searchPlaceholder: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  hero: {
    borderRadius: Radii.lg,
    backgroundColor: Colors.brand.orange,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },
  heroKicker: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    color: "#FFE8D6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: Fonts.title,
    fontSize: 18,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: Spacing.three,
  },
  heroCta: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
  },
  heroCtaText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    color: Colors.brand.orange,
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
  categoriesRow: {
    gap: Spacing.three,
    paddingBottom: Spacing.two,
    marginBottom: Spacing.two,
  },
  categoryItem: {
    alignItems: "center",
    width: 64,
  },
  categoryIconWrap: {
    width: 56,
    height: 56,
    borderRadius: Radii.md,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  categoryIcon: {
    width: 26,
    height: 26,
  },
  categoryLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    color: Colors.brand.encre,
    textAlign: "center",
  },
  artisansRow: {
    gap: Spacing.two,
    paddingBottom: Spacing.three,
  },
  artisanCard: {
    width: 140,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.two,
  },
  artisanAvatar: {
    width: "100%",
    height: 72,
    borderRadius: Radii.sm,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  artisanAvatarText: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 20,
    color: "#FFFFFF",
  },
  artisanNom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 12,
    color: Colors.brand.encre,
  },
  artisanMetier: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  artisansEmpty: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  securityBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.brand.tintVert,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.vert,
    alignItems: "center",
    justifyContent: "center",
  },
  securityTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  securitySubtitle: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 1,
  },
  activeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
  },
  activeTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  activeDescription: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  activeBudget: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.orange,
    marginTop: 2,
  },
});
