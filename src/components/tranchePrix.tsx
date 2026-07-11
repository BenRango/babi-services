import { Button, GestureResponderEvent } from 'react-native'

export interface TranchePrixProps {
    value: number
    onClick?: (e: GestureResponderEvent, value: number)=> void
}
export default function tranchePrix(props: TranchePrixProps) {
  return (
    <Button 
        title={props.value.toString()} 
        onPress={(e) => props.onClick?.(e, props.value)}
    />
    )
}
