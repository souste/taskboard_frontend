import { useState, useEffect } from 'react';
import type {
  Task,
  TaskBody,
  ChangeEvent,
  FormEvent,
} from '../types/task.types';

type Values = {
  title: string;
  description: string | null;
  completed: boolean;
  column_id: number | null;
};

type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  position: number;
  created_at: string;
  updated_at: string;
};

type TaskFormProps = {
  onSubmit: (values: Values) => void;
  task: Task | null;
  columnId: number;
  setEditTask?: (value: boolean) => void;
  mode?: 'create' | 'edit';
};

export default function TaskForm({
  task,
  setEditTask,
  onSubmit,
  columnId,
  mode = 'create',
}: TaskFormProps) {
  const [values, setValues] = useState<Values>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    column_id: task?.column_id ?? columnId,
    completed: task?.completed ?? false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setValues({
      title: task?.title ?? '',
      description: task?.description ?? '',
      column_id: task?.column_id ?? columnId,
      completed: task?.completed ?? false,
    });
  }, [task, columnId]);

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError('A title is required');
      return;
    }

    onSubmit(values);
    setError(' ');

    if (mode === 'create') {
      setValues({
        title: '',
        description: '',
        column_id: columnId,
        completed: false,
      });
    } else {
      setEditTask?.(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className={isEdit ? 'w-full' : 'p-1'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && <p className="text-xs font-bold text-red-500">{error}</p>}

        <div className={isEdit ? 'space-y-4' : 'space-y-1'}>
          <textarea
            name="title"
            maxLength={100}
            value={values.title}
            onChange={handleChange}
            placeholder={
              isEdit ? 'Task Title' : 'Enter a title for this card...'
            }
            rows={1}
            className={`w-full resize-none overflow-hidden rounded-md border-none bg-white p-2 text-sm shadow-sm ring-1 ring-slate-200 ring-inset focus:ring-2 focus:ring-slate-800 ${
              isEdit ? 'text-lg font-bold' : 'text-sm font-medium'
            }`}
          />

          {isEdit && (
            <textarea
              name="description"
              maxLength={500}
              value={values.description ?? ''}
              onChange={handleChange}
              placeholder="Add a more detailed description..."
              rows={4}
              className="w-full resize-none rounded-md border-none bg-slate-50 p-3 text-sm text-slate-700 shadow-inner ring-1 ring-slate-200 ring-inset focus:ring-2 focus:ring-slate-800"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            className={`rounded-md bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-900 active:scale-95`}
          >
            {isEdit ? 'Save Changes' : 'Add Card'}
          </button>

          {isEdit ? (
            <button
              type="button"
              onClick={() => setEditTask?.(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          ) : (
            values.title.length > 0 && (
              <button
                type="button"
                onClick={() => setValues({ ...values, title: '' })}
                className="text-xs text-slate-400 hover:text-red-500"
              >
                Clear
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}
