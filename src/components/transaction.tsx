import { Colors, Fonts, Radii } from "@/constants/theme";
import { Transaction as TransactionModel } from "@/types/wallet";
import { formatFcfa } from "@/utils/format";
import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from "react-native";

export default function Transaction(props: TransactionModel) {
  const positif = props.type === "credit";
  return (
    <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: positif ? Colors.brand.tintVert : "#FEE2E2" }]}>
            {positif ?
                <Feather name="arrow-down-left" size={20} color={Colors.brand.vert} /> :
                <Feather name="arrow-up-right" size={20} color="#DC2626" />
            }
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
            <Text style={styles.date}>{props.date}</Text>
        </View>
        <Text style={[styles.amount, { color: positif ? Colors.brand.vert : "#DC2626" }]}>
          {positif ? "+" : "-"}{formatFcfa(props.amount)}
        </Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: Radii.md,
        display: 'flex',
        flexDirection: 'row',
        minHeight: 72,
        paddingHorizontal: 15,
        backgroundColor: Colors.light.backgroundElement,
        alignItems: "center",
        gap: 12
    },
    title: {
        fontSize: 14,
        fontFamily: Fonts.bodyMedium,
        color: Colors.brand.encre,
    },
    date: {
        fontSize: 11,
        fontFamily: Fonts.body,
        color: Colors.light.textSecondary,
        marginTop: 2,
    },
    amount:{
        fontSize: 13,
        fontFamily: Fonts.bodyBold,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    }
})
