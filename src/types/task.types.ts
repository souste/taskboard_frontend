export type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

export type TaskListProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columnId: number;
  activeTask?: Task | null;
};

export type TaskBody = {
  title: string;
  description: string;
  position: number | null;
  completed: boolean;
  column_id: number;
};

export type TaskCardProps = {
  task: Task;
};

export type TaskValues = {
  title: string;
  description: string | null;
  completed: boolean;
  column_id: number | null;
};

export type TaskFormProps = {
  onSubmit: (values: TaskValues) => void;
  task: Task | null;
  columnId: number;
  setEditTask?: (value: boolean) => void;
  mode?: 'create' | 'edit';
};
