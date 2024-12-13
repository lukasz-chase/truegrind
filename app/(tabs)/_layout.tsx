import { Tabs } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { NavigationData } from "@/constants/tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomTabBar from "@/components/CustomTabBar";
import WorkoutBottomSheet from "@/components/BottomSheet/WorkoutBottomSheet";
import { useSharedValue } from "react-native-reanimated";
import useBottomSheet from "@/store/useBottomSheet";
import { AppColors } from "@/constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ExerciseOptionsModal from "@/components/Modals/ExerciseOptionsModal";
import WorkoutExercisesModal from "@/components/Modals/WorkoutExercisesModal";
import TimerModal from "@/components/Modals/TimerModal";
import SetOptionsModal from "@/components/Modals/SetOptionsModal";
import WorkoutOptionsModal from "@/components/Modals/WorkoutOptionsModal";

export default function TabLayout() {
  const animatedIndex = useSharedValue(0);
  const { isSheetVisible } = useBottomSheet();
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView>
          <TimerModal />
          <ExerciseOptionsModal />
          <WorkoutExercisesModal />
          <SetOptionsModal />
          <WorkoutOptionsModal />
        </SafeAreaView>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: AppColors.blue,
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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
