import ContinuerButton from "@/components/continuerButton";
import InputComponent from "@/components/input-component";
import ServiceButton from "@/components/serviceButton";
import { CATEGORIES } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { createDemande } from "@/services/demandeService";
import { CategorieService, ModeRecherche } from "@/types/demande";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Megaphone, Search } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUGGESTIONS_BUDGET = [5000, 10000, 20000, 50000];

export default function NouvelleDemande() {
  const router = useRouter();
  const { categorie: categorieInitiale } = useLocalSearchParams<{ categorie?: CategorieService }>();
  const [categorie, setCategorie] = useState<CategorieService>(categorieInitiale ?? "plomberie");
  const [description, setDescription] = useState("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [modeRecherche, setModeRecherche] = useState<ModeRecherche>("annonce_publique");
  const [envoi, setEnvoi] = useState(false);

  const budgetValide = /^[0-9]{3,}$/.test(budgetMax);
  const formValide = description.trim().length > 0 && budgetValide;

  const soumettre = async () => {
    if (!formValide || envoi) return;
    setEnvoi(true);
    try {
      const demande = await createDemande({
        categorie,
        description: description.trim(),
        budgetMax: parseInt(budgetMax, 10),
        modeRecherche,
      });
      router.replace(`/(client)/demande/${demande.id}/offres`);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle demande</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionTitle}>Quel service ?*</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <ServiceButton
              key={cat.id}
              title={cat.label}
              logoSource={cat.icon}
              selected={categorie === cat.id}
              onPress={() => setCategorie(cat.id)}
            />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Décrivez le problème*</Text>
        <InputComponent
          value={description}
          placeholder="Ex : Mon lavabo est bouché depuis hier, l'eau ne coule plus..."
          onChangeText={setDescription}
          type="textarea"
        />

        <Text style={styles.sectionTitle}>Budget maximum*</Text>
        <View style={styles.budgetRow}>
          <TextInput
            placeholder="20 000"
            keyboardType="numeric"
            style={styles.budgetInput}
            onChangeText={setBudgetMax}
            value={budgetMax}
          />
          <Text style={styles.currency}>FCFA</Text>
        </View>
        <View style={styles.suggestionsRow}>
          {SUGGESTIONS_BUDGET.map((suggestion) => (
            <TouchableOpacity
              key={suggestion}
              style={styles.suggestion}
              onPress={() => setBudgetMax(suggestion.toString())}
            >
              <Text style={styles.suggestionText}>{suggestion.toLocaleString("fr-FR")}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Comment trouver votre prestataire ?*</Text>
        <TouchableOpacity
          style={[styles.modeCard, modeRecherche === "libre" && styles.modeCardSelected]}
          onPress={() => setModeRecherche("libre")}
        >
          <View style={styles.modeIcon}>
            <Search size={20} color={Colors.brand.orange} />
          </View>
          <View style={styles.modeText}>
            <Text style={styles.modeTitle}>Recherche libre</Text>
            <Text style={styles.modeSubtitle}>Vous choisissez vous-même un prestataire disponible.</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeCard, modeRecherche === "annonce_publique" && styles.modeCardSelected]}
          onPress={() => setModeRecherche("annonce_publique")}
        >
          <View style={styles.modeIcon}>
            <Megaphone size={20} color={Colors.brand.orange} />
          </View>
          <View style={styles.modeText}>
            <Text style={styles.modeTitle}>Annonce publique</Text>
            <Text style={styles.modeSubtitle}>Les prestataires disponibles vous envoient une offre.</Text>
          </View>
        </TouchableOpacity>

        <ContinuerButton
          filled
          text={envoi ? "Publication..." : "Publier ma demande"}
          onPress={soumettre}
          disabled={!formValide || envoi}
          style={styles.submit}
        />
      </ScrollView>
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
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  budgetInput: {
    flex: 1,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.brand.encre,
  },
  currency: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  suggestion: {
    backgroundColor: Colors.brand.tintOr,
    borderColor: Colors.brand.orange,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: Spacing.three,
    borderRadius: 999,
  },
  suggestionText: {
    color: Colors.brand.orange,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 2,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  modeCardSelected: {
    borderColor: Colors.brand.orange,
    backgroundColor: Colors.brand.tintOr,
  },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  modeText: {
    flex: 1,
  },
  modeTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  modeSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  submit: {
    width: "100%",
    marginTop: Spacing.four,
  },
});
