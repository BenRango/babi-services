import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface ChatHeaderProps {
  nom: string
  avatarUrl?: string
  enLigne?: boolean
  onBackPress?: () => void
  onMenuPress?: () => void
}

export default function ChatHeader(props: ChatHeaderProps) {
  return (
    <View style={styles.conteneur}>
      <TouchableOpacity onPress={props.onBackPress}>
        <Ionicons name="chevron-back" size={26} color="#333" />
      </TouchableOpacity>

      <Image source={{ uri: props.avatarUrl }} style={styles.avatar} />

      <View style={styles.infos}>
        <Text style={styles.nom}>{props.nom}</Text>
        {props.enLigne && (
          <View style={styles.statutLigne}>
            <View style={styles.pointVert} />
            <Text style={styles.statutTexte}>En ligne</Text>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={props.onMenuPress}>
        <Ionicons name="ellipsis-vertical" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  infos: { flex: 1, marginLeft: 10 },
  nom: { fontSize: 16, fontWeight: '700', color: '#222' },
  statutLigne: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  pointVert: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ECC71',
    marginRight: 5,
  },
  statutTexte: { fontSize: 12, color: '#2ECC71' },
})