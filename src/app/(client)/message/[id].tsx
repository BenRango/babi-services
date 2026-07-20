import Chat from "@/components/chat";
import ChatHearder from "@/components/chatHearder";
import ChatInputText from "@/components/chatInputText";
import StatusBubble from "@/components/statusBubble";
import { useVoiceRecorder, VoiceRecording } from "@/hooks/useVoiceRecorder";
import { addMessage, getConversationMessages } from "@/services/messageService";
import { getPrestataire } from "@/services/prestataireService";
import { MessageItem } from "@/types/chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FilDiscussion() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [prestataire, setPrestataire] = useState<Awaited<ReturnType<typeof getPrestataire>> | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>(() => getConversationMessages(id));
  const [texte, setTexte] = useState("");

  useEffect(() => {
    let cancelled = false;
    getPrestataire(id).then((p) => {
      if (!cancelled) setPrestataire(p);
    });
    setMessages(getConversationMessages(id));
    return () => {
      cancelled = true;
    };
  }, [id]);

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
    if (texte.trim() === "") return;

    const nouveauMessage: MessageItem = {
      type: "text",
      text: texte.trim(),
      moi: true,
      heure: heureActuelle(),
      avatarUrl: "",
    };

    addMessage(id, nouveauMessage);
    setMessages((prev) => [...prev, nouveauMessage]);
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
    addMessage(id, nouveauMessage);
    setMessages((prev) => [...prev, nouveauMessage]);
    scrollVersLeBas();
  };

  if (!prestataire) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }} edges={["top"]}>
        <ActivityIndicator color="#F97316" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <ChatHearder nom={prestataire.nom} avatarUrl={prestataire.avatarUrl} enLigne onBackPress={() => router.back()} />

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <Chat {...item} />}
            style={{ flex: 1, backgroundColor: "#fff" }}
            contentContainerStyle={{ paddingVertical: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListFooterComponent={id === "presta-1" ? <StatusBubble text="Offre acceptée — 13 500 FCFA" /> : null}
          />

          <ChatInputText value={texte} onChangeText={setTexte} onEnvoyer={envoyerMessage} onEnvoyerAudio={envoyerAudio} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
