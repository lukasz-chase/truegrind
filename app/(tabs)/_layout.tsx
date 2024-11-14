import { Tabs } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { NavigationData } from "@/constants/tabs";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
      }}
    >
      {NavigationData.map(({ name, icon, focusedIcon }) => (
        <Tabs.Screen
          name={name}
          key={name}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesomeIcons
                name={focused ? focusedIcon : icon}
                color={color}
                size={24}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
