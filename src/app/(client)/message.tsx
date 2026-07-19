import Chat from "@/components/chat";
import ChatHearder from "@/components/chatHearder";
import ChatInputText from "@/components/chatInputText";
import StatusBubble from "@/components/statusBubble";
import { VoiceRecording } from "@/hooks/useVoiceRecorder";
import { MessageItem } from "@/types/chat";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";

const AVATAR_URL = "https://thispersondoesnotexist.com/random-person.jpeg";

export default function message() {
  const { nom, avatarUrl } = useLocalSearchParams<{ prestataireId?: string; nom?: string; avatarUrl?: string }>();
  const [messages, setMessage] = useState<MessageItem[]>([
    {
      type: "text",
      text: "Bonjour ! Comment puis-je vous aider ?",
      moi: false,
      heure: "10:12",
      avatarUrl: AVATAR_URL,
    },
    {
      type: "text",
      text: "Salut ! Je cherche des informations sur React Native.",
      moi: true,
      heure: "10:13",
      avatarUrl: AVATAR_URL,
    },
  ]);
  const [Texte, setTexte] = useState("");

  const flatListRef = useRef<FlatList>(null);

  const heureActuelle = () => {
    const maintenant = new Date();
    const h = maintenant.getHours().toString().padStart(2, "0");
    const m = maintenant.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const scrollVersLeBas = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const envoyerMessage = () => {
    if (Texte.trim() === "") return;

    const nouveauMessage: MessageItem = {
      type: "text",
      text: Texte.trim(),
      moi: true,
      heure: heureActuelle(),
      avatarUrl: "",
    };

    setMessage((prev) => [...prev, nouveauMessage]);
    setTexte("");
    scrollVersLeBas();
  };

  const envoyerAudio = (recording: VoiceRecording) => {
    const nouveauMessage: MessageItem = {
      type: "audio",
      uri: recording.uri,
      dureeSec: recording.dureeSec,
      moi: true,
      heure: heureActuelle(),
      avatarUrl: "",
    };
    setMessage((prev) => [...prev, nouveauMessage]);
    scrollVersLeBas();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ChatHearder nom={nom ?? "Konan Yves"} avatarUrl={avatarUrl ?? AVATAR_URL} enLigne />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Chat {...item} />}
          style={{ flex: 1, backgroundColor: "#fff" }}
          contentContainerStyle={{ paddingVertical: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: false })
          }
          ListFooterComponent={
            <StatusBubble text={"Offre acceptée — 13 500 FCFA"} />
          }
        />

        <ChatInputText
          value={Texte}
          onChangeText={setTexte}
          onEnvoyer={envoyerMessage}
          onEnvoyerAudio={envoyerAudio}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
