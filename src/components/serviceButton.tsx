import { Colors, Fonts } from '@/constants/theme'
import { Image } from 'expo-image'
import { ReactNode } from 'react'
import { ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export interface ServiceButtonProps {
  title: string,
  selected?: boolean,
  onPress: () => void
  logoSource?: ImageSourcePropType
  icon?: ReactNode
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 18,
    minWidth: '31.5%',
    width: 'auto',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 0,
    marginVertical: 5
  },
  selectedContainer: {
    backgroundColor: Colors.brand.tintOr,
    borderColor: Colors.brand.orange,
    borderWidth: 2
  },
  unselectedContainer: {
    backgroundColor: Colors.light.backgroundElement,
    borderColor: Colors.light.backgroundSelected,
    borderWidth: 2
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 32,
    height: 32
  },
  title: {
    color: Colors.brand.encre,
    fontSize: 12,
    fontFamily: Fonts.bodyMedium,
    textAlign: 'center'
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
        onPress={props.onPress}
    >
        <View style={styles.imageContainer}>
        {props.logoSource ? (
            <Image
                source={props.logoSource} contentFit="contain"
                style={styles.image}
            />
        ) : props.icon}
        </View>
        <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default ServiceButton
