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
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffffa9",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    marginVertical: 10
  },
  textArea: {
    height: 150
  },
  input: {
    flex: 1,
    fontFamily: "Outfit"
  }
})