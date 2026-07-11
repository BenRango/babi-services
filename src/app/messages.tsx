import Chat from '@/components/chat'
import StatusBubble from '@/components/statusBubble'
import React from 'react'
import { View } from 'react-native'

export default function message() {
  return (
    <View>
      <Chat text={"Bonjour ! J'ai bien reçu votre demande. Je suis disponible dès demain matin."} heure="10:13" avatarUrl="https://www.flaticon.com/free-icon/user-avatar_6596121" moi={false} /><Chat text={"Bonjour Konan ! Très bien. Quel est votre tarif pour ce type d'intervention ?"} heure="10:20" moi avatarUrl={""} /><StatusBubble text={"Offre acceptée — 13 500 FCFA"} />
    </View>
  )
}
