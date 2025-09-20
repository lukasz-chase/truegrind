import { Tabs, useRouter } from "expo-router";
import FontAwesomeIcons from "@expo/vector-icons/FontAwesome";
import { HIDDEN_SCREENS, NAVIGATION_DATA } from "@/constants/tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomTabBar from "@/components/CustomTabBar";
import WorkoutBottomSheet from "@/components/BottomSheet/WorkoutBottomSheet";
import { useSharedValue } from "react-native-reanimated";
import useBottomSheet from "@/store/useBottomSheet";
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
import ActionModal from "@/components/Modals/ActionModal";
import useThemeStore from "@/store/useThemeStore";
import WorkoutPreviewModal from "@/components/Modals/WorkoutPreviewModal";
import FolderOptionsModal from "@/components/Modals/FolderOptionsModal";
import UpsertFolderModal from "@/components/Modals/UpsertFolderModal";

export default function TabLayout() {
  const animatedIndex = useSharedValue(0);
  const { isSheetVisible } = useBottomSheet();
  const { setActiveSplit, setLoading } = useSplitsStore();
  const { user } = userStore();
  const { refetchWorkouts } = useAppStore();
  const { theme } = useThemeStore((state) => state);

  const router = useRouter();

  useEffect(() => {
    getUserActiveSplit();
  }, [user, refetchWorkouts]);

  useEffect(() => {
    if (user) {
      // If user is loaded, but has no active_split_id, push to /splits
      if (!user?.active_split_id) {
        router.replace("/splits");
      }
    }
  }, [user]);

  const getUserActiveSplit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchUserSplitWithWorkouts(
        user.id,
        user.active_split_id!
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
        <ActionModal />
        <InfoModal />
        <TimerModal />
        <ExerciseOptionsModal />
        <WorkoutExercisesModal />
        <SetOptionsModal />
        <WorkoutOptionsModal />
        <ExerciseDetailsModal />
        <WorkoutPreviewModal />
        <FolderOptionsModal />
        <UpsertFolderModal />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: theme.blue,
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.tabBackground, height: 70 },
          }}
          initialRouteName="index"
          tabBar={(props) => (
            <CustomTabBar {...props} animatedIndex={animatedIndex} />
          )}
        >
          {NAVIGATION_DATA.map(({ name, icon, focusedIcon, title }) => (
            <Tabs.Screen
              name={name}
              key={name}
              options={{
                title,
                tabBarIcon: ({ color, focused }) => (
                  <FontAwesomeIcons
                    name={focused ? focusedIcon : icon}
                    size={24}
                    color={color}
                  />
                ),
              }}
            />
          ))}
          {HIDDEN_SCREENS.map((screen) => (
            <Tabs.Screen
              key={screen.name}
              name={screen.name}
              options={{ href: null, ...screen.additionalOptions }}
            />
          ))}
        </Tabs>
        {isSheetVisible && <WorkoutBottomSheet animatedIndex={animatedIndex} />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
