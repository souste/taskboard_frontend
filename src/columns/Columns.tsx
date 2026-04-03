import { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
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

type ColumnProps = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
};

type Values = {
  name: string;
  position: number | null;
};

export default function Columns({
  columns,
  setColumns,
  tasks,
  setTasks,
}: ColumnProps) {
  const [editColumnId, setEditColumnId] = useState<number | null>(null);

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

  return (
    <div className="flex justify-center">
      <div className="flex gap-6">
        {columns.map((column) => {
          const { setNodeRef } = useDroppable({
            id: column.id,
          });
          return (
            <div
              key={column.id}
              ref={setNodeRef}
              className="min-h-[200px] w-64 rounded bg-gray-300 p-2"
            >
              <p className="mb-4 font-bold">{column.name}</p>
              <TaskList
                tasks={tasks}
                setTasks={setTasks}
                columnId={column.id}
              />
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
