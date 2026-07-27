import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getMe, updateProfile, UpdateProfilePayload } from "@api/users";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MesInformationsPrestataire() {
  const router = useRouter();
  const { loading, data: user } = useAsync(getMe);

  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasseActuel, setMotDePasseActuel] = useState("");
  const [initialise, setInitialise] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    if (user && !initialise) {
      setNom(user.nom);
      setTelephone(user.telephone);
      setInitialise(true);
    }
  }, [user, initialise]);

  const telephoneModifie = user ? telephone.trim() !== user.telephone : false;
  const formValide = nom.trim().length > 0 && telephone.trim().length > 0 && (!telephoneModifie || motDePasseActuel.length > 0);

  const enregistrer = async () => {
    if (!user || !formValide || enregistrement) return;
    setEnregistrement(true);
    setErreur(null);
    setSucces(false);
    try {
      const payload: UpdateProfilePayload = {};
      if (nom.trim() !== user.nom) payload.nom = nom.trim();
      if (telephoneModifie) {
        payload.telephone = telephone.trim();
        payload.motDePasseActuel = motDePasseActuel;
      }
      if (Object.keys(payload).length === 0) {
        router.back();
        return;
      }
      await updateProfile(payload);
      setSucces(true);
      setMotDePasseActuel("");
      setTimeout(() => router.back(), 800);
    } catch (e) {
      if (isAxiosError(e) && e.response?.status === 401) {
        setErreur("Mot de passe actuel incorrect.");
      } else if (isAxiosError(e) && e.response?.status === 400) {
        const message = e.response?.data?.message;
        setErreur(typeof message === "string" ? message : "Mot de passe actuel requis pour changer de numéro.");
      } else {
        setErreur("Impossible d'enregistrer ces modifications pour l'instant.");
      }
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes informations</Text>
      </View>

      {loading && !user ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="Nom complet" />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            value={telephone}
            onChangeText={setTelephone}
            placeholder="+225 07 00 00 00 00"
            keyboardType="phone-pad"
          />

          {telephoneModifie && (
            <>
              <Text style={styles.label}>Mot de passe actuel</Text>
              <Text style={styles.hint}>Requis pour confirmer le changement de numéro.</Text>
              <TextInput
                style={styles.input}
                value={motDePasseActuel}
                onChangeText={setMotDePasseActuel}
                placeholder="Mot de passe actuel"
                secureTextEntry
              />
            </>
          )}

          {erreur && <Text style={styles.erreur}>{erreur}</Text>}
          {succes && <Text style={styles.succes}>Modifications enregistrées.</Text>}

          <TouchableOpacity
            style={[styles.submitButton, (!formValide || enregistrement) && styles.submitButtonDisabled]}
            onPress={enregistrer}
            disabled={!formValide || enregistrement}
          >
            {enregistrement ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    paddingHorizontal: Spacing.four,
  },
  label: {
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    color: Colors.brand.encre,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  hint: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: -4,
    marginBottom: Spacing.two,
  },
  input: {
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.three,
    height: 50,
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  erreur: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: "#DC2626",
    marginTop: Spacing.three,
  },
  succes: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.vert,
    marginTop: Spacing.three,
  },
  submitButton: {
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.four,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
