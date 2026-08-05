import AudioBubble from "@/components/audioBubble";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { StyleSheet, Text, TextStyle, View } from "react-native";

interface OffreMessageProps {
  offre: { message?: string | null; messageAudioUrl?: string | null };
  textStyle?: TextStyle;
}

export default function OffreMessage({ offre, textStyle }: OffreMessageProps) {
  const texte = offre.message?.trim();

  if (!texte && !offre.messageAudioUrl) {
    return <Text style={[styles.text, textStyle]}>Sans message</Text>;
  }

  return (
    <View style={styles.container}>
      {texte && <Text style={[styles.text, textStyle]}>{texte}</Text>}
      {offre.messageAudioUrl && <AudioBubble uri={offre.messageAudioUrl} dureeSec={0} moi={false} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  text: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
  },
});
