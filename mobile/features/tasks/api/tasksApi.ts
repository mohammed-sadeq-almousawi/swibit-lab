import { apiClient } from '../../../core/api/client';
import { Task } from '../types/task.types';

export type { Task } from '../types/task.types';

export const getTasksApi = async (): Promise<Task[]> => {
  const response = await apiClient.get('/tasks/');
  return response.data;
};

export const createTaskApi = async (title: string, desc: string = '') => {
  const response = await apiClient.post('/tasks/', {
    title,
    desc,
  });
  return response.data;
};

export const updateTaskApi = async (task: Task) => {
  const response = await apiClient.put(`/tasks/${task.id}`, {
    title: task.title,
    desc: task.desc || "",
    done: task.done,
  });
  return response.data;
};

export const deleteTaskApi = async (taskId: number) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

export const updateTask = async (id: number, title: string, desc: string | null) => {
  const response = await apiClient.put(`/tasks/${id}`, { title, desc });
  return response.data;
};
