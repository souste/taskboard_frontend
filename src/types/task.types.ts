export type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string;
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
  column_id: number;
};

export type TaskCardProps = {
  task: Task;
};
