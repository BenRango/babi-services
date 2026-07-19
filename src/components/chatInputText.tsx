import { Colors } from '@/constants/theme'
import { VoiceRecording, useVoiceRecorder } from '@/hooks/useVoiceRecorder'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface ChatInputTextProps {
  value: string
  onChangeText: (text: string) => void
  onEnvoyer: () => void
  onEnvoyerAudio: (recording: VoiceRecording) => void
  onCameraPress?: () => void
}

export default function ChatInputText(props: ChatInputTextProps) {
  const estVide = props.value.trim() === ''
  const { isRecording, durationMillis, start, stop } = useVoiceRecorder()
  const [demarrage, setDemarrage] = useState(false)

  useEffect(() => {
    return () => {
      if (isRecording) stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const demarrerEnregistrement = async () => {
    setDemarrage(true)
    const ok = await start()
    setDemarrage(false)
    if (!ok) {
      Alert.alert('Micro indisponible', "Autorisez l'accès au micro pour envoyer une note vocale.")
    }
  }

  const arreterEtEnvoyer = async () => {
    const recording = await stop()
    if (recording) props.onEnvoyerAudio(recording)
  }

  if (isRecording) {
    const secondes = Math.floor(durationMillis / 1000)
    return (
      <View style={styles.conteneur}>
        <View style={styles.recordingDot} />
        <Text style={styles.recordingText}>
          Enregistrement... {String(Math.floor(secondes / 60)).padStart(2, '0')}:
          {String(secondes % 60).padStart(2, '0')}
        </Text>
        <TouchableOpacity style={styles.stopBtn} onPress={arreterEtEnvoyer}>
          <Ionicons name="send" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    )
  }

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

      {estVide ? (
        <TouchableOpacity style={styles.envoyerBtn} onPress={demarrerEnregistrement} disabled={demarrage}>
          <Ionicons name="mic" size={18} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.envoyerBtn} onPress={props.onEnvoyer}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      )}
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
    minHeight: 56,
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
    backgroundColor: Colors.brand.orange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DC2626',
    marginRight: 10,
  },
  recordingText: {
    flex: 1,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  stopBtn: {
    backgroundColor: Colors.brand.orange,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
