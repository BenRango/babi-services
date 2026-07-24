import AudioBubble from "@/components/audioBubble";
import ContinuerButton from "@/components/continuerButton";
import InputComponent from "@/components/input-component";
import ServiceButton from "@/components/serviceButton";
import { CATEGORIES, categorieLabel } from "@/constants/categories";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { VoiceRecording, useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { CategorieService, Demande, DemandeMode, TypeDescription } from "@/types/demande";
import { apercuDescription, formatFcfa } from "@/utils/format";
import { createDemande } from "@api/demandes";
import { isAxiosError } from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Camera,
  Check,
  ChevronLeft,
  Mic,
  MoreHorizontal,
  Megaphone,
  Search,
  Square,
  Trash2,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUGGESTIONS_BUDGET = [5000, 10000, 20000, 50000];

interface PhotoChoisie {
  uri: string;
  mimeType?: string | null;
  fileName?: string | null;
}

export default function NouvelleDemande() {
  const router = useRouter();
  const { categorie: categorieInitiale } = useLocalSearchParams<{ categorie?: CategorieService }>();
  const [categorie, setCategorie] = useState<CategorieService>(categorieInitiale ?? "plomberie");
  const [description, setDescription] = useState("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [commune, setCommune] = useState("");
  const [mode, setMode] = useState<DemandeMode>(DemandeMode.POST_PUBLIC);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [demandeCreee, setDemandeCreee] = useState<Demande | null>(null);

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
      Alert.alert("Micro indisponible", "Autorisez l'accès au micro pour enregistrer une note vocale.");
    }
  };

  const arreterEnregistrement = async () => {
    const recording = await stop();
    if (recording) setNoteVocale(recording);
  };

  const [photo, setPhoto] = useState<PhotoChoisie | null>(null);

  const prendrePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Appareil photo indisponible", "Autorisez l'accès à l'appareil photo pour prendre une photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setPhoto({ uri: asset.uri, mimeType: asset.mimeType, fileName: asset.fileName });
    }
  };

  const choisirPhoto = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert("Galerie indisponible", "Autorisez l'accès à vos photos pour en ajouter à votre demande.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.6 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setPhoto({ uri: asset.uri, mimeType: asset.mimeType, fileName: asset.fileName });
    }
  };

  const demanderPhoto = () => {
    Alert.alert("Ajouter une photo", undefined, [
      { text: "Prendre une photo", onPress: prendrePhoto },
      { text: "Choisir depuis la galerie", onPress: choisirPhoto },
      { text: "Annuler", style: "cancel" },
    ]);
  };

  const budgetValide = /^[0-9]{3,}$/.test(budgetMax);
  const descriptionValide = description.trim().length > 0 || noteVocale !== null;
  const formValide = budgetValide && descriptionValide;

  const soumettre = async () => {
    if (!formValide || envoi) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const demande = await createDemande({
        categorie,
        budgetMaxFcfa: parseInt(budgetMax, 10),
        commune: commune.trim() || undefined,
        mode,
        typeDescription: noteVocale ? TypeDescription.AUDIO : TypeDescription.TEXT,
        description: description.trim() || undefined,
        audio: noteVocale ? { uri: noteVocale.uri } : undefined,
        photo: photo ?? undefined,
      });
      setDemandeCreee(demande);
    } catch (e) {
      const message = isAxiosError(e) ? e.response?.data?.message : undefined;
      setErreur(typeof message === "string" ? message : "Impossible de publier votre demande pour l'instant.");
    } finally {
      setEnvoi(false);
    }
  };

  if (demandeCreee) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.receiptScroll}>
          <View style={styles.receiptIcon}>
            <Check size={32} color={Colors.brand.vert} />
          </View>
          <Text style={styles.receiptTitle}>Demande publiée !</Text>
          <Text style={styles.receiptSubtitle}>
            Les prestataires disponibles vont pouvoir vous envoyer leurs offres.
          </Text>

          <View style={styles.receiptCard}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Service</Text>
              <Text style={styles.receiptValue}>{categorieLabel(demandeCreee.categorie)}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Budget max</Text>
              <Text style={styles.receiptValue}>{formatFcfa(demandeCreee.budgetMaxFcfa)}</Text>
            </View>
            {demandeCreee.commune && (
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Commune</Text>
                <Text style={styles.receiptValue}>{demandeCreee.commune}</Text>
              </View>
            )}
            <Text style={styles.receiptLabel}>Description</Text>
            <Text style={styles.receiptDescription}>{apercuDescription(demandeCreee)}</Text>
          </View>

          <ContinuerButton
            filled
            text="Voir mon annonce"
            onPress={() => router.replace(`/(client)/demande/${demandeCreee.id}/offres`)}
            style={styles.submit}
          />
          <ContinuerButton
            text="Retour à mes demandes"
            onPress={() => router.replace("/(client)/demande")}
            style={styles.submit}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

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
          <ServiceButton
            title="Autres"
            icon={
              <MoreHorizontal
                size={28}
                color={categorie === "autres" ? Colors.brand.orange : Colors.light.textSecondary}
              />
            }
            selected={categorie === "autres"}
            onPress={() => setCategorie("autres")}
          />
        </View>

        <Text style={styles.sectionTitle}>Décrivez le problème*</Text>
        <Text style={styles.sectionHint}>Par texte et/ou note vocale — au moins l&apos;un des deux.</Text>
        <InputComponent
          value={description}
          placeholder="Ex : Mon lavabo est bouché depuis hier, l'eau ne coule plus..."
          onChangeText={setDescription}
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
          <TouchableOpacity
            style={styles.voiceNoteButton}
            onPress={demarrerEnregistrement}
            disabled={demarrageMicro}
          >
            <Mic size={16} color={Colors.brand.orange} />
            <Text style={styles.voiceNoteButtonText}>Ajouter une note vocale</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Photo du problème</Text>
        <Text style={styles.sectionHint}>Facultatif — aide le prestataire à comprendre en un coup d&apos;œil.</Text>
        <View style={styles.photosGrid}>
          {photo && (
            <View style={styles.photoThumbWrap}>
              <Image source={{ uri: photo.uri }} style={styles.photoThumb} contentFit="cover" />
              <TouchableOpacity style={styles.photoRemove} onPress={() => setPhoto(null)}>
                <X size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}
          {!photo && (
            <TouchableOpacity style={styles.photoAddTile} onPress={demanderPhoto}>
              <Camera size={22} color={Colors.brand.orange} />
              <Text style={styles.photoAddText}>Ajouter</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Commune</Text>
        <InputComponent value={commune} placeholder="Ex : Cocody" onChangeText={setCommune} />

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
          style={[styles.modeCard, mode === DemandeMode.RECHERCHE && styles.modeCardSelected]}
          onPress={() => setMode(DemandeMode.RECHERCHE)}
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
          style={[styles.modeCard, mode === DemandeMode.POST_PUBLIC && styles.modeCardSelected]}
          onPress={() => setMode(DemandeMode.POST_PUBLIC)}
        >
          <View style={styles.modeIcon}>
            <Megaphone size={20} color={Colors.brand.orange} />
          </View>
          <View style={styles.modeText}>
            <Text style={styles.modeTitle}>Annonce publique</Text>
            <Text style={styles.modeSubtitle}>Les prestataires disponibles vous envoient une offre.</Text>
          </View>
        </TouchableOpacity>

        {erreur && <Text style={styles.erreur}>{erreur}</Text>}

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
  sectionHint: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: -6,
    marginBottom: Spacing.two,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  photoThumbWrap: {
    width: 84,
    height: 84,
  },
  photoThumb: {
    width: 84,
    height: 84,
    borderRadius: Radii.sm,
    backgroundColor: Colors.light.backgroundElement,
  },
  photoRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.brand.encre,
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddTile: {
    width: 84,
    height: 84,
    borderRadius: Radii.sm,
    borderWidth: 2,
    borderColor: Colors.brand.orange,
    borderStyle: "dashed",
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  photoAddText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    color: Colors.brand.orange,
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
  erreur: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#DC2626",
    marginTop: Spacing.three,
  },
  submit: {
    width: "100%",
    marginTop: Spacing.four,
  },
  receiptScroll: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.six,
    paddingBottom: Spacing.six,
    alignItems: "center",
  },
  receiptIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brand.tintVert,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  receiptTitle: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  receiptSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: Spacing.four,
  },
  receiptCard: {
    width: "100%",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  receiptLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  receiptValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.encre,
  },
  receiptDescription: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    marginTop: 4,
    lineHeight: 19,
  },
});
