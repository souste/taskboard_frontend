import { useState } from 'react';
import type { ColumnBody, ColumnProps } from '../types/column.types';
import ColumnCard from './ColumnCard';
import ColumnForm from './ColumnForm';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '../api/column';

export default function Columns({
  columns,
  setColumns,
  tasks,
  setTasks,
}: ColumnProps) {
  const [editColumnId, setEditColumnId] = useState<number | null>(null);

  const handleCreate = async (values: ColumnBody) => {
    await createColumn(values);
    const result = await getColumns();
    setColumns(result.data || []);
  };

  const handleUpdate = async (columnId: number, values: ColumnBody) => {
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

  return (
    <div className="flex justify-center">
      <div className="flex gap-6">
        {columns.map((column) => {
          return (
            <ColumnCard
              key={column.id}
              column={column}
              tasks={tasks}
              setTasks={setTasks}
              editColumnId={editColumnId}
              setEditColumnId={setEditColumnId}
              handleCreate={handleCreate}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          );
        })}
        <div className="w-64 rounded bg-gray-300/30 p-2">
          <p className="mb-2">Add another List:</p>
          <ColumnForm onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  );
}
