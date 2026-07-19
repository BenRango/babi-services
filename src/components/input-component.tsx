import { Colors, Fonts, Radii } from "@/constants/theme";
import { StyleSheet, TextInput, View } from "react-native";

interface InputComponentProps {
  value: string;
  type?: "text" | "password" | "email" | "numeric" | "textarea";
  placeholder?: string;
  onChangeText: (text: string) => void;
}

export default function InputComponent({ placeholder, value, type, onChangeText }: InputComponentProps) {
  return (
    <View style={[styles.container, type === "textarea" && styles.textArea]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={type === "password"}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.textSecondary}
        multiline={type === "textarea"}
        numberOfLines={type === "textarea" ? 4 : 1}
        textAlignVertical={type === "textarea" ? "top" : "center"}
        keyboardType={type === "numeric" ? "numeric" : "default"}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Colors.light.backgroundSelected,
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.sm,
    paddingHorizontal: 14,
    height: 50,
    justifyContent: 'center',
    marginVertical: 10
  },
  textArea: {
    height: 120,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.brand.encre,
  }
})
