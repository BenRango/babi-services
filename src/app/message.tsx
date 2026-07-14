import Chat from '@/components/chat'
import ChatHearder from '@/components/chatHearder'
import ChatInputText from '@/components/chatInputText'
import StatusBubble from '@/components/statusBubble'
import { MessageItem } from '@/types/chat'
import { useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const AVATAR_URL = 'https://thispersondoesnotexist.com/random-person.jpeg'

export default function message() {
  const [messages, setMessage] = useState<MessageItem []>(
    [
      { 
        text: "Bonjour ! Comment puis-je vous aider ?", 
        moi: false, 
        heure: "10:12", 
        avatarUrl: AVATAR_URL, 
      },
      { 
        text: "Salut ! Je cherche des informations sur React Native.", 
        moi: true, 
        heure: "10:13", 
        avatarUrl: AVATAR_URL, 
      },  
    ]
  )
  const [Texte, setTexte]= useState('')
  
  const flatListRef= useRef<FlatList>(null)

  const heureActuelle= () => {
    const maintenant= new Date()
    const h= maintenant.getHours().toString().padStart(2, '0')
    const m= maintenant.getMinutes().toString().padStart(2,'0')
    return `${h}:${m}`
  }

  const envoyerMessage= () => {
    if(Texte.trim() === '') return

    const nouveauMessage: MessageItem = {
      text: Texte.trim(),
      moi: true,
      heure: heureActuelle(),
      avatarUrl: ''

    }

    setMessage((prev) => [...prev,nouveauMessage])
    setTexte('')

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true})
    }, 100)
  }
  return (
    <KeyboardAvoidingView style= {{flex: 1}}
    behavior= {Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style= {{flex: 1, backgroundColor: "#fff"}}>
        <ChatHearder nom="Konan Yves" avatarUrl= {AVATAR_URL} enLigne/>

        <FlatList
        ref= {flatListRef}
        data= {messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <Chat
          text={item.text}
          heure={item.heure}
          avatarUrl={item.avatarUrl}
          moi={item.moi}
          />
        )}

        style= {{flex: 1, backgroundColor: "#fff"}}
        contentContainerStyle={{paddingVertical: 10}}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false})}
        ListFooterComponent={
          <StatusBubble text= {"Offre acceptée — 13 500 FCFA"}/>
        }
        />

        <ChatInputText 
        value= {Texte}
        onChangeText= {setTexte}
        onEnvoyer={envoyerMessage}
        />
      </SafeAreaView>

    </KeyboardAvoidingView>
  )
}