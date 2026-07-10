import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MENU = [
  "Mes informations",
  "Mes adresses",
  "Notifications",
  "Aide et support",
];

export default function Profil() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar} />
          <Text style={styles.name}>Utilisateur</Text>
          <Text style={styles.email}>utilisateur@email.com</Text>
        </View>

        <View style={styles.menu}>
          {MENU.map((item) => (
            <Pressable key={item} style={styles.menuItem}>
              <Text style={styles.menuText}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF6F0",
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FBE7D9",
  },
  name: {
    fontFamily: "DMSans_700Bold",
    fontSize: 18,
    color: "#1A1A1A",
    marginTop: 12,
  },
  email: {
    fontFamily: "DMSans_400Regular",
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  menu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE6",
  },
  menuText: {
    fontFamily: "DMSans_500Medium",
    fontSize: 15,
    color: "#1A1A1A",
  },
  logoutButton: {
    marginTop: 24,
    alignItems: "center",
    paddingVertical: 14,
  },
  logoutText: {
    fontFamily: "DMSans_700Bold",
    fontSize: 15,
    color: "#E11D48",
  },
});
