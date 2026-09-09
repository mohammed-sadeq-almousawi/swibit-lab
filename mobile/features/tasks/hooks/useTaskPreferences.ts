import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SortOption, StatusFilter, TaskMetadata } from '../types/task.types';

interface TaskPreferencesState {
  sortOption: SortOption;
  folders: string[];
  activeFolder: string;
  statusFilter: StatusFilter;
  taskMetadata: Record<number, TaskMetadata>;
  setSortOption: (sortOption: SortOption) => void;
  setActiveFolder: (activeFolder: string) => void;
  setStatusFilter: (statusFilter: StatusFilter) => void;
  addFolder: (name: string) => void;
  deleteFolder: (name: string) => void;
  setTaskMetadata: (taskId: number, meta: Partial<TaskMetadata>) => void;
  removeTaskMetadata: (taskId: number) => void;
}

export const useTaskPreferences = create<TaskPreferencesState>()(
  persist(
    (set) => ({
      sortOption: 'manual',
      folders: ['All', 'Work', 'Personal', 'Study'],
      activeFolder: 'All',
      statusFilter: 'all',
      taskMetadata: {},
      setSortOption: (sortOption: SortOption) => set({ sortOption }),
      setActiveFolder: (activeFolder: string) => set({ activeFolder }),
      setStatusFilter: (statusFilter: StatusFilter) => set({ statusFilter }),
      addFolder: (name: string) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed || state.folders.includes(trimmed)) return state;
          return { folders: [...state.folders, trimmed] };
        }),
      deleteFolder: (name: string) =>
        set((state) => {
          if (name === 'All') return state;
          return {
            folders: state.folders.filter((f) => f !== name),
            activeFolder: state.activeFolder === name ? 'All' : state.activeFolder,
          };
        }),
      setTaskMetadata: (taskId: number, meta: Partial<TaskMetadata>) =>
        set((state) => ({
          taskMetadata: {
            ...state.taskMetadata,
            [taskId]: {
              ...(state.taskMetadata[taskId] || {}),
              ...meta,
            },
          },
        })),
      removeTaskMetadata: (taskId: number) =>
        set((state) => {
          const updated = { ...state.taskMetadata };
          delete updated[taskId];
          return { taskMetadata: updated };
        }),
    }),
    {
      name: 'task_preferences_store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
