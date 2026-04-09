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
  activeTask?: Task | null;
};

export type ColumnBody = {
  name: string;
  position: number | null;
};

export type ColumnCardProps = {
  column: Column;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  editColumnId: number | null;
  setEditColumnId: React.Dispatch<React.SetStateAction<number | null>>;
  handleCreate: (values: ColumnBody) => Promise<void>;
  handleUpdate: (id: number, values: ColumnBody) => Promise<void>;
  handleDelete: (id: number) => Promise<void>;
  handleEdit: (id: number) => void;
  activeTask?: Task | null;
};
