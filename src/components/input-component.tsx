import { StyleSheet, TextInput, View } from "react-native";

interface InputComponentProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function InputComponent({ value, onChangeText }: InputComponentProps) {
  return (
    <View style={styles.container}>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'center',
    marginVertical: 10
  },
  input: {
    flex: 1,
  }
})