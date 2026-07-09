import { Image } from 'expo-image'
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export interface ServiceButtonProps {
  title: string,
  selected?: boolean,
  onPress: () => void
  logoSource?: ImageSourcePropType
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 18,
    minWidth: '30%',
    width: 'auto',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 0,
    marginVertical: 5
  },
  selectedContainer: {
    backgroundColor: "#f0d7c03f",
    outlineColor: "#ec6a00ab",
    outlineWidth: 2
  },
  unselectedContainer: {
    backgroundColor: "#f0f0f02a",
    outlineColor: "#a3a3a333",
    outlineWidth: 2
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 20,
    height: 20
  },
  title: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'montserrat'
  }
})

const ServiceButton = (props: ServiceButtonProps) => {
  return (
    <TouchableOpacity 
        style={[
            styles.container, 
            props.selected && styles.selectedContainer,
            !props.selected && styles.unselectedContainer
        ]} 
        disabled={props.selected}
        onPress={props.onPress}
    >
        <View style={styles.imageContainer}>
        {props.logoSource && 
            <Image 
                source={props.logoSource} contentFit="contain"
                style={styles.image} 
            />
        }
        </View>
        <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default ServiceButton