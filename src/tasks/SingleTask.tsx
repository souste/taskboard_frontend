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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const handleDelete = (id: number) => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!task) return;

    try {
      await deleteTask(task.id);
      setShowDeleteModal(false);

      if (refreshTasks) {
        await refreshTasks();
      }
      navigate('/board');
    } catch (err) {
      console.error('Failed to delete', err);
    }
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
    <div className="flex h-full max-h-[90vh] w-full flex-col overflow-hidden md:max-h-[800px]">
      <div className="shrink-0 border-b border-slate-100 px-8 py-6">
        {!editTask ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              {task?.title}
            </h1>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditTask(true)}
                className="flex-1 rounded-md bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 md:flex-none md:px-3 md:py-1.5"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-md bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 md:flex-none md:px-3 md:py-1.5"
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

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="flex-1 overflow-y-auto px-8 py-6 pb-10">
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

        <div className="w-full border-t border-slate-100 bg-slate-50/50 px-6 py-8 md:w-64 md:border-t-0 md:border-l">
          <h4 className="mb-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
            Task Details
          </h4>

          <div className="flex flex-row flex-wrap gap-8 md:flex-col md:gap-6">
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Delete Task?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-700">
                "{task?.title}"
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
