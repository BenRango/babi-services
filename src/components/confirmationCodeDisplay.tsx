import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface ConfirmationCodeDisplayProps {
  code: string;
}

export default function ConfirmationCodeDisplay({ code }: ConfirmationCodeDisplayProps) {
  return (
    <View style={styles.container}>
      {code.split("").map((digit, index) => (
        <View key={index} style={styles.digitBox}>
          <Text style={styles.digitText}>{digit}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.two,
    marginVertical: Spacing.four,
  },
  digitBox: {
    width: 56,
    height: 64,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    borderWidth: 2,
    borderColor: Colors.brand.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  digitText: {
    fontFamily: Fonts.title,
    fontSize: 28,
    color: Colors.brand.orange,
  },
});
