import { Link } from 'react-router-dom';
import TaskForm from './TaskForm';
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
          <Link
            key={task.id}
            className="mb-3 block rounded bg-gray-100 p-3 shadow-md"
            to={`/tasks/${task.id}`}
          >
            <h3 className="font-semibold wrap-break-word">{task.title}</h3>
          </Link>
        ))}
      <p>Add Another Task:</p>
      <TaskForm onSubmit={handleCreate} columnId={columnId} />
    </div>
  );
}
