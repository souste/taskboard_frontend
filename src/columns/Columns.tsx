import { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import { getColumns } from '../api/column';

type Column = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

export default function Columns() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getColumns();
        if (result.errors) {
          setError(result.errors.error);
          setColumns([]);
        } else {
          setColumns(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch columns', err);
        setError('Failed to fetch columns');
      } finally {
        setLoading(false);
      }
    };
    fetchColumns();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      {columns.map((column) => (
        <div key={column.id} className="bg-gray-300">
          <h2 className="font-bold">{column.name}</h2>
          <TaskList columnId={column.id} />
        </div>
      ))}
    </>
  );
}
