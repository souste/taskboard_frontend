import TaskList from '../tasks/TaskList';
import ColumnForm from './ColumnForm';
import { useDroppable } from '@dnd-kit/core';
import type { ColumnCardProps } from '../types/column.types';

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
      <div className="mb-4 flex items-center justify-between">
        <p className="font-bold">{column.name}</p>

        <div
          {...dragAttributes}
          {...dragListeners}
          className="cursor-grab p-1 text-gray-500"
        >
          ⋮⋮
        </div>
      </div>

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        columnId={column.id}
        activeTask={activeTask}
      />
      <div className="space-x-4">
        <button onClick={() => handleEdit(column.id)} className="bg-yellow-500">
          Update
        </button>
        <button onClick={() => handleDelete(column.id)} className="bg-red-500">
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
}
