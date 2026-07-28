import BadgeArtisanChip from "@/components/badgeArtisanChip";
import { Colors, Fonts, Radii, Spacing } from "@/constants/theme";
import { useAsync } from "@/hooks/useAsync";
import { StatutKyc } from "@/types/user";
import { logout } from "@api/auth";
import { getMe } from "@api/users";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronRight, LogOut, MapPin, User as UserIcon } from "lucide-react-native";
import { useCallback } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function kycMeta(statut?: StatutKyc): { label: string; color: string; background: string } {
  if (statut === "verifie") return { label: "Vérifié", color: Colors.brand.vert, background: Colors.brand.tintVert };
  if (statut === "en_cours") {
    return { label: "Vérification en cours", color: Colors.brand.orange, background: Colors.brand.tintOr };
  }
  return { label: "Non vérifié", color: Colors.light.textSecondary, background: Colors.light.backgroundSelected };
}

export default function ProfilPrestataire() {
  const router = useRouter();
  const { loading, data: user, reload } = useAsync(getMe);

  const MENU = [
    { icon: UserIcon, label: "Mes informations", onPress: () => router.push("/(prestataire)/profil/informations") },
    { icon: MapPin, label: "Disponibilité", onPress: () => router.push("/(prestataire)/profil/disponibilite") },
  ];

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload])
  );

  const seDeconnecter = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const kyc = kycMeta(user?.statutKyc);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <UserIcon size={32} color={Colors.brand.orange} />
          </View>
          {loading && !user ? (
            <ActivityIndicator color={Colors.brand.orange} style={{ marginTop: Spacing.two }} />
          ) : (
            <>
              <Text style={styles.name}>{user?.nom ?? "Prestataire"}</Text>
              <Text style={styles.phone}>{user?.telephone ?? ""}</Text>
              <View style={styles.badgesRow}>
                <View style={[styles.kycBadge, { backgroundColor: kyc.background }]}>
                  <Text style={[styles.kycText, { color: kyc.color }]}>{kyc.label}</Text>
                </View>
                {user?.badge && <BadgeArtisanChip badge={user.badge} />}
              </View>
            </>
          )}
        </View>

        <View style={styles.menu}>
          {MENU.map(({ icon: Icon, label, onPress }) => (
            <Pressable key={label} style={styles.menuItem} onPress={onPress}>
              <View style={styles.menuIconWrap}>
                <Icon size={16} color={Colors.brand.orange} />
              </View>
              <Text style={styles.menuText}>{label}</Text>
              <ChevronRight size={16} color={Colors.light.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.logoutButton} onPress={seDeconnecter}>
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
  badgesRow: {
    flexDirection: "row",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  kycBadge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: 999,
    justifyContent: "center",
  },
  kycText: {
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
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
