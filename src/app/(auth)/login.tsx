import logo from "@/assets/images/logo/BabiService_logo.png";
import { login } from "@api/auth";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [motDePass, setMotDePass] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const router = useRouter();

  const formValide = phone.trim().length > 0 && motDePass.length > 0;

  const seConnecter = async () => {
    if (!formValide || enCours) return;
    setEnCours(true);
    setErreur(null);
    try {
      await login({
        telephone: `+225${phone.trim().replace(/\s+/g, "")}`,
        motDePass,
      });
      router.replace("/(client)/accueil");
    } catch (e) {
      const message = isAxiosError(e) ? e.response?.data?.message : undefined;
      setErreur(typeof message === "string" ? message : "Connexion impossible. Vérifiez vos identifiants.");
    } finally {
      setEnCours(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={22} color="#1A1A1A" />
      </Pressable>

      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.subtitle}>Connectez-vous pour continuer.</Text>

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
        style={styles.passwordInput}
        placeholder="Mot de passe"
        placeholderTextColor="#A0A0A0"
        secureTextEntry
        value={motDePass}
        onChangeText={setMotDePass}
      />

      {erreur && <Text style={styles.erreur}>{erreur}</Text>}

      <Text style={styles.terms}>
        En continuant, vous acceptez nos Conditions d'utilisation et notre
        Politique de confidentialité.
      </Text>

      <Pressable
        style={[styles.smsButton, (!formValide || enCours) && styles.smsButtonDisabled]}
        onPress={seConnecter}
        disabled={!formValide || enCours}
      >
        {enCours ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.smsButtonText}>Se connecter</Text>
        )}
      </Pressable>

      <Pressable style={styles.registerLink} onPress={() => router.push("/register")}>
        <Text style={styles.registerLinkText}>
          Pas encore de compte ? <Text style={styles.registerLinkHighlight}>Créer un compte</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAF7",
    paddingHorizontal: 24,
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
    marginTop: 32,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 30,
    color: "#1A1A1A",
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 15,
    color: "#8A8A8A",
    marginTop: 6,
  },
  inputRow: {
    flexDirection: "row",
    marginTop: 28,
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
  passwordInput: {
    backgroundColor: "#F0F0EE",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 50,
    marginTop: 12,
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
  smsButton: {
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
  smsButtonDisabled: {
    opacity: 0.5,
  },
  smsButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerLinkText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A8A8A",
  },
  registerLinkHighlight: {
    fontFamily: "DMSans_700Bold",
    color: "#F97316",
  },
});
