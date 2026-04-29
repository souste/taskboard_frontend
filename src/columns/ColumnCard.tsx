import { useState } from 'react';
import TaskList from '../tasks/TaskList';
import ColumnForm from './ColumnForm';
import { useDroppable } from '@dnd-kit/core';
import type { ColumnCardProps } from '../types/column.types';
import { MoreHorizontal } from 'lucide-react';

export default function ColumnCard({
  column,
  tasks,
  setTasks,
  editColumnId,
  setEditColumnId,
  handleUpdate,
  handleDelete,
  handleEdit,
  activeTask,
  dragAttributes,
  dragListeners,
}: ColumnCardProps) {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id.toString(),
  });
  return (
    <div
      ref={setNodeRef}
      className={`w-72 rounded-lg border p-3 transition-all duration-200 ${
        isOver
          ? 'border-orange-300 bg-orange-50 shadow-md'
          : 'border-transparent bg-white shadow-sm'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...dragAttributes}
            {...dragListeners}
            className="cursor-grab text-lg text-gray-400 select-none"
          >
            ⋮⋮
          </div>
          <p className="font-semibold text-gray-800">{column.name}</p>
        </div>

        <div
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={() => setDropDownOpen(!dropDownOpen)}
        >
          <MoreHorizontal />
        </div>

        {dropDownOpen && (
          <div className="absolute right-4 z-10 mt-10 space-y-2 rounded-md bg-white p-2 shadow-md">
            <button
              onClick={() => handleEdit(column.id)}
              className="block w-full rounded bg-yellow-400 px-3 py-1 text-sm font-medium hover:bg-yellow-300"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(column.id)}
              className="block w-full rounded bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-400"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editColumnId === column.id && (
        <ColumnForm
          column={column}
          setEditColumnId={setEditColumnId}
          onSubmit={(values) => handleUpdate(column.id, values)}
        />
      )}

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        columnId={column.id}
        activeTask={activeTask}
      />
    </div>
  );
}
