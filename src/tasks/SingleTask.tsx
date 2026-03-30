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
    <div className="flex justify-center pt-10">
      <div className="flex max-w-3xl gap-8 border p-6 wrap-break-word">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">{task?.title}</h1>
          <p className="mb-3">Description:</p>
          <p>{task?.description}</p>
          <button className="bg-yellow-500" onClick={() => navigate('/board')}>
            Back
          </button>
        </div>
        <div>
          <p className="mb-4">[***Create Comment***]</p>
          <p className="mb-2">Comments:</p>
          <p className="mb-4">"Sample comments here"</p>
          <p>
            Task Created:
            {task?.created_at
              ? new Date(task.created_at).toLocaleString()
              : 'No date available'}
          </p>
        </div>
      </div>
    </div>
  );
}
