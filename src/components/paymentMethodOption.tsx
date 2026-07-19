import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { TypePaiement } from "@/types/wallet";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const META: Record<TypePaiement, { label: string; emoji: string }> = {
  orange_money: { label: "Orange Money", emoji: "🟠" },
  mtn_money: { label: "MTN Mobile Money", emoji: "🟡" },
  wave: { label: "Wave", emoji: "🔵" },
  carte: { label: "Carte bancaire", emoji: "💳" },
};

interface PaymentMethodOptionProps {
  methode: TypePaiement;
  selected: boolean;
  onPress: () => void;
}

export default function PaymentMethodOption({ methode, selected, onPress }: PaymentMethodOptionProps) {
  const meta = META[methode];
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.emoji}>{meta.emoji}</Text>
      <Text style={styles.label}>{meta.label}</Text>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: Radii.md,
    borderWidth: 2,
    borderColor: Colors.light.backgroundSelected,
    backgroundColor: Colors.light.backgroundElement,
    marginBottom: Spacing.two,
  },
  selected: {
    borderColor: Colors.brand.orange,
    backgroundColor: Colors.brand.tintOr,
  },
  emoji: {
    fontSize: 22,
    marginRight: Spacing.two,
  },
  label: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.light.textSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: Colors.brand.orange,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.brand.orange,
  },
});
