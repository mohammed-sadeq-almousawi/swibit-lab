import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskApi, updateTaskApi, deleteTaskApi, updateTask } from '../api/tasksApi';
import { Task, CreateTaskInput, EditTaskInput } from '../types/task.types';
import { useTaskPreferences } from './useTaskPreferences';

export const useCreateTask = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const setTaskMetadata = useTaskPreferences((state) => state.setTaskMetadata);

  return useMutation({
    mutationFn: async ({ title, description, folder, progress = 0 }: CreateTaskInput) => {
      const created = await createTaskApi(title, description);
      if (created?.id && (folder || progress > 0)) {
        setTaskMetadata(created.id, { folder, progress });
      }
      return created;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const setTaskMetadata = useTaskPreferences((state) => state.setTaskMetadata);

  return useMutation({
    mutationFn: async (updatedTask: Task) => {
      if (updatedTask.progress !== undefined || updatedTask.folder !== undefined) {
        setTaskMetadata(updatedTask.id, {
          progress: updatedTask.progress,
          folder: updatedTask.folder,
        });
      }
      return updateTaskApi(updatedTask);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const removeTaskMetadata = useTaskPreferences((state) => state.removeTaskMetadata);

  return useMutation({
    mutationFn: async (id: number) => {
      removeTaskMetadata(id);
      return deleteTaskApi(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
};

export const useEditTask = (onSuccess?: () => void, onError?: (error: unknown) => void) => {
  const queryClient = useQueryClient();
  const setTaskMetadata = useTaskPreferences((state) => state.setTaskMetadata);

  return useMutation({
    mutationFn: async ({ id, title, desc, folder, progress }: EditTaskInput) => {
      if (folder !== undefined || progress !== undefined) {
        setTaskMetadata(id, { folder, progress });
      }
      return updateTask(id, title, desc);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
