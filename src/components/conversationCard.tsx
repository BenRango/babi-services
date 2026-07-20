import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Conversation } from "@/services/messageService";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConversationCardProps {
  conversation: Conversation;
  onPress: () => void;
}

export default function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: conversation.avatarUrl }} style={styles.avatar} contentFit="cover" />
      <View style={styles.info}>
        <Text style={styles.nom}>{conversation.nom}</Text>
        <Text style={styles.apercu} numberOfLines={1}>
          {conversation.dernierMessage ?? conversation.metier}
        </Text>
      </View>
      {conversation.dernierHeure && <Text style={styles.heure}>{conversation.dernierHeure}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.backgroundSelected,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radii.md,
    backgroundColor: Colors.brand.tintOr,
  },
  info: {
    flex: 1,
  },
  nom: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
  },
  apercu: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  heure: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.light.textSecondary,
  },
});
