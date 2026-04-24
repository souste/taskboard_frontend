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
      className={`w-64 rounded bg-gray-300 p-2 ${
        isOver ? 'bg-green-400' : 'bg-gray-300'
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div
          {...dragAttributes}
          {...dragListeners}
          className="cursor-grab p-1 text-gray-500"
        >
          ⋮⋮
        </div>
        <p className="font-bold">{column.name}</p>

        <div onClick={() => setDropDownOpen(!dropDownOpen)}>
          <MoreHorizontal />
        </div>

        {dropDownOpen && (
          <div>
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
          </div>
        )}
      </div>

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        columnId={column.id}
        activeTask={activeTask}
      />

      {editColumnId === column.id && (
        <ColumnForm
          column={column}
          setEditColumnId={setEditColumnId}
          onSubmit={(values) => handleUpdate(column.id, values)}
        />
      )}
    </div>
  );
}
