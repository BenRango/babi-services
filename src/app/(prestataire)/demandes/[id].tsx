import ContinuerButton from "@/components/continuerButton";
import DemandeDescription from "@/components/demandeDescription";
import InputComponent from "@/components/input-component";
import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { formatFcfa } from "@/utils/format";
import { getDemandeById } from "@api/demandes";
import { creerOffre } from "@api/offres";
import { isAxiosError } from "axios";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FaireUneOffre() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loading, data: demande } = useAsync(() => getDemandeById(id), [id]);

  const [prix, setPrix] = useState("");
  const [delai, setDelai] = useState("");
  const [message, setMessage] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  if (loading && !demande) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!demande) return null;

  const formValide = /^[0-9]{3,}$/.test(prix) && /^[0-9]{1,4}$/.test(delai) && message.trim().length > 0;

  const envoyerOffre = async () => {
    if (!formValide || envoi) return;
    setEnvoi(true);
    setErreur(null);
    try {
      await creerOffre({
        demandeId: demande.id,
        prixProposeFcfa: parseInt(prix, 10),
        delaiMinutes: parseInt(delai, 10),
        message: message.trim(),
      });
      Alert.alert("Offre envoyée", "Le client va recevoir votre offre.", [
        { text: "OK", onPress: () => router.replace("/(prestataire)/offres") },
      ]);
    } catch (e) {
      const msg = isAxiosError(e) ? e.response?.data?.message : undefined;
      setErreur(typeof msg === "string" ? msg : "Impossible d'envoyer l'offre pour l'instant.");
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
        <Text style={styles.headerTitle}>Faire une offre</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.demandeCard}>
          <View style={styles.demandeTopRow}>
            <View style={styles.iconWrap}>
              <Image source={categorieIcon(demande.categorie)} contentFit="contain" style={styles.icon} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.categorie}>{categorieLabel(demande.categorie)}</Text>
              <Text style={styles.budget}>Budget max {formatFcfa(demande.budgetMaxFcfa)}</Text>
            </View>
          </View>
          <DemandeDescription demande={demande} textStyle={styles.description} />
          {demande.commune && (
            <View style={styles.communeRow}>
              <MapPin size={12} color={Colors.brand.orange} />
              <Text style={styles.commune}>{demande.commune}</Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Votre prix*</Text>
        <View style={styles.priceRow}>
          <TextInput
            placeholder="15 000"
            keyboardType="numeric"
            style={styles.priceInput}
            onChangeText={setPrix}
            value={prix}
          />
          <Text style={styles.currency}>FCFA</Text>
        </View>

        <Text style={styles.sectionTitle}>Délai d&apos;intervention (minutes)*</Text>
        <TextInput
          placeholder="Ex : 60"
          keyboardType="numeric"
          style={styles.delaiInput}
          onChangeText={setDelai}
          value={delai}
        />

        <Text style={styles.sectionTitle}>Message au client*</Text>
        <InputComponent
          value={message}
          placeholder="Présentez-vous et expliquez comment vous comptez intervenir..."
          onChangeText={setMessage}
          type="textarea"
        />

        {erreur && <Text style={styles.erreur}>{erreur}</Text>}

        <ContinuerButton
          filled
          text={envoi ? "Envoi..." : "Envoyer mon offre"}
          onPress={envoyerOffre}
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
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  erreur: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#DC2626",
    marginTop: Spacing.three,
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
  demandeCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  demandeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.two,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.two,
  },
  icon: {
    width: 24,
    height: 24,
  },
  categorie: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  budget: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    color: Colors.brand.orange,
    marginTop: 1,
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
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  priceInput: {
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
  delaiInput: {
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
  submit: {
    width: "100%",
    marginTop: Spacing.four,
  },
});
