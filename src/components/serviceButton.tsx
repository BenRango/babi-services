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
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    padding: 5,
    borderRadius: 25,
    minWidth: '30%',
    width: 'auto',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    margin: 10
  },
  selectedContainer: {
    backgroundColor: "blue"
  },
  unselectedContainer: {
    backgroundColor: "red"
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
    fontSize: 14,
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