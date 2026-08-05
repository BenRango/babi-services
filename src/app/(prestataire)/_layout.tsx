import TabBadge from "@/components/tabBadge";
import { useNotificationsBadge } from "@/contexts/notificationsBadgeContext";
import { Tabs } from "expo-router";
import { ClipboardList, Home, Send, User } from "lucide-react-native";
import { View } from "react-native";

export default function PrestataireLayout() {
  const { demandesSansOffre, offresAccepteesNonDemarrees } = useNotificationsBadge();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#A0A0A0",
        tabBarLabelStyle: {
          fontFamily: "DMSans_500Medium",
          fontSize: 11,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#F0EDE6",
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="accueil"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="demandes"
        options={{
          title: "Demandes",
          tabBarIcon: ({ color, size }) => (
            <View>
              <ClipboardList color={color} size={size} />
              <TabBadge count={demandesSansOffre} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="offres"
        options={{
          title: "Mes offres",
          tabBarIcon: ({ color, size }) => (
            <View>
              <Send color={color} size={size} />
              <TabBadge count={offresAccepteesNonDemarrees} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
