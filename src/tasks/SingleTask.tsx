import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../api/task';
import type { Task, TaskBody } from '../types/task.types';
import TaskForm from './TaskForm';
import CommentList from '../comments/CommentList';

export default function SingleTask({ taskId }) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [editTask, setEditTask] = useState(false);
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

  const handleUpdate = async (id: number, values: TaskBody) => {
    await updateTask(id, values);
    const result = await getTask(id);
    setTask(result.data || null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    await deleteTask(id);
    navigate('/board');
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div className="flex justify-center pt-10">
      <div className="flex max-w-3xl gap-8 border p-6 wrap-break-word">
        <div className="flex-1">
          <h1 className="mb-4 text-2xl font-bold">{task?.title}</h1>
          <p className="mb-3">Description:</p>
          <p>{task?.description}</p>
          <button className="bg-gray-500" onClick={() => navigate('/board')}>
            Back
          </button>
          <button onClick={() => setEditTask(true)} className="bg-yellow-500">
            Update
          </button>
          <button
            onClick={() => task && handleDelete(task.id)}
            className="bg-red-500"
          >
            Delete
          </button>
          {editTask && (
            <TaskForm
              task={task}
              setEditTask={setEditTask}
              onSubmit={(values) => handleUpdate(id, values)}
            />
          )}
        </div>
        <div>
          <div>
            <CommentList taskId={taskId} />
          </div>
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
