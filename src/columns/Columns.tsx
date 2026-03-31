import { useState, useEffect } from 'react';
import TaskList from '../tasks/TaskList';
import ColumnForm from './ColumnForm';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '../api/column';

type Column = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

type Values = {
  name: string;
  position: number | null;
};

export default function Columns() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editColumnId, setEditColumnId] = useState<number | null>(null);

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

  const handleCreate = async (values: Values) => {
    await createColumn(values);
    const result = await getColumns();
    setColumns(result.data || []);
  };

  const handleUpdate = async (columnId: number, values: Values) => {
    await updateColumn(columnId, values);
    const result = await getColumns();
    setColumns(result.data || []);
  };

  const handleEdit = (columnId: number) => {
    setEditColumnId(columnId);
  };

  const handleDelete = async (columnId: number) => {
    if (!confirm('Are you sure you want to delete this column?')) return;
    await deleteColumn(columnId);
    const result = await getColumns();
    setColumns(result.data || []);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex justify-center">
      <div className="flex gap-6">
        {columns.map((column) => (
          <div key={column.id} className="w-64 rounded bg-gray-300 p-2">
            <p className="mb-4 font-bold">{column.name}</p>
            <TaskList columnId={column.id} />
            <div className="space-x-4">
              <button
                onClick={() => handleEdit(column.id)}
                className="bg-yellow-500"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(column.id)}
                className="bg-red-500"
              >
                Delete
              </button>
            </div>
            {editColumnId === column.id && (
              <ColumnForm
                column={column}
                setEditColumnId={setEditColumnId}
                onSubmit={(values) => handleUpdate(column.id, values)}
              />
            )}
          </div>
        ))}
        <div className="w-64 rounded bg-gray-300/30 p-2">
          <p className="mb-2">Add another List:</p>
          <ColumnForm onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  );
}
