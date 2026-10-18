import { WorkoutsFolderPopulated } from "@/types/folders";
import { create } from "zustand";
import { updateWorkoutsBulk } from "@/lib/workoutServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { Workout } from "@/types/workout";
import { updateFoldersBulk } from "@/lib/folderService";

type Store = {
  folders: WorkoutsFolderPopulated[];
  loading: boolean;
  collapsedFolders: string[];
  setFolders: (folders: WorkoutsFolderPopulated[]) => void;
  setLoading: (loading: boolean) => void;
  addFolder: (folder: WorkoutsFolderPopulated) => void;
  updateFolder: (
    folderId: string,
    propertiestoUpdate: Partial<WorkoutsFolderPopulated>,
  ) => void;
  removeFolder: (folderId: string) => void;
  reorderWorkouts: (folderId: string, newOrderIds: string[]) => Promise<void>;
  moveWorkoutToFolder: (
    workoutId: string,
    targetFolderId: string,
  ) => Promise<void>;
  toggleFolderCollapse: (folderId: string) => void;
  addWorkoutToFolder: (folderId: string, workout: Workout) => void;
  removeWorkoutFromFolder: (folderId: string, workoutId: string) => void;
  reorderFolders: (newOrder: string[]) => Promise<void>;
};

const useFoldersStore = create<Store>()(
  persist(
    (set, get) => ({
      folders: [],
      loading: false,
      collapsedFolders: [],

      setFolders: (folders) => set({ folders }),
      setLoading: (loading) => set({ loading }),

      removeFolder: (folderId) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== folderId),
        })),
      addFolder: (folder) =>
        set((state) => ({ folders: [...state.folders, folder] })),
      updateFolder: (folderId, propertiestoUpdate) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId
              ? { ...folder, ...propertiestoUpdate }
              : folder,
          ),
        })),
      reorderWorkouts: async (folderId, newOrderIds) => {
        const { folders } = get();
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return;

        const lookup: Record<string, Workout> = {};
        folder.workouts.forEach((w) => (lookup[w.id] = w));

        const updated = newOrderIds.map((id, idx) => ({
          ...lookup[id],
          order: idx + 1,
        }));

        if (updated.length !== folder.workouts.length) return;

        set({
          folders: folders.map((f) =>
            f.id === folderId ? { ...f, workouts: updated } : f,
          ),
        });

        try {
          await updateWorkoutsBulk(updated);
        } catch (err) {
          console.error("Reorder failed", err);
          set((state) => ({
            folders: state.folders.map((currentFolder) =>
              currentFolder.id === folderId
                ? { ...currentFolder, workouts: folder.workouts }
                : currentFolder,
            ),
          }));
        }
      },

      moveWorkoutToFolder: async (workoutId, targetFolderId) => {
        const { folders } = get();
        const sourceFolder = folders.find((folder) =>
          folder.workouts.some((workout) => workout.id === workoutId),
        );
        const targetFolder = folders.find(
          (folder) => folder.id === targetFolderId,
        );
        const draggedWorkout = sourceFolder?.workouts.find(
          (workout) => workout.id === workoutId,
        );
        if (!sourceFolder || !targetFolder || !draggedWorkout) return;
        if (sourceFolder.id === targetFolder.id) return;

        const sourceWorkouts = sourceFolder.workouts
          .filter((workout) => workout.id !== workoutId)
          .map((workout, index) => ({ ...workout, order: index + 1 }));

        const moved = {
          ...draggedWorkout,
          folder_id: targetFolderId,
          order: targetFolder.workouts.length + 1,
        };
        const final = folders.map((folder) =>
          folder.id === sourceFolder.id
            ? { ...folder, workouts: sourceWorkouts }
            : folder.id === targetFolderId
              ? { ...folder, workouts: [...folder.workouts, moved] }
              : folder,
        );

        set({ folders: final });

        try {
          await updateWorkoutsBulk([...sourceWorkouts, moved]);
        } catch (err) {
          console.error("Move failed", err);
          set({ folders });
        }
      },
      toggleFolderCollapse: (folderId) => {
        const { collapsedFolders } = get();
        const next = collapsedFolders.includes(folderId)
          ? collapsedFolders.filter((id) => id !== folderId)
          : [...collapsedFolders, folderId];
        set({ collapsedFolders: next });
      },
      addWorkoutToFolder: (folderId, workout) => {
        const { folders } = get();
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return;
        const updated = [...folder.workouts, workout];
        set({
          folders: folders.map((f) =>
            f.id === folderId ? { ...f, workouts: updated } : f,
          ),
        });
      },
      removeWorkoutFromFolder: (folderId, workoutId) => {
        const { folders } = get();
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return;
        const updated = folder.workouts.filter((w) => w.id !== workoutId);
        set({
          folders: folders.map((f) =>
            f.id === folderId ? { ...f, workouts: updated } : f,
          ),
        });
      },
      reorderFolders: async (newOrder) => {
        const { folders } = get();
        const updatedFolders = newOrder.map((id, index) => {
          const folder = folders.find((folder) => folder.id === id);
          return folder ? { ...folder, order: index + 1 } : null;
        });
        if (updatedFolders.some((folder) => folder === null)) return;

        const orderedFolders = updatedFolders as WorkoutsFolderPopulated[];
        set({ folders: orderedFolders });

        try {
          await updateFoldersBulk(orderedFolders);
        } catch (error) {
          console.error("Reorder failed", error);
          set({ folders });
        }
      },
    }),
    {
      name: "workout-folders-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        collapsedFolders: state.collapsedFolders,
      }),
    },
  ),
);

export default useFoldersStore;
