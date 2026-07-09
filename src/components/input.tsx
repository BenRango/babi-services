import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { View } from 'react-native'

interface InputProps {
  value ?: string
  text : string
  placeholder ?: string

}

export default function Input(props: InputProps) {
  return (
    <View style = {[styles.container]}>
      <TextInput 
        style = {styles.input}
        placeholder = {props.placeholder}
        placeholderTextColor = "#A0A0A0"
        value={props.value}
      />
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderRadius: 8,
    marginBottom: 16,
  },
  input: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',

  },
 
  erreur: {
    color: 'red',
    marginTop: 4
  },

})
