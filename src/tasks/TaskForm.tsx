import type { ChangeEvent } from 'react';
import { useState } from 'react';

type Values = {
  title: string;
  description: string;
  position: number | null;
  column_id: number | null;
};

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
    position: task?.position ?? null,
    column_id: task?.column_id ?? columnId,
  });
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as keyof Values;
    setValues((prev) => ({
      ...prev,
      [field]: field === 'position' ? Number(value) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.position === null) {
      setError('Position is required');
      return;
    }
    onSubmit(values);
    if (!task) {
      setValues({
        title: '',
        description: '',
        position: null,
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
          <input
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Task name"
          />
          <input
            name="description"
            type="text"
            value={values.description}
            onChange={handleChange}
            placeholder="Task description"
          />
          <input
            name="position"
            type="number"
            value={values.position ?? ''}
            onChange={handleChange}
            placeholder="Task position"
          />
        </div>
        <button className="bg-green-500">Submit</button>
        <button onClick={() => setEditTask(false)}>Cancel</button>
      </form>
    </div>
  );
}
