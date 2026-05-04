import type { ChangeEvent } from 'react';
import { useState } from 'react';

type Values = {
  name: string;
};

type Column = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};
type ColumnFormProps = {
  onSubmit: (values: Values) => void;
  column?: Column | null;
  setEditColumnId?: (value: number | null) => void;
};

export default function ColumnForm({
  column,
  setEditColumnId,
  onSubmit,
}: ColumnFormProps) {
  const [values, setValues] = useState<Values>({
    name: column?.name ?? '',
  });

  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.name.trim()) {
      setError('Column name cannot be empty');
      return;
    }

    setError('');

    onSubmit(values);
    if (!column) {
      setValues({
        name: '',
      });
    }

    setEditColumnId?.(null);
  };
  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
      {error && <p className="text-sm text-red-500">{error}</p>}

      <input
        name="name"
        type="text"
        maxLength={100}
        value={values.name}
        onChange={handleChange}
        placeholder="Enter list name"
        className="rounded bg-white p-1 text-sm"
      ></input>

      <div className="flex gap-2">
        <button className="flex-1 rounded bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
          {column ? 'Update List' : 'Add List'}
        </button>
        {column && (
          <button
            type="button"
            className="rounded bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-300"
            onClick={() => setEditColumnId?.(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
