import Transaction, { TransactionProps } from "@/components/transaction";
import { useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Wallet() {
  const [transactions, setTransactions] = useState<TransactionProps[]>([
    {
      id: "1",
      title: "Achat de crédit",
      amount: 5000,
      date: "12 Oct 2023",
      type: "debit"
    },
    {
      id: "2",
      title: "Transfert reçu",
      amount: 15000,
      date: "13 Oct 2023",
      type: "credit"
    },
    {
      id: "3",
      title: "Facture d'électricité",
      amount: 24500,
      date: "15 Oct 2023",
      type: "debit"
    },
    {
      id: "4",
      title: "Abonnement Streaming",
      amount: 6500,
      date: "18 Oct 2023",
      type: "debit"
    },
    {
      id: "5",
      title: "Dépôt Mobile Money",
      amount: 50000,
      date: "20 Oct 2023",
      type: "credit"
    },
    {
      id: "6",
      title: "Restaurant entre amis",
      amount: 18500,
      date: "22 Oct 2023",
      type: "debit"
    },
    {
      id: "7",
      title: "Remboursement Sory",
      amount: 10000,
      date: "25 Oct 2023",
      type: "credit"
    },
    {
      id: "8",
      title: "Course VTC",
      amount: 3500,
      date: "26 Oct 2023",
      type: "debit"
    },
    {
      id: "9",
      title: "Achat de livres",
      amount: 12000,
      date: "28 Oct 2023",
      type: "debit"
    },
    {
      id: "10",
      title: "Virement reçu",
      amount: 350000,
      date: "30 Oct 2023",
      type: "credit"
    }
  ]);
  const flatListRef= useRef<FlatList>(null)
  const ItemSeparator = () => <View style={{ height: 12 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        ref= {flatListRef}
        ListHeaderComponent={renderHeader}
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (<Transaction {...item} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucune transaction pour le moment.</Text>
          </View>
        }
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}
  const renderHeader = () => (
    <>
      <Text style={styles.title}>Mon wallet</Text>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Solde disponible</Text>
        <Text style={styles.balanceAmount}>0 FCFA</Text>
      </View>
      <PointComponent points={320}/>
      <Text style={styles.sectionTitle}>Transactions récentes</Text>
    </>
  );
  const PointComponent = (props: {points: number}) => (
    <View style={styles.pointContainer}>
      <Text style={styles.pointsLabel}>BabiPoints</Text>
      <Text style={styles.pointsText}>{props.points} pts</Text>
      <Text style={styles.pointReduction}>= {props.points * 10}F de réduction</Text>
    </View>
  )
const styles = StyleSheet.create({
  pointContainer: {
    marginTop: 20,
    borderRadius: 20,
    outlineWidth: 1,
    padding: 16,
    backgroundColor: "#cccccc44"
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 500
  },
  pointsLabel:{

  },
  pointReduction: {

  },
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
    padding: 20
  },
  content: {
    padding: 24,
  },
  title: {
    fontFamily: "DMSerifDisplay_400Regular",
    fontSize: 24,
    color: "#1A1A1A",
  },
  balanceCard: {
    backgroundColor: "#ff5608",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  balanceLabel: {
    fontFamily: "DMSans_500Medium",
    fontSize: 13,
    color: "#FFE8D6",
  },
  balanceAmount: {
    fontFamily: "DMSans_700Bold",
    fontSize: 28,
    color: "#FFFFFF",
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: "DMSans_700Bold",
    fontSize: 16,
    color: "#1A1A1A",
    marginTop: 28,
    marginBottom: 16,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#A0A0A0",
  },
});
