import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTask, updateTask, deleteTask, toggleTask } from '../api/task';
import type { Task, TaskBody } from '../types/task.types';
import TaskForm from './TaskForm';
import CommentList from '../comments/CommentList';

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

  const handleToggle = async () => {
    if (!task) return;
    try {
      const newStatus = !task.completed;
      await toggleTask(task.id, { ...task, completed: newStatus });

      setTask({ ...task, completed: newStatus });

      if (refreshTasks) refreshTasks();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;

  return (
    <div className="flex h-[600px] max-h-[85vh] flex-col overflow-hidden">
      <div className="border-b border-slate-100 px-8 py-6">
        {!editTask ? (
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {task?.title}
            </h1>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditTask(true)}
                className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Edit
              </button>
              <button
                onClick={() => task && handleDelete(task.id)}
                className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-xl font-semibold text-slate-400 italic">
            Editing task...
          </h1>
        )}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!editTask ? (
            <div className="space-y-8">
              <section>
                <h3 className="mb-3 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Description
                </h3>
                <p className="leading-relaxed whitespace-pre-wrap text-gray-800">
                  {task?.description || 'No description provided.'}
                </p>
              </section>

              <hr className="border-slate-100" />

              <section>
                <CommentList taskId={id} />
              </section>
            </div>
          ) : (
            <TaskForm
              mode="edit"
              task={task}
              columnId={task?.column_id}
              setEditTask={setEditTask}
              onSubmit={(values) => handleUpdate(id, values)}
            />
          )}
        </div>

        <div className="w-64 border-l border-slate-100 bg-slate-50/50 px-6 py-8">
          <h4 className="mb-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Task Details
          </h4>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-medium text-slate-400 uppercase">
                Status
              </span>
              <label className="group flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={task?.completed || false}
                  onChange={handleToggle}
                  className="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    task?.completed ? 'text-green-600' : 'text-slate-600'
                  }`}
                >
                  {task?.completed ? 'Completed' : 'In Progress'}
                </span>
              </label>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-slate-400 uppercase">
                Task Created
              </span>
              <span className="text-sm text-slate-600">
                {task?.created_at
                  ? new Date(task.created_at).toLocaleString()
                  : 'No date available'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
