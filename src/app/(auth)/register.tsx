import { CATEGORIES } from "@/constants/categories";
import { COMMUNES_ABIDJAN } from "@/constants/communes";
import { UserRole } from "@/types/user";
import { register } from "@api/auth";
import { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("@/assets/images/logo/BabiService_logo.png");

const ROLES = [
  { id: UserRole.CLIENT, label: "Client" },
  { id: UserRole.PRESTATAIRE, label: "Prestataire" },
];

const MAX_COMMUNES = 3;
const MAX_CATEGORIES = 3;

export default function Register() {
  const { role: roleInitial } = useLocalSearchParams<{ role?: UserRole }>();
  const router = useRouter();

  const [nom, setNom] = useState("");
  const [phone, setPhone] = useState("");
  const [motDePass, setMotDePass] = useState("");
  const [role, setRole] = useState<UserRole>(roleInitial ?? UserRole.CLIENT);
  const [communeClient, setCommuneClient] = useState<string | null>(null);
  const [communesPresta, setCommunesPresta] = useState<string[]>([]);
  const [categoriesPresta, setCategoriesPresta] = useState<string[]>([]);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const toggleCommunePresta = (id: string) => {
    setCommunesPresta((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_COMMUNES) return prev;
      return [...prev, id];
    });
  };

  const toggleCategoriePresta = (id: string) => {
    setCategoriesPresta((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= MAX_CATEGORIES) return prev;
      return [...prev, id];
    });
  };

  const formValide =
    nom.trim().length > 0 &&
    phone.trim().length > 0 &&
    motDePass.length > 0 &&
    (role !== UserRole.PRESTATAIRE || categoriesPresta.length > 0);

  const creerCompte = async () => {
    if (!formValide || enCours) return;
    setEnCours(true);
    setErreur(null);
    try {
      const { user } = await register({
        nom: nom.trim(),
        telephone: `+225${phone.trim().replace(/\s+/g, "")}`,
        motDePass,
        role,
        ...(role === UserRole.CLIENT && communeClient ? { commune: communeClient } : {}),
        ...(role === UserRole.PRESTATAIRE
          ? {
              categories: categoriesPresta,
              ...(communesPresta.length > 0 ? { communes: communesPresta } : {}),
            }
          : {}),
      });
      router.replace(user.role === UserRole.PRESTATAIRE ? "/(prestataire)/accueil" : "/(client)/accueil");
    } catch (e) {
      const message = isAxiosError(e) ? e.response?.data?.message : undefined;
      setErreur(typeof message === "string" ? message : "Inscription impossible. Réessayez.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={22} color="#1A1A1A" />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Renseignez vos informations pour commencer.</Text>

        <View style={styles.roleRow}>
          {ROLES.map((r) => {
            const isSelected = role === r.id;
            return (
              <Pressable
                key={r.id}
                style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                onPress={() => setRole(r.id)}
              >
                <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>{r.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          placeholderTextColor="#A0A0A0"
          value={nom}
          onChangeText={setNom}
        />

        <View style={styles.inputRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>CI +225</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="07 00 00 00 00"
            placeholderTextColor="#A0A0A0"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#A0A0A0"
          secureTextEntry
          value={motDePass}
          onChangeText={setMotDePass}
        />

        {role === UserRole.CLIENT && (
          <>
            <Text style={styles.sectionLabel}>Votre commune (optionnel)</Text>
            <View style={styles.chipsWrap}>
              {COMMUNES_ABIDJAN.map((commune) => {
                const selected = communeClient === commune.id;
                return (
                  <Pressable
                    key={commune.id}
                    style={[styles.chip, selected && styles.chipSelected]}
                    onPress={() => setCommuneClient(selected ? null : commune.id)}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{commune.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {role === UserRole.PRESTATAIRE && (
          <>
            <Text style={styles.sectionLabel}>
              Vos catégories de service* ({categoriesPresta.length}/{MAX_CATEGORIES})
            </Text>
            <Text style={styles.sectionHint}>Au moins une, jusqu&apos;à {MAX_CATEGORIES}.</Text>
            <View style={styles.chipsWrap}>
              {CATEGORIES.map((cat) => {
                const selected = categoriesPresta.includes(cat.id);
                const desactive = !selected && categoriesPresta.length >= MAX_CATEGORIES;
                return (
                  <Pressable
                    key={cat.id}
                    style={[styles.chip, selected && styles.chipSelected, desactive && styles.chipDisabled]}
                    onPress={() => toggleCategoriePresta(cat.id)}
                    disabled={desactive}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{cat.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionLabel}>
              Vos communes d&apos;intervention (optionnel, {communesPresta.length}/{MAX_COMMUNES})
            </Text>
            <View style={styles.chipsWrap}>
              {COMMUNES_ABIDJAN.map((commune) => {
                const selected = communesPresta.includes(commune.id);
                const desactive = !selected && communesPresta.length >= MAX_COMMUNES;
                return (
                  <Pressable
                    key={commune.id}
                    style={[styles.chip, selected && styles.chipSelected, desactive && styles.chipDisabled]}
                    onPress={() => toggleCommunePresta(commune.id)}
                    disabled={desactive}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{commune.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {erreur && <Text style={styles.erreur}>{erreur}</Text>}

        <Text style={styles.terms}>
          En continuant, vous acceptez nos Conditions d'utilisation et notre
          Politique de confidentialité.
        </Text>

        <Pressable
          style={[styles.submitButton, (!formValide || enCours) && styles.submitButtonDisabled]}
          onPress={creerCompte}
          disabled={!formValide || enCours}
        >
          {enCours ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Créer mon compte</Text>
          )}
        </Pressable>

        <Pressable style={styles.loginLinkWrap} onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>
            Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF7",
    paddingHorizontal: 24,
  },
  scroll: {
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0EE",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  logo: {
    width: 56,
    height: 56,
    marginTop: 24,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 28,
    color: "#1A1A1A",
    marginTop: 16,
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#8A8A8A",
    marginTop: 6,
  },
  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  roleChip: {
    flex: 1,
    backgroundColor: "#F0F0EE",
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleChipSelected: {
    backgroundColor: "#FBE7D9",
    borderColor: "#F97316",
  },
  roleChipText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 14,
    color: "#8A8A8A",
  },
  roleChipTextSelected: {
    color: "#C2540A",
  },
  sectionLabel: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 4,
  },
  sectionHint: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#A0A0A0",
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F0F0EE",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#FBE7D9",
    borderColor: "#F97316",
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#1A1A1A",
  },
  chipTextSelected: {
    color: "#C2540A",
  },
  input: {
    backgroundColor: "#F0F0EE",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 12,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#1A1A1A",
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  countryCode: {
    backgroundColor: "#F0F0EE",
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  countryCodeText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  phoneInput: {
    flex: 1,
    backgroundColor: "#F0F0EE",
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#1A1A1A",
  },
  erreur: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#DC2626",
    marginTop: 10,
  },
  terms: {
    fontFamily: "DMSans_400Regular",
    fontSize: 12,
    color: "#A0A0A0",
    marginTop: 14,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: "#F97316",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#F97316",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  loginLinkWrap: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#A0A0A0",
  },
  loginLink: {
    fontFamily: "DMSans_700Bold",
    color: "#F97316",
  },
});
