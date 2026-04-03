import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { getTasks, createTask } from '../api/task';

type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
};

type TaskListProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columnId: number;
};

type Values = {
  title: string;
  description: string;
  position: number | null;
};

export default function TaskList({ tasks, setTasks, columnId }: TaskListProps) {
  // const [loading, setLoading] = useState(true);
  // const [errors, setErrors] = useState('');

  const handleCreate = async (values: Values) => {
    await createTask(values);
    const result = await getTasks();
    setTasks(result.data || []);
  };

  // if (loading) return <p>Loading...</p>;
  // if (errors) return <p>{errors}</p>;

  return (
    <div>
      {tasks
        .filter((task) => task.column_id === columnId)
        .map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}

      <p>Add Another Task:</p>
      <TaskForm onSubmit={handleCreate} columnId={columnId} />
    </div>
  );
}
