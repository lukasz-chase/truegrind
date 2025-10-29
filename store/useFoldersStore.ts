import { WorkoutsFolderPopulated } from "@/types/folders";
import { create } from "zustand";
import { updateWorkoutsBulk } from "@/lib/workoutServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { Workout } from "@/types/workout";

type Store = {
  folders: WorkoutsFolderPopulated[];
  loading: boolean;
  collapsedFolders: string[];
  setFolders: (folders: WorkoutsFolderPopulated[]) => void;
  setLoading: (loading: boolean) => void;
  addFolder: (folder: WorkoutsFolderPopulated) => void;
  updateFolder: (
    folderId: string,
    propertiestoUpdate: Partial<WorkoutsFolderPopulated>
  ) => void;
  removeFolder: (folderId: string) => void;
  reorderWorkouts: (folderId: string, newOrderIds: string[]) => Promise<void>;
  moveWorkoutToFolder: (
    workoutId: string,
    targetFolderId: string
  ) => Promise<void>;
  toggleFolderCollapse: (folderId: string) => void;
  addWorkoutToFolder: (folderId: string, workout: Workout) => void;
  removeWorkoutFromFolder: (folderId: string, workoutId: string) => void;
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
              : folder
          ),
        })),
      reorderWorkouts: async (folderId, newOrderIds) => {
        const { folders } = get();
        const folder = folders.find((f) => f.id === folderId);
        if (!folder) return;

        const lookup: Record<string, any> = {};
        folder.workouts.forEach((w) => (lookup[w.id] = w));

        const updated = newOrderIds.map((id, idx) => ({
          ...lookup[id],
          order: idx + 1,
        }));

        // Optimistic update
        set({
          folders: folders.map((f) =>
            f.id === folderId ? { ...f, workouts: updated } : f
          ),
        });

        try {
          await updateWorkoutsBulk(updated);
        } catch (err) {
          console.error("Reorder failed", err);
          // TODO: optionally revert on failure
        }
      },

      moveWorkoutToFolder: async (workoutId, targetFolderId) => {
        const { folders } = get();
        let dragged: any;
        const updatedFolders = folders.map((f) => {
          if (f.workouts.some((w) => w.id === workoutId)) {
            // remove from source
            dragged = f.workouts.find((w) => w.id === workoutId)!;
            return {
              ...f,
              workouts: f.workouts.filter((w) => w.id !== workoutId),
            };
          }
          return f;
        });
        if (!dragged) return;

        const target = updatedFolders.find((f) => f.id === targetFolderId);
        if (!target) return;

        const moved = {
          ...dragged,
          folder_id: targetFolderId,
          order: target.workouts.length + 1,
        };
        const final = updatedFolders.map((f) =>
          f.id === targetFolderId
            ? { ...f, workouts: [...f.workouts, moved] }
            : f
        );

        set({ folders: final });

        try {
          await updateWorkoutsBulk([moved]);
        } catch (err) {
          console.error("Move failed", err);
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
            f.id === folderId ? { ...f, workouts: updated } : f
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
            f.id === folderId ? { ...f, workouts: updated } : f
          ),
        });
      },
    }),
    {
      name: "workout-folders-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        collapsedFolders: state.collapsedFolders,
      }),
    }
  )
);

export default useFoldersStore;
