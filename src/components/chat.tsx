import { View, StyleSheet,Text, } from 'react-native'
import {Image} from 'expo-image'


interface ChatProps {
  moi : boolean
  text : string
  heure: string
  avatarUrl: string

}

export default function Chat(props:ChatProps) {
  return (
    <View style = {[styles.ligne,{justifyContent:props.moi ? "flex-end" : "flex-start"}]} 
    >
      {!props.moi && (
        <Image 
        source={props.avatarUrl }
        style= {styles.avatar}
        />
      ) }
      <View style= {[styles.bulle, props.moi ? styles.bulleMoi : styles.bulleAutre]}>
        <Text style= {props.moi ? styles.textMoi : styles.textAutre}>{props.text}
        </Text>
      <Text style= {[styles.heure,{color: props.moi ? 'rgba(255,255,255,0.7)' : "#999"}]}>{props.heure}</Text>

      </View>
      
      
    </View>
  )
}

const styles = StyleSheet.create({
  ligne:{
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
    paddingHorizontal: 12,


  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  bulle:{
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,


  },
  bulleMoi:{
    backgroundColor: "#FF6A00",
    borderBottomRightRadius: 4,
    

  },

  bulleAutre: {
    backgroundColor: "#c3c3c5",
    borderBottomLeftRadius: 4,
    marginTop: 90,


  },
  textMoi: {
    color: "#fff",
    fontSize: 15,
  },
  textAutre: {
    color: "#222",
    fontSize: 15,
  },
  heure: {
    fontSize: 11,
    marginTop: 11,
    alignSelf: "flex-end"
  }
  
})