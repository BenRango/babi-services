import { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

interface InputProps {
  value : string
  text : string
  placeholder ?: string
  onChangeText : (text: string) => void

}

export default function Input(props: InputProps) {
  const [isFocused,setFocused] = useState(false)
  const handleFocus = () => {
    setFocused (true)
  }
  const handleBlur = () => {
    setFocused (false)
  }
  return (
    <View style = {[styles.container]}>
      <TextInput 
        style = {[styles.input,isFocused && styles.inputouched]}
        keyboardType = "numeric"
        onFocus = {() => handleFocus()}
        placeholder = {props.placeholder}
        placeholderTextColor = "#A0A0A0"
        value={props.value}
        onChangeText={props.onChangeText}
        onBlur={() => handleBlur()}
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
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 15,
    backgroundColor: '#eeeeee',

  },
  inputouched:{
    outlineWidth: 1,
    outlineColor: "orange",

  },

})
