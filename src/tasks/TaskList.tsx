import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../api/task';

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
  columnId: number;
};

export default function TaskList({ columnId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setErrors('');

        const result = await getTasks();
        if (result.errors) {
          setErrors(result.errors.error);
          setTasks([]);
        } else {
          setTasks(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        setErrors('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div>
      {tasks
        .filter((task) => task.column_id === columnId)
        .map((task) => (
          <Link
            key={task.id}
            className="mb-5 block rounded bg-gray-100 p-3 shadow-md"
            to={`/tasks/${task.id}`}
          >
            <h3 className="font-semibold wrap-break-word">{task.title}</h3>
          </Link>
        ))}
    </div>
  );
}
