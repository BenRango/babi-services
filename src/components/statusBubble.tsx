// import React from 'react'
import { StyleSheet, Text, View } from "react-native";
import {BlurView} from "expo-blur"

interface StatusBubbleProps {
  text: string;
}

export default function StatusBubble(props: StatusBubbleProps) {
  return (
    <>
      <View style={styles.conteneur}>
       
        <BlurView
          intensity = {20}
          tint= "dark"
          style= {styles.blur} 
        
        > 
          <View style={styles.bulle}>
            <Text style={styles.text}>{props.text}</Text>
          </View>
        </BlurView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    alignItems: "center",
    marginVertical: 10,
  },

  text: {
    color: "#0F8436",
  },
  bulle: {
    borderRadius: 20,
    backgroundColor: "#e3f8e9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    
  },
  blur:{
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  }
});
