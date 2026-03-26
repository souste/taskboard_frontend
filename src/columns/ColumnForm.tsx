import type { ChangeEvent } from 'react';
import { createColumn } from '../api/column';
import { useState } from 'react';
import { getColumns } from '../api/column';

type Values = {
  name: string;
  position: number | null;
};

export default function ColumnForm({ setColumns }) {
  const [values, setValues] = useState<Values>({
    name: '',
    position: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: name === 'position' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (values.position === null) {
      setError('Position is required');
      setIsSubmitting(false);
      return;
    }

    const success = await createColumn(values);

    if (!success) {
      setError('Invalid credentials');
      setIsSubmitting(false);
      return;
    }
    const result = await getColumns();
    setColumns(result.data || []);
  };
  return (
    <>
      <h3>Column Form</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          placeholder="Column name"
        />
        <input
          name="position"
          type="number"
          onChange={handleChange}
          placeholder="Column Position"
        />
        <button disabled={isSubmitting}>
          {isSubmitting ? 'Creating Column' : 'Create Column'}
        </button>
      </form>
    </>
  );
}
