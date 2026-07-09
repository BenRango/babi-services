import ContinuerButton from "@/components/continuerButton"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
function index() {
  
  return (
    <SafeAreaView style={styles.container}>
      <ContinuerButton filled text = {"Continuer"}  />
      <ContinuerButton filled = {false} text = {"Passer"}/>
    </SafeAreaView>
  )
}

export default index