import TaskList from '../tasks/TaskList';
import ColumnForm from './ColumnForm';
import { useDroppable } from '@dnd-kit/core';

export default function ColumnCard({
  column,
  tasks,
  setTasks,
  editColumnId,
  setEditColumnId,
  handleCreate,
  handleUpdate,
  handleDelete,
  handleEdit,
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });
  return (
    <div>
      <div
        key={column.id}
        ref={setNodeRef}
        className="w-64 rounded bg-gray-300 p-2"
      >
        <p className="mb-4 font-bold">{column.name}</p>
        <TaskList tasks={tasks} setTasks={setTasks} columnId={column.id} />
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
    </div>
  );
}
