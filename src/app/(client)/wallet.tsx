import Transaction from "@/components/transaction";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { getWallet, listTransactions } from "@/services/walletService";
import { formatFcfa } from "@/utils/format";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  const { data: wallet, loading: loadingWallet } = useAsync(getWallet);
  const { data: transactions, loading: loadingTransactions } = useAsync(listTransactions);

  const ItemSeparator = () => <View style={{ height: 12 }} />;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={transactions ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => <Transaction {...item} />}
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Mon wallet</Text>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Solde disponible</Text>
              {loadingWallet && !wallet ? (
                <ActivityIndicator color="#FFFFFF" style={{ marginTop: 8, alignSelf: "flex-start" }} />
              ) : (
                <Text style={styles.balanceAmount}>{formatFcfa(wallet?.soldeFcfa ?? 0)}</Text>
              )}
              {!!wallet?.soldeBloqueFcfa && (
                <Text style={styles.balanceBloque}>
                  dont {formatFcfa(wallet.soldeBloqueFcfa)} bloqué (en attente de validation)
                </Text>
              )}
            </View>
            <Text style={styles.sectionTitle}>Transactions récentes</Text>
          </>
        }
        ListEmptyComponent={
          !loadingTransactions ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Aucune transaction pour le moment.</Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 22,
    color: Colors.brand.encre,
    marginTop: Spacing.two,
  },
  balanceCard: {
    backgroundColor: Colors.brand.orange,
    borderRadius: Radii.lg,
    padding: Spacing.four,
    marginTop: Spacing.three,
  },
  balanceLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: "#FFE8D6",
  },
  balanceAmount: {
    fontFamily: Fonts.title,
    fontSize: 26,
    color: "#FFFFFF",
    marginTop: 6,
  },
  balanceBloque: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: "#FFE8D6",
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: Fonts.titleSemiBold,
    fontSize: 15,
    color: Colors.brand.encre,
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
});
