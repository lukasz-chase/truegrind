import { Tabs } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { NavigationData } from "@/constants/tabs";
import PortalProvider from "@/components/Portal/PortalProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomTabBar from "@/components/CustomTabBar";

export default function TabLayout() {
  return (
    <GestureHandlerRootView>
      <PortalProvider>
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
          tabBar={(props) => <CustomTabBar {...props} />}
        >
          {NavigationData.map(({ name, icon, focusedIcon, title }) => (
            <Tabs.Screen
              name={name}
              key={name}
              options={{
                title,
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
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
