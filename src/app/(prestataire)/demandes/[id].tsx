import AudioBubble from "@/components/audioBubble";
import ContinuerButton from "@/components/continuerButton";
import DemandeDescription from "@/components/demandeDescription";
import InputComponent from "@/components/input-component";
import { categorieIcon, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { VoiceRecording, useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { formatFcfa } from "@/utils/format";
import { getDemandeById } from "@api/demandes";
import { creerOffre } from "@api/offres";
import { isAxiosError } from "axios";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, MapPin, Mic, Square, Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
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

  const { isRecording, durationMillis, start, stop } = useVoiceRecorder();
  const [demarrageMicro, setDemarrageMicro] = useState(false);
  const [noteVocale, setNoteVocale] = useState<VoiceRecording | null>(null);

  useEffect(() => {
    return () => {
      if (isRecording) stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const demarrerEnregistrement = async () => {
    setDemarrageMicro(true);
    const ok = await start();
    setDemarrageMicro(false);
    if (!ok) {
      Alert.alert("Micro indisponible", "Autorisez l'accès au micro pour enregistrer un message vocal.");
    }
  };

  const arreterEnregistrement = async () => {
    const recording = await stop();
    if (recording) setNoteVocale(recording);
  };

  if (loading && !demande) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!demande) return null;

  const formValide =
    /^[0-9]{3,}$/.test(prix) &&
    /^[0-9]{1,4}$/.test(delai) &&
    (message.trim().length > 0 || noteVocale !== null);

  const envoyerOffre = async () => {
    if (!formValide || envoi) return;
    setEnvoi(true);
    setErreur(null);
    try {
      await creerOffre({
        demandeId: demande.id,
        prixProposeFcfa: parseInt(prix, 10),
        delaiMinutes: parseInt(delai, 10),
        message: message.trim() || undefined,
        audio: noteVocale ? { uri: noteVocale.uri } : undefined,
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
          {demande.picture_url && (
            <Image source={{ uri: demande.picture_url }} style={styles.photo} contentFit="cover" />
          )}
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
        <Text style={styles.sectionHint}>Par texte et/ou message vocal — au moins l&apos;un des deux.</Text>
        <InputComponent
          value={message}
          placeholder="Présentez-vous et expliquez comment vous comptez intervenir..."
          onChangeText={setMessage}
          type="textarea"
        />

        {noteVocale ? (
          <View style={styles.voiceNotePreview}>
            <AudioBubble uri={noteVocale.uri} dureeSec={noteVocale.dureeSec} moi={false} />
            <TouchableOpacity style={styles.voiceNoteDelete} onPress={() => setNoteVocale(null)}>
              <Trash2 size={16} color={Colors.light.textSecondary} />
            </TouchableOpacity>
          </View>
        ) : isRecording ? (
          <View style={styles.recordingRow}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>
              Enregistrement... {String(Math.floor(durationMillis / 1000 / 60)).padStart(2, "0")}:
              {String(Math.floor(durationMillis / 1000) % 60).padStart(2, "0")}
            </Text>
            <TouchableOpacity style={styles.recordingStop} onPress={arreterEnregistrement}>
              <Square size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.voiceNoteButton} onPress={demarrerEnregistrement} disabled={demarrageMicro}>
            <Mic size={16} color={Colors.brand.orange} />
            <Text style={styles.voiceNoteButtonText}>Ajouter un message vocal</Text>
          </TouchableOpacity>
        )}

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
  sectionHint: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: -4,
    marginBottom: Spacing.two,
  },
  voiceNoteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    backgroundColor: Colors.brand.tintOr,
    borderColor: Colors.brand.orange,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    marginTop: Spacing.two,
  },
  voiceNoteButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.orange,
  },
  voiceNotePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    marginTop: Spacing.two,
  },
  voiceNoteDelete: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DC2626",
  },
  recordingText: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  recordingStop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand.orange,
    alignItems: "center",
    justifyContent: "center",
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
