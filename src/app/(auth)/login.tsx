import logo from "@/assets/images/logo/BabiService_logo.png";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import {
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
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ChevronLeft size={22} color="#1A1A1A" />
      </Pressable>

      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Bienvenue !</Text>
      <Text style={styles.subtitle}>Entrez votre numéro pour continuer.</Text>

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

      <Text style={styles.terms}>
        En continuant, vous acceptez nos Conditions d'utilisation et notre
        Politique de confidentialité.
      </Text>

      <Pressable
        style={styles.smsButton}
        onPress={() => router.push("/(client)/accueil")}
      >
        <Text style={styles.smsButtonText}>Recevoir le code SMS</Text>
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable style={styles.whatsappButton}>
        <Text style={styles.whatsappEmoji}>📱</Text>
        <Text style={styles.whatsappText}>Continuer avec WhatsApp</Text>
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
    marginTop: 24,
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
  smsButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E0",
  },
  dividerText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#A0A0A0",
    marginHorizontal: 12,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0EE",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
    gap: 10,
  },
  whatsappEmoji: {
    fontSize: 18,
  },
  whatsappText: {
    fontFamily: "DMSans_600SemiBold",
    fontSize: 15,
    color: "#1A1A1A",
  },
});
