// import React from 'react'
import { BlurView } from "expo-blur";
import { StyleSheet, Text, View } from "react-native";

interface StatusBubbleProps {
  text: string;
}

export default function StatusBubble(props: StatusBubbleProps) {
  return (
    <>
      <View style={styles.conteneur}>
        <BlurView intensity={20} tint="light" style={styles.blur}>
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
    marginHorizontal: 80,
    marginTop: "60%",
    width: "100%",
    alignContent: "center",
  },

  text: {
    color: "#0F8436",
    fontWeight: "bold",
  },
  bulle: {
    borderRadius: 20,
    backgroundColor: "#e3f8e990",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  blur: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
