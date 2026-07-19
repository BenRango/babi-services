import PaymentMethodOption from "@/components/paymentMethodOption";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { initierPaiement } from "@/services/paiementService";
import { getPrestationByDemande } from "@/services/prestationService";
import { TypePaiement } from "@/types/wallet";
import { formatFcfa } from "@/utils/format";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, ShieldCheck } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const METHODES: TypePaiement[] = ["orange_money", "mtn_money", "wave", "carte"];

export default function Paiement() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { loading, data: prestation } = useAsync(() => getPrestationByDemande(id), [id]);
  const [methode, setMethode] = useState<TypePaiement>("orange_money");
  const [envoi, setEnvoi] = useState(false);

  const payer = async () => {
    if (!prestation || envoi) return;
    setEnvoi(true);
    try {
      await initierPaiement({ prestationId: prestation.id, methode, montant: prestation.montant });
      router.replace(`/(client)/demande/${id}/suivi`);
    } finally {
      setEnvoi(false);
    }
  };

  if (loading && !prestation) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator color={Colors.brand.orange} />
      </SafeAreaView>
    );
  }

  if (!prestation) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement sécurisé</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.escrowBanner}>
          <ShieldCheck size={19} color={Colors.brand.vert} />
          <Text style={styles.escrowText}>
            Votre paiement est sécurisé et ne sera versé au prestataire qu&apos;après validation du code de
            confirmation.
          </Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Montant à régler</Text>
          <Text style={styles.amount}>{formatFcfa(prestation.montant)}</Text>
          <Text style={styles.amountFor}>Pour la prestation de {prestation.prestataire.nom}</Text>
        </View>

        <Text style={styles.sectionTitle}>Choisissez un moyen de paiement</Text>
        {METHODES.map((m) => (
          <PaymentMethodOption key={m} methode={m} selected={methode === m} onPress={() => setMethode(m)} />
        ))}
      </View>

      <TouchableOpacity style={styles.payButton} onPress={payer} disabled={envoi}>
        {envoi ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.payButtonText}>Payer {formatFcfa(prestation.montant)}</Text>
        )}
      </TouchableOpacity>
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
    marginBottom: Spacing.four,
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
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
    marginBottom: Spacing.two,
  },
  payButton: {
    marginHorizontal: Spacing.four,
    marginBottom: Spacing.four,
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  payButtonText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
