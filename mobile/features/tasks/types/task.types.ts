export type SortOption = 'manual' | 'progress' | 'status';

export type StatusFilter = 'all' | 'pending' | 'completed';

export interface TaskMetadata {
  progress?: number;
  folder?: string;
}

export interface Task {
  id: number;
  title: string;
  desc: string | null;
  done: boolean;
  progress?: number;
  folder?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  folder?: string;
  progress?: number;
}

export interface EditTaskInput {
  id: number;
  title: string;
  desc: string | null;
  folder?: string;
  progress?: number;
}
