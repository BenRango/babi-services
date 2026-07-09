import { StyleSheet, TextInput, View } from 'react-native'

interface InputProps {
  value : string
  text : string
  placeholder ?: string
  onChangeText : (text: string) => void

}

export default function Input(props: InputProps) {
  return (
    <View style = {[styles.container]}>
      <TextInput 
        style = {styles.input}
        keyboardType = "numeric"
        placeholder = {props.placeholder}
        placeholderTextColor = "#A0A0A0"
        value={props.value}
        onChangeText={props.onChangeText}
      />
      
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderRadius: 8,
    marginBottom: 16,
     width: "70%",

  },
  input: {
    padding: 20,
    borderRadius: 15,
    color: "white",
    backgroundColor: '#073d73',

  },
 
  erreur: {
    color: 'red',
    marginTop: 4
  },

})
