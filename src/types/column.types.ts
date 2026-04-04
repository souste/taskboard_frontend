import type { Task } from '../types/task.types';

export type Column = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

export type ColumnProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

export type ColumnBody = {
  name: string;
  position: number | null;
};
