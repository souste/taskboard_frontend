import type { ChangeEvent } from 'react';
import { useState } from 'react';

type Values = {
  name: string;
  position: number | null;
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
  setEditColumnId: (value: number | null) => void;
};

export default function ColumnForm({
  column,
  setEditColumnId,
  onSubmit,
}: ColumnFormProps) {
  const [values, setValues] = useState<Values>({
    name: column?.name ?? '',
    position: column?.position ?? null,
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
    if (!column) {
      setValues({
        name: '',
        position: null,
      });
    }

    setEditColumnId(null);
  };
  return (
    <>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          value={values.name}
          onChange={handleChange}
          placeholder="Column name"
          className="bg-white"
        />
        <input
          name="position"
          type="number"
          value={values.position ?? ''}
          onChange={handleChange}
          placeholder="Column Position"
          className="bg-white"
        />
        <button className="bg-green-500">Submit</button>
      </form>
    </>
  );
}
