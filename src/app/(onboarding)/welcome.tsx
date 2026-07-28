import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const logo = require("@/assets/images/logo/BabiService_logo.png");

const SLIDES = [
  {
    image: require("@/assets/images/onboarding/onboarding_image1.jpg"),
    emoji: "🔍",
    title: "Trouvez un artisan en quelques secondes",
    subtitle: "Des centaines de professionnels qualifiés près de chez vous, disponibles maintenant.",
  },
  {
    image: require("@/assets/images/onboarding/onboarding_image2.png"),
    emoji: "⚖️",
    title: "Comparez plusieurs offres",
    subtitle: "Recevez des propositions de différents artisans et choisissez la meilleure pour vous.",
  },
  {
    image: require("@/assets/images/onboarding/onboarding_image3.png"),
    emoji: "🔒",
    title: "Payez en toute sécurité",
    subtitle: "Votre paiement est sécurisé et libéré uniquement quand le travail est validé.",
  },
];

export default function Welcome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const dernier = index === SLIDES.length - 1;
  const slide = SLIDES[index];

  const continuer = () => {
    if (dernier) {
      router.push("/(auth)/role_selection");
      return;
    }
    setIndex((i) => i + 1);
  };

  const passer = () => router.push("/(auth)/role_selection");

  return (
    <View style={styles.container}>
      <Image source={slide.image} style={styles.image} resizeMode="cover" />

      <View style={[styles.logoOverlay, { top: insets.top + Spacing.two }]}>
        <Image source={logo} style={styles.logoIcon} resizeMode="contain" />
        <Text style={styles.logoText}>BabiServices</Text>
      </View>

      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={continuer}>
          <Text style={styles.continueButtonText}>{dernier ? "Commencer maintenant" : "Continuer"}</Text>
        </TouchableOpacity>

        <Pressable onPress={passer}>
          <Text style={styles.passer}>Passer</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
  },
  logoOverlay: {
    position: "absolute",
    left: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIcon: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  sheet: {
    marginTop: "44%",
    flex: 1,
    backgroundColor: Colors.brand.fond,
    borderTopLeftRadius: Radii.lg,
    borderTopRightRadius: Radii.lg,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    alignItems: "center",
  },
  emoji: {
    fontSize: 36,
    marginBottom: Spacing.two,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.encre,
    textAlign: "center",
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.two,
    lineHeight: 20,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: Spacing.five,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brand.tintOr,
  },
  dotActive: {
    width: 22,
    backgroundColor: Colors.brand.orange,
  },
  continueButton: {
    width: "100%",
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: Spacing.five,
    shadowColor: Colors.brand.orange,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  continueButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: "#FFFFFF",
  },
  passer: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
});
