import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { validerCode } from "@api/prestations";
import { isAxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Delete } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOUCHES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "effacer"];

export default function SaisieCode() {
  const router = useRouter();
  const { prestationId, offreId } = useLocalSearchParams<{ prestationId: string; offreId: string }>();
  const [code, setCode] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [verification, setVerification] = useState(false);

  const appuyer = async (touche: string) => {
    if (touche === "" || verification) return;
    setErreur(null);
    if (touche === "effacer") {
      setCode((c) => c.slice(0, -1));
      return;
    }
    if (code.length >= 4) return;
    const nouveauCode = code + touche;
    setCode(nouveauCode);
    if (nouveauCode.length === 4) {
      setVerification(true);
      try {
        await validerCode(prestationId, nouveauCode);
        router.replace({ pathname: "/(prestataire)/offres/prestation", params: { offreId } });
      } catch (e) {
        const msg = isAxiosError(e) ? e.response?.data?.message : undefined;
        setErreur(typeof msg === "string" ? msg : "Code incorrect, réessayez.");
        setCode("");
      } finally {
        setVerification(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Le travail est terminé ?</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.instructions}>Demandez le code à 4 chiffres au client et saisissez-le ci-dessous.</Text>

        <View style={styles.digitsRow}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={[styles.digitBox, erreur && styles.digitBoxErreur]}>
              <Text style={styles.digitText}>{code[i] ?? ""}</Text>
            </View>
          ))}
        </View>
        {erreur && <Text style={styles.erreurText}>{erreur}</Text>}

        <View style={styles.keypad}>
          {TOUCHES.map((touche, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.key, touche === "" && styles.keyVide]}
              onPress={() => appuyer(touche)}
              disabled={touche === "" || verification}
            >
              {touche === "effacer" ? (
                <Delete size={22} color={Colors.brand.encre} />
              ) : (
                <Text style={styles.keyText}>{touche}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    fontSize: 17,
    color: Colors.brand.encre,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
  },
  instructions: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.brand.encre,
    textAlign: "center",
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
  },
  digitsRow: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  digitBox: {
    width: 56,
    height: 64,
    borderRadius: Radii.sm,
    backgroundColor: Colors.light.backgroundElement,
    borderWidth: 2,
    borderColor: Colors.light.backgroundSelected,
    alignItems: "center",
    justifyContent: "center",
  },
  digitBoxErreur: {
    borderColor: "#DC2626",
  },
  digitText: {
    fontFamily: Fonts.title,
    fontSize: 28,
    color: Colors.brand.encre,
  },
  erreurText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: "#DC2626",
    marginTop: Spacing.two,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: Spacing.six,
    width: 280,
  },
  key: {
    width: 80,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  keyVide: {
    opacity: 0,
  },
  keyText: {
    fontFamily: Fonts.title,
    fontSize: 24,
    color: Colors.brand.encre,
  },
});
