import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../api/task';
import type { Task, TaskBody } from '../types/task.types';
import TaskForm from './TaskForm';
import CommentList from '../comments/CommentList';
import { Plus } from 'lucide-react';

export default function SingleTask({ taskId, refreshTasks }) {
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
    if (!task) return;
    await updateTask(id, {
      title: values.title,
      description: values.description,
      position: task?.position,
      column_id: task.column_id,
    });
    const result = await getTask(id);
    setTask(result.data || null);

    if (refreshTasks) {
      await refreshTasks();
    }
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
      <div className="flex w-full gap-10 p-6">
        <div className="flex-1 pr-6">
          {!editTask && (
            <div className="mb-6">
              <h1 className="mb-4 text-2xl font-bold">{task?.title}</h1>

              <button
                onClick={() => setEditTask(true)}
                className="mb-4 rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
              >
                Edit Card
              </button>

              <button
                onClick={() => task && handleDelete(task.id)}
                className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              >
                Delete
              </button>

              <p className="mb-1 text-xs font-semibold text-gray-500 uppercase">
                Description:
              </p>

              <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                {task?.description}
              </p>
            </div>
          )}

          {editTask && (
            <TaskForm
              mode="edit"
              task={task}
              columnId={task?.column_id}
              setEditTask={setEditTask}
              onSubmit={(values) => handleUpdate(id, values)}
            />
          )}
        </div>
        <div className="w-64">
          <div>
            <CommentList taskId={id} />
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
