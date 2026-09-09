import { useQuery } from '@tanstack/react-query';
import { getTasksApi } from '../api/tasksApi';
import { Task } from '../types/task.types';
import { useTaskPreferences } from './useTaskPreferences';

export const useTasks = () => {
  const taskMetadata = useTaskPreferences((state) => state.taskMetadata);
  const { data: rawTasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasksApi,
  });

  const tasks: Task[] | undefined = rawTasks?.map((task) => {
    const meta = taskMetadata[task.id];
    const progress = meta?.progress !== undefined ? meta.progress : task.done ? 100 : 0;
    const folder = meta?.folder;
    return {
      ...task,
      progress,
      folder,
    };
  });

  return { tasks, isLoading, error };
};
