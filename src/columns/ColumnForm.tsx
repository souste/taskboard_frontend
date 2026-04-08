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

    onSubmit(values);
    if (!column) {
      setValues({
        name: '',
      });
    }

    setEditColumnId?.(null);
  };
  return (
    <div>
      <div className="flex flex-col">
        {error && <p>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-2 flex flex-col gap-2">
            <input
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              placeholder="Column name"
              className="border bg-white"
            />
          </div>
          <button className="bg-green-500">Submit</button>
          {column && (
            <button onClick={() => setEditColumnId?.(null)}>Cancel</button>
          )}
        </form>
      </div>
    </div>
  );
}
