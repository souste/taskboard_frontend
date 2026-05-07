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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id.toString(),
  });

  const confirmDelete = () => {
    handleDelete(column.id);
    setShowDeleteModal(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={`flex max-h-[80vh] w-[85vw] shrink-0 snap-center flex-col rounded-lg border bg-white p-3 shadow-sm transition-all duration-200 md:w-80 ${
        isOver ? 'scale-[1.01] border-slate-200 shadow-md' : 'border-slate-100'
      }`}
    >
      <div className="mb-3 flex shrink-0 items-start justify-between">
        <div className="flex items-start gap-2">
          <div
            {...dragAttributes}
            {...dragListeners}
            className="cursor-grab text-lg text-gray-400 select-none"
          >
            ⋮⋮
          </div>
          <p className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
            {column.name}
          </p>
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
                    setShowDeleteModal(true);
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

      <div className="custom-scrollbar min-h-[100px] grow overflow-y-auto pr-2 pb-4">
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          columnId={column.id}
          activeTask={activeTask}
        />
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
            <h3 className="text-lg font-bold text-slate-800">Delete List?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-slate-700">
                "{column.name}"
              </span>
              ? All tasks inside this list will be permanently removed.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-md px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700 active:scale-95"
              >
                Delete List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
