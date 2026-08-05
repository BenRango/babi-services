import TabBadge from "@/components/tabBadge";
import { useNotificationsBadge } from "@/contexts/notificationsBadgeContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Tabs } from "expo-router";
import { Home, Plus, User, Wallet } from "lucide-react-native";
import { View } from "react-native";

export default function ClientLayout() {
  const { offresEnAttente } = useNotificationsBadge();

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
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ color, size }) => (
            <AntDesign color={color} size={size} name="message" />
          ),
        }}
      />
      <Tabs.Screen
        name="demande"
        options={{
          title: "Demandes",
          tabBarLabel: () => null,
          tabBarIcon: ({ size }) => (
            <View
              style={{
                width: size + 26,
                height: size + 26,
                borderRadius: (size + 26) / 2,
                backgroundColor: "#F97316",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 4,
              }}
            >
              <Plus color="#FFFFFF" size={size} />
              <TabBadge count={offresEnAttente} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
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
