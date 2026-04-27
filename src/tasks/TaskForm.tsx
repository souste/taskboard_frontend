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
};

export default function TaskForm({
  task,
  setEditTask,
  onSubmit,
  columnId,
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
    if (!task) {
      setValues({
        title: '',
        description: '',
        column_id: columnId,
      });
    }
    setEditTask?.(false);
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <textarea
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Enter a title"
            className="mt-2 mb-2 block rounded bg-white px-2 py-1"
          ></textarea>

          {task && (
            <input
              name="description"
              type="text"
              value={values.description}
              onChange={handleChange}
              placeholder="Task description"
            />
          )}
        </div>
        <button className="cursor-pointer rounded bg-blue-500 px-2 py-1 font-semibold text-white transition-colors hover:bg-blue-400">
          Submit
        </button>
        {task && (
          <button type="button" onClick={() => setEditTask?.(false)}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
}
