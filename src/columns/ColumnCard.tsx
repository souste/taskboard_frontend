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
      className={`flex max-h-[80vh] w-80 flex-col rounded-lg border p-3 transition-all duration-200 ${
        isOver
          ? 'border-orange-300 bg-orange-50 shadow-md'
          : 'border-transparent bg-white shadow-sm'
      }`}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between">
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

        <div className="relative">
          <div
            className="cursor-pointer text-gray-400 transition-colors hover:text-slate-700"
            onClick={() => setDropDownOpen(!dropDownOpen)}
          >
            <MoreHorizontal />
          </div>

          {dropDownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropDownOpen(false)}
              />
              <div className="ring-opacity-5 absolute right-0 z-20 mt-2 w-32 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black focus:outline-none">
                <button
                  onClick={() => {
                    handleEdit(column.id);
                    setDropDownOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    handleDelete(column.id);
                    setDropDownOpen(false);
                  }}
                  className="flex w-full items-center rounded-sm px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {editColumnId === column.id && (
        <ColumnForm
          column={column}
          setEditColumnId={setEditColumnId}
          onSubmit={(values) => handleUpdate(column.id, values)}
        />
      )}

      <div className="custom-scrollbar grow overflow-y-auto pr-2">
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          columnId={column.id}
          activeTask={activeTask}
        />
      </div>
    </div>
  );
}
