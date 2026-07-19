import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onPressCta?: () => void;
}

export default function EmptyState({ emoji, title, subtitle, ctaLabel, onPressCta }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {ctaLabel && onPressCta && (
        <TouchableOpacity style={styles.cta} onPress={onPressCta}>
          <Text style={styles.ctaText}>{ctaLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.three,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
    textAlign: "center",
    marginBottom: Spacing.one,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  cta: {
    marginTop: Spacing.four,
    backgroundColor: Colors.brand.orange,
    paddingHorizontal: Spacing.five,
    paddingVertical: Spacing.three,
    borderRadius: Radii.lg,
  },
  ctaText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#FFFFFF",
  },
});
