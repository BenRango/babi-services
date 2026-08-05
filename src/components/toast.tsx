import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { Bell } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ToastBannerProps {
  message: string;
  onPress: () => void;
}

export default function ToastBanner({ message, onPress }: ToastBannerProps) {
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
  }, [anim]);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          top: insets.top + Spacing.two,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
        },
      ]}
    >
      <Pressable style={styles.card} onPress={onPress}>
        <Bell size={16} color="#FFFFFF" />
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: Spacing.four,
    right: Spacing.four,
    zIndex: 999,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    backgroundColor: Colors.brand.encre,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  text: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    color: "#FFFFFF",
    lineHeight: 18,
  },
});
