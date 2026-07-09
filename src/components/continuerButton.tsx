import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface ContinuerButtonProps {
  filled ?: boolean
  text : string
}
export default function ContinuerButton(props:ContinuerButtonProps) {
  return (
    <TouchableOpacity 
      style = {[styles.container, props.filled && styles.filled,!props.filled && styles.unfilled] }  >
      <Text style = {[styles.text,!props.filled && styles.textunfilled
      ]}  >{props.text} </Text>
    </TouchableOpacity>

    
  )
}
const styles = StyleSheet.create({
  container:{
    width:"80%",
    paddingHorizontal: 50,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius:15,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  text: {
    color: "white",
    fontWeight:"bold",
    fontSize:20

  },
  filled: {
    backgroundColor:"#FF6900",
  },
  unfilled: {
    backgroundColor: "#e1e0e0"
  },
  textunfilled :{
    color: "#777777"
  }


})
