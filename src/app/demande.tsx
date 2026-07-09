import InputComponent from "@/components/input-component"
import ServiceButton, { ServiceButtonProps } from "@/components/serviceButton"
import { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function demande() {
    const [location, setLocation] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [services2, setServices2] = useState<ServiceButtonProps[]>([
        {
        title: "Plomberie",
        logoSource: require("@/assets/icons/water-tap-plumber.svg"),
        selected: true,
        onPress: () => {
            console.log("Plomberie")
        }
        },
        {
        title: "Electricité",
        logoSource: require("@/assets/icons/electricity-technology.svg"),
        onPress: () => {
            console.log("Electricité")
        }
        },
        {
        title: "Menuisier",
        logoSource: require("@/assets/icons/carpenter.svg"),
        onPress: () => {
            console.log("Menuisier")
        }
        }]
    )
    const [services, setServices] = useState<ServiceButtonProps[]>([
    {
      title: "Plomberie",
      logoSource: require("@/assets/icons/water-tap-plumber.svg"),
      selected: true,
      onPress: () => {
        console.log("Plomberie")
      }
    },
    {
      title: "Electricité",
      logoSource: require("@/assets/icons/electricity-technology.svg"),
      onPress: () => {
        console.log("Electricité")
      }
    },
    {
      title: "Menuisier",
      logoSource: require("@/assets/icons/carpenter.svg"),
      onPress: () => {
        console.log("Menuisier")
      }
    },
    {
      title: "Menuisier2",
      logoSource: require("@/assets/icons/carpenter.svg"),
      onPress: () => {
        console.log("Menuisier")
      }
    },
    {
      title: "Menuisier3",
      logoSource: require("@/assets/icons/carpenter.svg"),
      onPress: () => {
        console.log("Menuisier")
      }
    },
    {
      title: "Climatisation",
      logoSource: require("@/assets/icons/breeze.svg"),
      onPress: () => {
        console.log("Climatisation")
      }
    }
  ])
  const changeSelectedService = (service: ServiceButtonProps) => {
    setServices(
      services.map((s) => ({ 
          ...s, 
          selected: s.title === service.title  
        })
      ))
    console.log(services)
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
        <Text style={styles.sectionTitle}>Description du problème*</Text>
        <InputComponent 
            value={description}
            onChangeText={(text)=> setDescription(text)}
            type="textarea"
        />
        <Text style={styles.sectionTitle}>Catégories*</Text>
        <View style={styles.container}>
            {services.map((service) => (
                <ServiceButton
                    key={service.title} 
                    title={service.title} 
                    logoSource={service.logoSource} 
                    onPress={() => changeSelectedService(service)} 
                    selected={service.selected}
                />
            ))}
        </View>
        <Text style={styles.sectionTitle}>Localisation*</Text>
        <InputComponent 
            value={location}
            onChangeText={(text)=> setLocation(text)}
        />
        <Text style={styles.sectionTitle}>Date souhaitée*</Text>
        <InputComponent 
            value={location}
            onChangeText={(text)=> setLocation(text)}
        />

        <Text style={styles.sectionTitle}>Mode facturation*</Text>
        <View style={styles.container}>
            {services2.map((service) => (
                <ServiceButton
                    key={service.title} 
                    title={service.title} 
                    logoSource={service.logoSource} 
                    onPress={() => changeSelectedService(service)} 
                    selected={service.selected}
                />
            ))}
        </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
})