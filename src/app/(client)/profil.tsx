import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useRouter } from "expo-router";
import { Bell, ChevronRight, CircleHelp, LogOut, MapPin, User as UserIcon } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU: { icon: typeof UserIcon; label: string }[] = [
  { icon: UserIcon, label: "Mes informations" },
  { icon: MapPin, label: "Mes adresses" },
  { icon: Bell, label: "Notifications" },
  { icon: CircleHelp, label: "Aide et support" },
];

export default function Profil() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <UserIcon size={32} color={Colors.brand.orange} />
          </View>
          <Text style={styles.name}>Amidou Koné</Text>
          <Text style={styles.phone}>+225 07 00 00 00 00</Text>
        </View>

        <View style={styles.menu}>
          {MENU.map(({ icon: Icon, label }) => (
            <Pressable key={label} style={styles.menuItem}>
              <View style={styles.menuIconWrap}>
                <Icon size={16} color={Colors.brand.orange} />
              </View>
              <Text style={styles.menuText}>{label}</Text>
              <ChevronRight size={16} color={Colors.light.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={() => router.replace("/(auth)/login")}>
          <LogOut size={16} color="#E11D48" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.fond,
  },
  content: {
    padding: Spacing.four,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.four,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: Fonts.title,
    fontSize: 18,
    color: Colors.brand.encre,
    marginTop: Spacing.two,
  },
  phone: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  menu: {
    backgroundColor: Colors.light.backgroundElement,
    borderRadius: Radii.md,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderBottomWidth: 1,
    borderBottomColor: Colors.brand.fond,
  },
  menuIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    backgroundColor: Colors.brand.tintOr,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    flex: 1,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.brand.encre,
  },
  logoutButton: {
    flexDirection: "row",
    gap: 8,
    marginTop: Spacing.four,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.three,
  },
  logoutText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    color: "#E11D48",
  },
});
