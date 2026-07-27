import { Tabs } from "expo-router";
import { ClipboardList, Home, Send, User } from "lucide-react-native";

export default function PrestataireLayout() {
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
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="offres"
        options={{
          title: "Mes offres",
          tabBarIcon: ({ color, size }) => <Send color={color} size={size} />,
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
