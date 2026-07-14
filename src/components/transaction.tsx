import Feather from '@expo/vector-icons/Feather';
import { StyleSheet, Text, View } from "react-native";
export interface TransactionProps {
    id: string
    title: string;
    amount: number;
    date: string;
    type: 'credit' | 'debit';
}
export default function Transaction(props: TransactionProps) {
  return (
    <View style={styles.container}>
        <View style={styles.iconContainer}>
            {
                props.type === "credit"?  
                <Feather name="arrow-down-left" size={32} color="green" /> : 
                <Feather name="arrow-up-right" size={32} color="red" />
            }
        </View>
        <View>
            <Text style={styles.title} >{props.title}</Text>
            <Text style={styles.date}>{props.date}</Text>
        </View>
        <View style={{ marginLeft: 'auto' }}>
            <Text style={[{ color: props.type === 'credit' ? 'green' : 'red' }, styles.amount]}>{props.type === 'credit' ? '+' : '-'}{props.amount} FCFA</Text>
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        height: 80,
        paddingHorizontal: 15,
        backgroundColor: "#ffffff",
        alignItems: "center",
        gap: 10
    },
    title: {
        fontSize: 18,
        fontWeight: 600,

    },
    date: {
        fontSize: 12
    },
    amount:{
        fontSize: 16,
        fontWeight: 500,
    },
    iconContainer: {

    }
})