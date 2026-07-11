import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../../assets/images/logo/BabiService_logo.png";

type Role = "client" | "prestataire";

const ROLES: {
  id: Role;
  emoji: string;
  title: string;
  description: string;
  tags: string[];
}[] = [
  {
    id: "client",
    emoji: "🙋",
    title: "J'ai besoin d'un service",
    description: "Je cherche un prestataire de confiance.",
    tags: ["Créer des demandes", "Comparer les offres", "Payer en sécurité"],
  },
  {
    id: "prestataire",
    emoji: "🔨",
    title: "Je propose mes services",
    description: "Je suis artisan ou prestataire.",
    tags: [
      "Recevoir des demandes",
      "Envoyer des offres",
      "Être payé sur mon wallet",
    ],
  },
];

export default function RoleSelection() {
  const [selected, setSelected] = useState<Role>("client");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>Bienvenue sur BaBi !</Text>
        <Text style={styles.subtitle}>
          Comment souhaitez-vous utiliser BaBi ? Vous pourrez changer plus tard.
        </Text>

        <View style={styles.cards}>
          {ROLES.map((role) => {
            const isSelected = selected === role.id;
            return (
              <Pressable
                key={role.id}
                style={[styles.card, isSelected && styles.cardSelected]}
                onPress={() => setSelected(role.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <Text style={styles.iconEmoji}>{role.emoji}</Text>
                  </View>
                  <View style={styles.cardHeaderText}>
                    <Text style={styles.cardTitle}>{role.title}</Text>
                    <Text style={styles.cardDescription}>
                      {role.description}
                    </Text>
                  </View>
                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  >
                    {isSelected && <Text style={styles.radioCheck}>✓</Text>}
                  </View>
                </View>

                <View style={styles.tagsRow}>
                  {role.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.continueButton}
          onPress={() => {
            router.push("/login");
          }}
        >
          <Text style={styles.continueButtonText}>
            {selected === "client"
              ? "Continuer comme client"
              : "Continuer comme prestataire"}
          </Text>
        </Pressable>

        <Text style={styles.loginText}>
          Déjà un compte ? <Text style={styles.loginLink}>Se connecter</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
  },
  scrollContent: {
    paddingHorizontal: 24,
    alignItems: "center",
    paddingBottom: 24,
  },
  logo: {
    width: 56,
    height: 56,
    marginTop: 24,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: "#1A1A1A",
    marginTop: 16,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#8A8A8A",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  cards: {
    width: "100%",
    marginTop: 24,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#F0EDE6",
    padding: 16,
  },
  cardSelected: {
    borderColor: "#F97316",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FBE7D9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconEmoji: {
    fontSize: 22,
  },
  cardHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#1A1A1A",
  },
  cardDescription: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E0D8",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    backgroundColor: "#F97316",
    borderColor: "#F97316",
  },
  radioCheck: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "DMSans_700Bold",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tag: {
    backgroundColor: "#FBE7D9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 12,
    color: "#C2540A",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
  },
  continueButton: {
    backgroundColor: "#F97316",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#F97316",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  loginText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#A0A0A0",
    textAlign: "center",
    marginTop: 16,
  },
  loginLink: {
    fontFamily: "DMSans_700Bold",
    color: "#F97316",
  },
});
