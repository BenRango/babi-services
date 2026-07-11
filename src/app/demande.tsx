import InputComponent from "@/components/input-component"
import ServiceButton, { ServiceButtonProps } from "@/components/serviceButton"
import { Colors } from "@/constants/theme"
import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker'
import { useState } from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
const maximumDate = new Date(2028, 10)
const initialDate = new Date()
export default function demande() {
    const [location, setLocation] = useState<string>("")
    const [datePickerVisible, setDatePickerVisible] = useState<boolean>(false)
    const [description, setDescription] = useState<string>("")
    const [wishedDate, setWishedDate] = useState<Date>(initialDate)
    const [budgetMax, setBudgetMax] = useState<string |undefined>(undefined)
    const [propositionsBudget]= useState<number[]>([
      20000,
      5000,
      10000,
      50000
    ])
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
  const handlePropositionBudgetPicked = (value: string) => {
    
    if (/^[0-9]{3,}$/.test(value) && parseInt(value) ) {
      setBudgetMax(value)
    }
  }
  const changeSelectedService = (service: ServiceButtonProps) => {
    setServices(
      services.map((s) => ({ 
          ...s, 
          selected: s.title === service.title  
        })
      ))
    console.log(services)
  }
  const changeSelectedModeFacturation = (service: ServiceButtonProps) => {
    setServices2(
      services2.map((s) => ({ 
          ...s, 
          selected: s.title === service.title  
        })
      ))
    console.log(services)
  }
  const handleDateChange = (e?: DateTimePickerChangeEvent) =>{
    setDatePickerVisible(!datePickerVisible)
    //setWishedDate(date)
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.sectionTitle}>Quel service ?*</Text>
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
        <Text style={styles.sectionTitle}>Description du problème*</Text>
        <InputComponent 
            value={description}
            placeholder="Ex : Mon lavabo est bouché depuis hier, l'eau ne coule plus..."
            onChangeText={(text)=> setDescription(text)}
            type="textarea"
        />
        <Text style={styles.sectionTitle}>Budget maximal*</Text>
        <View style={styles.budgetContainer}>
          <TextInput 
            placeholder="20000" 
            keyboardType="numeric" 
            style={styles.budgetInput}
            onChangeText={(text)=>{handlePropositionBudgetPicked(text)}}
            value={budgetMax}
          />
          <Text style={styles.currencyText}>FCFA</Text>
        </View>
        <View style={{display: "flex", flexDirection: "row", gap: 10}}>
          {propositionsBudget.sort().map((proposition, index)=>
            <TouchableOpacity 
              style={styles.budgetSuggestion} 
              key={index} 
              onPress={()=> handlePropositionBudgetPicked(proposition.toString())}>
              <Text style={{color: Colors.orange.text, fontWeight: 600}}>{proposition}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <InputComponent 
            value={location}
            onChangeText={(text)=> setLocation(text)}
        />
        <Text style={styles.sectionTitle}>Date souhaitée*</Text>
        <InputComponent 
            value={location}
            onChangeText={(text)=> handleDateChange()}
        />
        {datePickerVisible&&  
          <DateTimePicker 
            value={wishedDate}
            minimumDate={new Date()}
            maximumDate= {maximumDate}
          />
        }

        <Text style={styles.sectionTitle}>Mode facturation*</Text>
        <View style={styles.container}>
            {services2.map((service) => (
                <ServiceButton
                    key={service.title} 
                    title={service.title} 
                    logoSource={service.logoSource} 
                    onPress={() => changeSelectedModeFacturation(service)} 
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
  budgetContainer:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
  },
  budgetSuggestion: {
    backgroundColor: Colors.orange.background,
    borderColor: Colors.orange.border,
    borderWidth: 1,
    color: Colors.orange.text,
    padding: 15,
    paddingHorizontal: 18,
    borderRadius: 25,
    width: "auto"
  },
  budgetInput: {
    backgroundColor: "#ffffffd7",padding: 10,borderRadius: 8,
    fontSize: 16,
    minWidth :"85%",
    borderColor: "#5252523a",
    borderWidth: 1,
    marginRight: 5
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: "auto",
    paddingRight: 10
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FDF8F1',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  }
})