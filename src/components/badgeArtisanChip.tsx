import { Fonts } from "@/constants/theme";
import { BadgeArtisan } from "@/types/user";
import { StyleSheet, Text, View } from "react-native";

interface BadgeArtisanChipProps {
  badge: BadgeArtisan;
}

const STYLES_PAR_BADGE: Record<BadgeArtisan, { label: string; color: string; background: string }> = {
  [BadgeArtisan.BRONZE]: { label: "Bronze", color: "#8A5A32", background: "#F1E1D3" },
  [BadgeArtisan.ARGENT]: { label: "Argent", color: "#5B6472", background: "#E4E7EB" },
  [BadgeArtisan.OR]: { label: "Or", color: "#8A6A00", background: "#FCEEB0" },
  [BadgeArtisan.DIAMANT]: { label: "Diamant", color: "#0E7490", background: "#CFFAFE" },
};

export default function BadgeArtisanChip({ badge }: BadgeArtisanChipProps) {
  const style = STYLES_PAR_BADGE[badge];
  if (!style) return null;
  return (
    <View style={[styles.chip, { backgroundColor: style.background }]}>
      <Text style={[styles.text, { color: style.color }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
  },
});
