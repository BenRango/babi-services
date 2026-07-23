import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { ChevronLeft, Mail, MessageCircle, Phone } from "lucide-react-native";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQ: { question: string; reponse: string }[] = [
  {
    question: "Comment publier une demande ?",
    reponse:
      "Dans l'onglet Demandes, appuyez sur le bouton \"+\", choisissez une catégorie et décrivez votre besoin (texte ou note vocale), avec votre budget maximum.",
  },
  {
    question: "Le budget maximum est-il fixe ?",
    reponse:
      "Non, c'est indicatif. Les prestataires vous envoient une offre avec leur propre prix ; vous choisissez celle qui vous convient.",
  },
  {
    question: "Comment accepter ou refuser une offre ?",
    reponse:
      "Ouvrez votre demande depuis \"Mes demandes\" : chaque offre reçue a ses propres boutons Accepter/Refuser. Accepter une offre refuse automatiquement les autres.",
  },
  {
    question: "À quoi sert le code de confirmation ?",
    reponse:
      "Une fois une offre acceptée, un code à 4 chiffres vous est communiqué. Donnez-le au prestataire uniquement à la fin de la prestation pour valider son paiement.",
  },
  {
    question: "Comment contacter un prestataire ?",
    reponse: "Depuis sa fiche (via \"Tous les services\") ou directement dans l'onglet Message une fois en contact.",
  },
  {
    question: "Que signifie mon statut de vérification (KYC) ?",
    reponse:
      "Il indique si votre identité a été validée par BabiServices : \"Non vérifié\", \"Vérification en cours\" ou \"Vérifié\".",
  },
];

export default function AideEtSupport() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.brand.encre} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide et support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        {FAQ.map((item) => (
          <View key={item.question} style={styles.faqCard}>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.reponse}>{item.reponse}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Nous contacter</Text>
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL("mailto:support@babiservices.com")}
        >
          <View style={styles.contactIconWrap}>
            <Mail size={16} color={Colors.brand.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>support@babiservices.com</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL("tel:+2250000000000")}>
          <View style={styles.contactIconWrap}>
            <Phone size={16} color={Colors.brand.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactLabel}>Téléphone</Text>
            <Text style={styles.contactValue}>+225 00 00 00 00 00</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => Linking.openURL("https://wa.me/2250000000000")}
        >
          <View style={styles.contactIconWrap}>
            <MessageCircle size={16} color={Colors.brand.orange} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactValue}>Discuter avec le support</Text>
          </View>
        </TouchableOpacity>
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
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 16,
    color: Colors.brand.encre,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  faqCard: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  question: {
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    color: Colors.brand.encre,
    marginBottom: 4,
  },
  reponse: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    padding: Spacing.three,
    marginBottom: Spacing.two,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
  contactValue: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.brand.encre,
    marginTop: 1,
  },
});
