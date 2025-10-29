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
import { fetchExampleWorkouts } from "@/lib/workoutServices";
import useSplitsStore from "@/store/useSplitsStore";
import MainScreenSkeleton from "@/components/Skeletons/MainScreenSkeleton";
import { ThemeColors } from "@/types/user";
import useThemeStore from "@/store/useThemeStore";
import { fetchUserFoldersWithWorkouts } from "@/lib/folderService";
import SortableWorkoutGrid from "@/components/WorkoutsDragAndDrop/SortableWorkoutGrid";
import Animated, {
  LinearTransition,
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { AnimatedScrollView } from "react-native-reanimated/lib/typescript/component/ScrollView";
import WorkoutFolderHeader from "@/components/WorkoutFolderHeader";
import useUpsertFolderModal from "@/store/useUpsertFolderModal";
import useFoldersStore from "@/store/useFoldersStore";
import { useShallow } from "zustand/shallow";
import DraggableList from "@/components/BottomSheet/DraggableExercisesList.tsx/DraggableList";

export default function WorkoutScreen() {
  const [exampleWorkouts, setExampleWorkouts] = useState<Workout[] | null>(
    null
  );
  const [dataLoading, setDataLoading] = useState(false);
  const [draggedWorkout, setDraggedWorkout] = useState<Workout | null>(null);
  const [sourceFolderId, setSourceFolderId] = useState<string | null>(null);
  const [folderLayouts, setFolderLayouts] = useState<
    Record<string, { top: number; bottom: number }>
  >({});
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);
  const [dragFolderId, setDragFolderId] = useState<string | null>(null);

  const setIsSheetVisible = useBottomSheet((state) => state.setIsSheetVisible);
  const {
    activeWorkout,
    setActiveWorkout,
    setIsNewWorkout,
    persistedStorage,
    setPersistedStorage,
  } = useActiveWorkout(
    useShallow((state) => ({
      activeWorkout: state.activeWorkout,
      setActiveWorkout: state.setActiveWorkout,
      setIsNewWorkout: state.setIsNewWorkout,
      persistedStorage: state.persistedStorage,
      setPersistedStorage: state.setPersistedStorage,
    }))
  );
  const user = userStore((state) => state.user);
  const refetchWorkouts = useAppStore((state) => state.refetchWorkouts);
  const { split, loading } = useSplitsStore(
    useShallow((state) => ({
      split: state.activeSplit,
      loading: state.loading,
    }))
  );
  const openModal = useUpsertFolderModal((state) => state.openModal);
  const {
    folders,
    setFolders,
    foldersLoading,
    reorderWorkouts,
    moveWorkoutToFolder,
    collapsedFolders,
    reorderFolders,
  } = useFoldersStore(
    useShallow((state) => ({
      folders: state.folders,
      setFolders: state.setFolders,
      foldersLoading: state.loading,
      reorderWorkouts: state.reorderWorkouts,
      moveWorkoutToFolder: state.moveWorkoutToFolder,
      collapsedFolders: state.collapsedFolders,
      reorderFolders: state.reorderFolders,
    }))
  );

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
        console.log("user.id", user?.id);
        const [exampleResult, folderResult] = await Promise.all([
          fetchExampleWorkouts(user?.active_split_id!),
          fetchUserFoldersWithWorkouts(user?.id!, user?.active_split_id!),
        ]);

        if (exampleResult) {
          setExampleWorkouts(exampleResult);
        }

        if (folderResult) {
          setFolders(folderResult);
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

  useEffect(() => {
    setFolderLayouts((prev) =>
      Object.fromEntries(
        Object.entries(prev).filter(([id]) => folders.some((f) => f.id === id))
      )
    );
  }, [folders]);

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

  const startAnEmptyWorkout = (folderId: string) => {
    setIsNewWorkout(true);
    setActiveWorkout({
      id: uuid.v4(),
      name: "Workout",
      notes: "",
      user_id: user?.id ?? "user_id",
      workout_exercises: [],
      split_id: split?.id ?? "split_id",
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
  const handleReorder = (newOrder: string[]) => {
    reorderFolders(newOrder);
    setDragFolderId(null);
  };
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  if (loading || dataLoading || !split || !folders || foldersLoading) {
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
          onPress={() => startAnEmptyWorkout(folders[0].id)}
        >
          <Text style={styles.actionButtonText}>Start an Empty Workout</Text>
        </Pressable>
        <View style={styles.templateHeader}>
          <Text style={styles.templatesTitle}>Templates</Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={styles.templatesButton}
              onPress={() => newTemplateHandler(folders[0].id)}
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
        {dragFolderId && (
          <DraggableList
            data={folders.map((folder) => ({
              id: folder.id,
              name: folder.name,
            }))}
            onReorder={handleReorder}
            dragItemId={dragFolderId}
          />
        )}
        {folders.map((folder) => {
          const isCollapsed = collapsedFolders.includes(folder.id);
          return (
            <Animated.View
              key={`${folder.id}-${folder.workouts.length}`}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                registerFolderLayout(folder.id, { top: y, bottom: y + height });
              }}
              style={[{ marginBottom: 24 }, dragFolderId && styles.collapsed]}
              layout={LinearTransition}
            >
              <WorkoutFolderHeader
                id={folder.id}
                name={folder.name}
                workoutsLength={folder.workouts.length}
                setDragFolderId={setDragFolderId}
                scrollRef={scrollRef}
              />
              {!isCollapsed && (
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
                  handleMoveToFolder={moveWorkoutToFolder}
                  dragAbsoluteY={dragAbsoluteY}
                  onReorder={reorderWorkouts}
                  newTemplateHandler={newTemplateHandler}
                />
              )}
            </Animated.View>
          );
        })}
        {exampleWorkouts ? (
          <Animated.View layout={LinearTransition}>
            <Text style={[styles.templatesText, { marginTop: 20 }]}>
              Example Templates ({exampleWorkouts.length})
            </Text>
            <View style={styles.workouts}>
              {exampleWorkouts.map((w) => (
                <WorkoutCard key={w.id} workout={w} />
              ))}
            </View>
          </Animated.View>
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
    collapsed: {
      height: 0,
      overflow: "hidden",
      opacity: 0,
    },
  });
