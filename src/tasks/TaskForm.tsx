import type { ChangeEvent } from 'react';
import { useState, useEffect } from 'react';

type Values = {
  title: string;
  description: string | null;
  column_id: number | null;
};

type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string | null;
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
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setValues({
      title: task?.title ?? '',
      description: task?.description ?? '',
      column_id: task?.column_id ?? columnId,
    });
  }, [task, columnId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);

    if (mode === 'create') {
      setValues({
        title: '',
        description: '',
        column_id: columnId,
      });
    }

    if (mode === 'edit') {
      setEditTask?.(false);
    }
  };

  return (
    <div className={mode === 'edit' ? 'space-y-4' : 'space-y-2'}>
      {error && <p className="text-red-500">{error}</p>}

      <form
        className={mode === 'edit' ? 'flex flex-col gap-4' : 'flex flex-col'}
        onSubmit={handleSubmit}
      >
        <textarea
          name="title"
          type="text"
          value={values.title}
          onChange={handleChange}
          placeholder="Enter a title"
          className={
            mode === 'edit'
              ? 'w-full rounded border p-2 text-lg'
              : 'mt-2 mb-2 block rounded bg-white p-1 py-1'
          }
        ></textarea>

        {mode === 'edit' && (
          <textarea
            name="description"
            type="text"
            value={values.description}
            onChange={handleChange}
            placeholder="Task description"
            className="w-full rounded border p-2 text-base"
          ></textarea>
        )}

        <div className={mode === 'edit' ? 'flex gap-3' : ''}>
          <button
            className={
              mode === 'edit'
                ? 'rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-400'
                : 'cursor-pointer rounded bg-blue-500 px-2 py-1 font-semibold text-white transition-colors hover:bg-blue-400'
            }
          >
            Submit
          </button>
          {mode === 'edit' && (
            <button
              type="button"
              onClick={() => setEditTask?.(false)}
              className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
