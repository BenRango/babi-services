import ServiceButton, { ServiceButtonProps } from "@/components/serviceButton"
import { useState } from "react"
import { StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
function index() {
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
    setServices(services.map((s) => ({ ...s, selected: s.title === service.title ? !s.selected : s.selected })))
    console.log(services)
  }
  return (
    <SafeAreaView style={styles.container}>
      {services.map((service) => (
        <ServiceButton 
          key={service.title} 
          title={service.title} 
          logoSource={service.logoSource} 
          onPress={() => changeSelectedService(service)} 
          selected={service.selected}
        />
      ))}
    </SafeAreaView>
  )
}

export default index