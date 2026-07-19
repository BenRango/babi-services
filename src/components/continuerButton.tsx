import { Colors, Fonts, Radii } from "@/constants/theme";
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface ContinuerButtonProps {
  filled?: boolean;
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function ContinuerButton(props: ContinuerButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[
        styles.container,
        props.filled && styles.filled,
        !props.filled && styles.unfilled,
        props.disabled && styles.disabled,
        props.style,
      ]}
    >
      <Text style={[styles.text, !props.filled && styles.textunfilled]}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    paddingHorizontal: 50,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: Radii.lg,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
  },
  filled: {
    backgroundColor: Colors.brand.orange,
  },
  unfilled: {
    backgroundColor: "#e1e0e0",
  },
  textunfilled: {
    color: "#777777",
  },
  disabled: {
    opacity: 0.5,
  },
});
