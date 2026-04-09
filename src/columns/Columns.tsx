import { useState } from 'react';
import type { ColumnBody, ColumnProps } from '../types/column.types';
import ColumnCard from './ColumnCard';
import ColumnForm from './ColumnForm';
import {
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '../api/column';
import SortableColumn from './SortableColumn';

export default function Columns({
  columns,
  setColumns,
  tasks,
  setTasks,
  activeTask,
}: ColumnProps) {
  const [editColumnId, setEditColumnId] = useState<number | null>(null);

  const handleCreate = async (values: ColumnBody) => {
    const position = columns.length;
    await createColumn({ ...values, position: position });
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
        <SortableContext
          items={columns.map((c) => c.id.toString())}
          strategy={horizontalListSortingStrategy}
        >
          {columns.map((column) => {
            return (
              <SortableColumn column={column} key={column.id}>
                {({ attributes, listeners }) => (
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
                    activeTask={activeTask}
                    dragAttributes={attributes}
                    dragListeners={listeners}
                  />
                )}
              </SortableColumn>
            );
          })}
        </SortableContext>
        <div className="w-64 rounded bg-gray-300/30 p-2">
          <p className="mb-2">Add another List:</p>
          <ColumnForm onSubmit={handleCreate} />
        </div>
      </div>
    </div>
  );
}
