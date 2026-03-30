import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTask } from '../api/task';

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

export default function SingleTask() {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const { taskId } = useParams();
  const id = Number(taskId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setErrors('Invalid task ID');
      setLoading(false);
      return;
    }
    const fetchTask = async () => {
      try {
        setLoading(true);
        setErrors('');

        const result = await getTask(id);
        if (result.errors) {
          setErrors(result.errors.error);
          setTask(null);
        } else {
          setTask(result.data || null);
        }
      } catch (err) {
        console.error('Failed to fetch task', err);
        setErrors('Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div className="flex justify-center">
      <div>
        <h1>{task?.title}</h1>
        <p>{task?.description}</p>
        <p>
          {task?.created_at
            ? new Date(task.created_at).toLocaleString()
            : 'No date available'}
        </p>
        <p>Comments can go next</p>
        <button onClick={() => navigate('/board')}>Back</button>
      </div>
    </div>
  );
}
