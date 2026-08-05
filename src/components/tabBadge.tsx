import { Fonts } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface TabBadgeProps {
  count: number;
}

export default function TabBadge({ count }: TabBadgeProps) {
  if (count <= 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  text: {
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    color: "#FFFFFF",
  },
});
