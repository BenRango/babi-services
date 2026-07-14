import React from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ChatInputTextProps {
  value: string
  onChangeText: (text: string) => void
  onEnvoyer: () => void
  onCameraPress?: () => void
}

export default function ChatInputText(props: ChatInputTextProps) {
  const estVide = props.value.trim() === ''

  return (
    <View style={styles.conteneur}>
      <TouchableOpacity style={styles.iconeBtn} onPress={props.onCameraPress}>
        <Ionicons name="camera-outline" size={24} color="#666" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Message..."
        placeholderTextColor="#999"
        value={props.value}
        onChangeText={props.onChangeText}
      />

      <TouchableOpacity
        style={[styles.envoyerBtn, { opacity: estVide ? 0.4 : 1 }]}
        onPress={props.onEnvoyer}
        disabled={estVide}
      >
        <Ionicons name="send" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  iconeBtn: { padding: 8 },
  input: {
    flex: 1,
    backgroundColor: '#F3F3F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginHorizontal: 8,
  },
  envoyerBtn: {
    backgroundColor: '#FF6A00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})