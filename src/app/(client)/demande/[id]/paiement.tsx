import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { formatFcfa } from "@/utils/format";
import { useRouter } from "expo-router";
import { ChevronLeft, Clock, ShieldCheck } from "lucide-react-native";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAIEMENT_DEMO = {
  montant: 25000,
  prestataireNom: "Jean-Baptiste Kouassi",
};

export default function Paiement() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.escrowBanner}>
          <ShieldCheck size={19} color={Colors.brand.vert} />
          <Text style={styles.escrowText}>
            Votre paiement est sécurisé et ne sera versé au prestataire qu&apos;après qu&apos;il ait validé la fin de
            la prestation avec le code de confirmation.
          </Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Montant à régler</Text>
          <Text style={styles.amount}>{formatFcfa(PAIEMENT_DEMO.montant)}</Text>
          <Text style={styles.amountFor}>Pour la prestation de {PAIEMENT_DEMO.prestataireNom}</Text>
        </View>

        <View style={styles.statutCard}>
          <View style={styles.statutIconWrap}>
            <Clock size={22} color={Colors.brand.orange} />
          </View>
          <Text style={styles.statutTitle}>Paiement en cours de traitement</Text>
          <Text style={styles.statutText}>
            Le paiement sera automatiquement transmis au prestataire dès qu&apos;il confirmera la fin de la
            prestation.
          </Text>
        </View>

        <Text style={styles.noteWallet}>Le paiement Mobile Money sera bientôt disponible.</Text>
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
  },
  escrowBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    backgroundColor: Colors.brand.tintVert,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  escrowText: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.brand.encre,
    lineHeight: 18,
  },
  amountCard: {
    alignItems: "center",
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    paddingVertical: Spacing.four,
    marginBottom: Spacing.three,
  },
  amountLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  amount: {
    fontFamily: Fonts.title,
    fontSize: 30,
    color: Colors.brand.orange,
    marginVertical: 2,
  },
  amountFor: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statutCard: {
    alignItems: "center",
    backgroundColor: Colors.brand.tintOr,
    borderRadius: Radii.md,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
  },
  statutIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  statutTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
    marginBottom: 4,
  },
  statutText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.brand.encre,
    textAlign: "center",
    lineHeight: 18,
  },
  noteWallet: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
