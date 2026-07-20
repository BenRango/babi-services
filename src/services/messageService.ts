import { MessageItem } from "@/types/chat";
import { PRESTATAIRES_POOL, conversations, delay } from "./_mockData";

export interface Conversation {
  prestataireId: string;
  nom: string;
  avatarUrl: string;
  metier: string;
  dernierMessage?: string;
  dernierHeure?: string;
}

function apercu(message: MessageItem): string {
  return message.type === "audio" ? "🎤 Note vocale" : message.text;
}

export async function listConversations(): Promise<Conversation[]> {
  const items = PRESTATAIRES_POOL.map((p) => {
    const messages = conversations.get(p.id) ?? [];
    const dernier = messages[messages.length - 1];
    return {
      prestataireId: p.id,
      nom: p.nom,
      avatarUrl: p.avatarUrl,
      metier: p.metier,
      dernierMessage: dernier ? apercu(dernier) : undefined,
      dernierHeure: dernier?.heure,
    };
  });
  return delay(items.sort((a, b) => (b.dernierMessage ? 1 : 0) - (a.dernierMessage ? 1 : 0)));
}

export function getConversationMessages(prestataireId: string): MessageItem[] {
  return conversations.get(prestataireId) ?? [];
}

export function addMessage(prestataireId: string, message: MessageItem): void {
  const messages = conversations.get(prestataireId) ?? [];
  messages.push(message);
  conversations.set(prestataireId, messages);
}
