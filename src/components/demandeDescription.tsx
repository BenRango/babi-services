import AudioBubble from "@/components/audioBubble";
import { Colors, Fonts } from "@/constants/theme";
import { TypeDescription } from "@/types/demande";
import { StyleSheet, Text, TextStyle } from "react-native";

interface DemandeDescriptionProps {
  demande: { typeDescription: TypeDescription; description?: string };
  textStyle?: TextStyle;
}

export default function DemandeDescription({ demande, textStyle }: DemandeDescriptionProps) {
  if (demande.typeDescription === TypeDescription.AUDIO && demande.description) {
    return <AudioBubble uri={demande.description} dureeSec={0} moi={false} />;
  }
  return <Text style={[styles.text, textStyle]}>{demande.description?.trim() || "Sans description"}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.brand.encre,
    lineHeight: 18,
  },
});
