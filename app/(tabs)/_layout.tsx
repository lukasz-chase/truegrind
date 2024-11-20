import { Tabs } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { NavigationData } from "@/constants/tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomTabBar from "@/components/CustomTabBar";
import WorkoutBottomSheet from "@/components/BottomSheet/WorkoutBottomSheet";
import { useSharedValue } from "react-native-reanimated";
import useBottomSheet from "@/store/useBottomSheet";
import { AppColors } from "@/constants/colors";

export default function TabLayout() {
  const animatedIndex = useSharedValue(0);
  const { isSheetVisible } = useBottomSheet();
  return (
    <GestureHandlerRootView>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: AppColors.blue,
          headerStyle: {
            backgroundColor: AppColors.black,
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: AppColors.black,
            height: 70,
          },
        }}
        tabBar={(props) => (
          <CustomTabBar {...props} animatedIndex={animatedIndex} />
        )}
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
      {isSheetVisible && <WorkoutBottomSheet animatedIndex={animatedIndex} />}
    </GestureHandlerRootView>
  );
}
