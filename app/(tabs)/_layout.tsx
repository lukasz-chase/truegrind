import { Tabs, useRouter } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { hiddenScreens, NavigationData } from "@/constants/tabs";
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
import ExerciseDetailsModal from "@/components/Modals/ExerciseDetailsModal/ExerciseDetailsModal";
import { useEffect } from "react";
import useSplitsStore from "@/store/useSplitsStore";
import userStore from "@/store/userStore";
import { fetchUserSplitWithWorkouts } from "@/lib/splitsServices";
import useAppStore from "@/store/useAppStore";
import InfoModal from "@/components/Modals/InfoModal";

export default function TabLayout() {
  const animatedIndex = useSharedValue(0);
  const { isSheetVisible } = useBottomSheet();
  const { setActiveSplit, loading, setLoading } = useSplitsStore();
  const { user } = userStore();
  const { refetchNumber } = useAppStore();

  const router = useRouter();

  useEffect(() => {
    getUserActiveSplit();
  }, [user, refetchNumber]);

  useEffect(() => {
    if (user) {
      // If user is loaded, but has no active_split_id, push to /splits
      if (!user.active_split_id) {
        router.replace("/splits");
      }
    }
  }, [user]);

  const getUserActiveSplit = async () => {
    setLoading(true);
    try {
      const data = await fetchUserSplitWithWorkouts(
        user!.id,
        user!.active_split_id!
      );
      if (data) {
        setActiveSplit(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <SafeAreaView>
          <InfoModal />
          <TimerModal />
          <ExerciseOptionsModal />
          <WorkoutExercisesModal />
          <SetOptionsModal />
          <WorkoutOptionsModal />
          <ExerciseDetailsModal />
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
          {hiddenScreens.map((screen) => (
            <Tabs.Screen
              name={screen.name}
              key={screen.name}
              options={{
                href: null,
                headerShown: false,
                ...screen.additionalOptions,
              }}
            />
          ))}

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
