import { useState } from 'react';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { getTasks, createTask } from '../api/task';
import type { TaskListProps, TaskBody } from '../types/task.types';
import { Plus, Minus } from 'lucide-react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TaskList({
  tasks,
  setTasks,
  columnId,
  activeTask,
}: TaskListProps) {
  const [formOpen, setFormOpen] = useState(false);
  const handleCreate = async (values: TaskBody) => {
    const tasksInColumn = tasks.filter((t) => t.column_id === columnId);
    const newPosition = tasksInColumn.length;

    const response = await createTask({
      ...values,
      position: newPosition,
      column_id: columnId,
    });
    const newTask = response.data;
    if (!newTask) return;
    setTasks((prev) => [...prev, newTask]);
  };

  const refreshTasks = async () => {
    const result = await getTasks();
    setTasks(result.data);
  };

  const tasksInColumn = tasks
    .filter((task) => task.column_id === columnId)
    .sort((a, b) => a.position - b.position);

  const sortableItems =
    activeTask && activeTask.column_id !== columnId
      ? [...tasksInColumn.map((t) => t.id.toString()), activeTask.id.toString()]
      : tasksInColumn.map((t) => t.id.toString());

  return (
    <div className="rounded-lg bg-gray-50 p-3 shadow-sm">
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        {tasksInColumn.map((task) => (
          <TaskCard task={task} key={task.id} refreshTasks={refreshTasks} />
        ))}

        <div
          className="mt-1 flex cursor-pointer items-center gap-1 rounded px-2 py-1 text-gray-600 transition hover:bg-gray-200"
          onClick={() => setFormOpen(!formOpen)}
        >
          <div className="flex items-center gap-1">
            {formOpen ? <Minus size={16} /> : <Plus size={16} />}

            <span>Add a card</span>
          </div>
        </div>

        {formOpen && (
          <div>
            <TaskForm
              mode="create"
              onSubmit={handleCreate}
              columnId={columnId}
            />
          </div>
        )}
      </SortableContext>
    </div>
  );
}
