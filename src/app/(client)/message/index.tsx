import ConversationCard from "@/components/conversationCard";
import { Colors, Fonts, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { listConversations } from "@/services/messageService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Messages() {
  const router = useRouter();
  const { loading, data: conversations, reload } = useAsync(listConversations);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {loading && !conversations ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.brand.orange} />
        </View>
      ) : (
        <FlatList
          data={conversations ?? []}
          keyExtractor={(item) => item.prestataireId}
          renderItem={({ item }) => (
            <ConversationCard
              conversation={item}
              onPress={() => router.push(`/(client)/message/${item.prestataireId}`)}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>Aucune conversation pour l&apos;instant.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 20,
    color: Colors.brand.encre,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: Spacing.six,
  },
});
