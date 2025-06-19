import WorkoutCard from "@/components/WorkoutCard";
import useAppStore from "@/store/useAppStore";
import useActiveWorkout from "@/store/useActiveWorkout";
import useBottomSheet from "@/store/useBottomSheet";
import userStore from "@/store/userStore";
import { useState, useEffect, useMemo, useRef } from "react";
import { StyleSheet, View, Text, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import uuid from "react-native-uuid";
import { useRouter } from "expo-router";
import { Workout } from "@/types/workout";
import {
  fetchExampleWorkouts,
  updateWorkoutsBulk,
} from "@/lib/workoutServices";
import useSplitsStore from "@/store/useSplitsStore";
import MainScreenSkeleton from "@/components/Skeletons/MainScreenSkeleton";
import { ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";
import {
  fetchUserFoldersWithWorkouts,
  updateFoldersBulk,
} from "@/lib/folderService";
import { WorkoutsFolderPopulated } from "@/types/folders";
import SortableWorkoutGrid from "@/components/WorkoutsDragAndDrop/SortableWorkoutGrid";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedScrollView } from "react-native-reanimated/lib/typescript/component/ScrollView";
import WorkoutFolderHeader from "@/components/WorkoutFolderHeader";
import useUpsertFolderModal from "@/store/useUpsertFolderModal";

export default function WorkoutScreen() {
  const [exampleWorkouts, setExampleWorkouts] = useState<Workout[] | null>(
    null
  );
  const [folderData, setFolderData] = useState<
    WorkoutsFolderPopulated[] | null
  >(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [draggedWorkout, setDraggedWorkout] = useState<Workout | null>(null);
  const [sourceFolderId, setSourceFolderId] = useState<string | null>(null);
  const [folderLayouts, setFolderLayouts] = useState<
    Record<string, { top: number; bottom: number }>
  >({});
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);

  const { setIsSheetVisible } = useBottomSheet();
  const {
    activeWorkout,
    setActiveWorkout,
    setIsNewWorkout,
    persistedStorage,
    setPersistedStorage,
  } = useActiveWorkout();
  const { user } = userStore();
  const { refetchWorkouts } = useAppStore();
  const { activeSplit: split, loading } = useSplitsStore();
  const { openModal } = useUpsertFolderModal();

  const { theme } = useThemeStore((state) => state);
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const router = useRouter();
  const scrollRef = useRef<AnimatedScrollView>(null);
  const scrollY = useSharedValue(0);
  const dragAbsoluteY = useSharedValue<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [exampleResult, folderResult] = await Promise.all([
          fetchExampleWorkouts(user!.active_split_id!),
          fetchUserFoldersWithWorkouts(user!.id, user!.active_split_id!),
        ]);

        if (exampleResult) {
          setExampleWorkouts(exampleResult);
        }

        if (folderResult) {
          setFolderData(folderResult);
        }
      } catch (error) {
        console.log("Unexpected fetch error", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (user && user.active_split_id) {
      fetchData();
    }
  }, [user, refetchWorkouts]);

  useEffect(() => {
    // this means that the active workout wasnt persisted so clear the flag,
    // otherwise it will open on workout click
    if (!activeWorkout.user_id) {
      setPersistedStorage(false);
    }
    // if there is a user id, that means there is a valid activeWorkout
    // we need to wait for user to load so the user.id check
    // if the workout was saved by persisting, open the sheet automatically
    if (activeWorkout.user_id && user?.id && persistedStorage) {
      setIsSheetVisible(true);
    }
  }, [activeWorkout, user]);

  useAnimatedReaction(
    () => {
      if (!draggedWorkout || dragAbsoluteY.value == null) return null;
      // convert the screen Y back into scroll-content space:
      return dragAbsoluteY.value + scrollY.value;
    },
    (absoluteContentY) => {
      if (absoluteContentY == null) return;
      let found: string | null = null;
      for (const [folderId, { top, bottom }] of Object.entries(folderLayouts)) {
        if (absoluteContentY >= top && absoluteContentY <= bottom) {
          found = folderId;
          break;
        }
      }
      runOnJS(setHoveredFolderId)(found);
    },
    [draggedWorkout, folderLayouts]
  );

  const registerFolderLayout = (
    folderId: string,
    layout: { top: number; bottom: number }
  ) => {
    setFolderLayouts((prev) => ({ ...prev, [folderId]: layout }));
  };

  const handleMoveToFolder = async (targetFolderId: string) => {
    if (!draggedWorkout || !folderData) return;

    // Prevent dropping into same folder
    if (targetFolderId === draggedWorkout.folder_id) return;

    const targetFolder = folderData.find((f) => f.id === targetFolderId);
    if (!targetFolder) return;

    const updatedWorkout = {
      ...draggedWorkout,
      folder_id: targetFolderId,
      order: targetFolder.workouts.length + 1,
    };

    const updatedFolders = folderData.map((folder) => {
      if (folder.id === targetFolderId) {
        return {
          ...folder,
          workouts: [...folder.workouts, updatedWorkout],
        };
      } else if (folder.id === draggedWorkout.folder_id) {
        return {
          ...folder,
          workouts: folder.workouts.filter((w) => w.id !== draggedWorkout.id),
        };
      }
      return folder;
    });

    try {
      setFolderData(updatedFolders);
      await updateWorkoutsBulk([updatedWorkout]);
    } catch (err) {
      console.log("Failed to move workout:", err);
    }
  };
  const onReorder = (newOrderIds: string[], folderId: string) => {
    if (!folderData) return;

    const folder = folderData.find((f) => f.id === folderId);
    if (!folder) return;

    const lookup: Record<string, Workout> = {};
    folder.workouts.forEach((w) => {
      lookup[w.id] = w;
    });

    const updatedWorkouts = newOrderIds.map((id, idx) => ({
      ...lookup[id]!,
      order: idx + 1,
    }));
    setFolderData((prevFolders) =>
      prevFolders!.map((f) =>
        f.id === folderId ? { ...f, workouts: updatedWorkouts } : f
      )
    );

    updateWorkoutsBulk(updatedWorkouts);
  };
  const startAnEmptyWorkout = (folderId: string) => {
    setIsNewWorkout(true);
    setActiveWorkout({
      id: uuid.v4(),
      name: "Workout",
      notes: "",
      user_id: user!.id,
      workout_exercises: [],
      split_id: split!.id,
      order: (split?.workouts.length ?? 0) + 1,
      folder_id: folderId,
    });
    setIsSheetVisible(true);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };
  const newTemplateHandler = (folderId: string) => {
    const templateId = uuid.v4();
    router.push(`/template/${folderId}/${templateId}`);
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  if (loading || dataLoading || !split || !folderData) {
    return <MainScreenSkeleton parentStyles={styles} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.container}
      >
        <Text style={styles.title}>Start Workout</Text>
        <Pressable onPress={() => router.push("/splits")}>
          <View style={styles.splitButton}>
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: theme.blue,
                },
              ]}
            >
              {split?.name}
            </Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.actionButton}
          onPress={() => startAnEmptyWorkout(folderData[0].id)}
        >
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </Pressable>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.templatesButton}
              onPress={() => newTemplateHandler(folderData[0].id)}
            >
              <Text style={styles.templatesButtonText}>+ Template</Text>
            </Pressable>
            <Pressable
              style={styles.templatesButton}
              onPress={() => openModal(null)}
            >
              <Text style={styles.templatesButtonText}>+ Folder</Text>
            </Pressable>
          </View>
        </View>
        {folderData.map((folder) => (
          <View
            key={`${folder.id}-${folder.workouts.length}`}
            onLayout={(e) => {
              const { y, height } = e.nativeEvent.layout;
              registerFolderLayout(folder.id, { top: y, bottom: y + height });
            }}
            style={{ marginBottom: 24 }}
          >
            <WorkoutFolderHeader
              id={folder.id}
              name={folder.name}
              workoutsLength={folder.workouts.length}
            />
            <SortableWorkoutGrid
              workouts={folder.workouts}
              scrollRef={scrollRef}
              scrollY={scrollY}
              sourceFolderId={sourceFolderId}
              setDraggedWorkout={setDraggedWorkout}
              setSourceFolderId={setSourceFolderId}
              folderId={folder.id}
              hoveredFolderId={hoveredFolderId}
              setHoveredFolderId={setHoveredFolderId}
              handleMoveToFolder={handleMoveToFolder}
              dragAbsoluteY={dragAbsoluteY}
              onReorder={onReorder}
              newTemplateHandler={newTemplateHandler}
            />
          </View>
        ))}
        {exampleWorkouts ? (
          <>
            <Text style={[styles.templatesText, { marginTop: 20 }]}>
              Example Templates ({exampleWorkouts.length})
            </Text>
            <View style={styles.workouts}>
              {exampleWorkouts.map((w) => (
                <WorkoutCard key={w.id} workout={w} />
              ))}
            </View>
          </>
        ) : null}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
const makeStyles = (theme: ThemeColors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      padding: 10,
    },
    title: {
      fontSize: 32,
      color: theme.textColor,
      paddingVertical: 20,
      fontWeight: "bold",
    },
    actionButton: {
      borderRadius: 10,
      backgroundColor: "#35A7FF",
      padding: 10,
    },
    splitButton: {
      borderRadius: 10,
      backgroundColor: theme.white,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.blue,
      marginVertical: 10,
    },
    actionButtonText: {
      color: theme.white,
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },
    templateHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 20,
      alignItems: "center",
    },
    templatesText: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.textColor,
    },
    templatesTitle: {
      fontSize: 24,
      color: theme.textColor,
      fontWeight: "bold",
    },
    templatesButton: {
      padding: 4,
      borderRadius: 10,
      backgroundColor: theme.lightBlue,
    },
    templatesButtonText: {
      textAlign: "center",
      fontSize: 18,
      color: theme.blue,
    },
    workouts: {
      marginTop: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: 10,
    },
    buttonRow: { flexDirection: "row", gap: 8 },
  });
