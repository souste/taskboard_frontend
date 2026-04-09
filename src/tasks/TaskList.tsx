import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { createTask } from '../api/task';
import type { TaskListProps, TaskBody } from '../types/task.types';
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

  const tasksInColumn = tasks
    .filter((task) => task.column_id === columnId)
    .sort((a, b) => a.position - b.position);

  const sortableItems =
    activeTask && activeTask.column_id !== columnId
      ? [...tasksInColumn.map((t) => t.id.toString()), activeTask.id.toString()]
      : tasksInColumn.map((t) => t.id.toString());

  return (
    <div>
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        {tasksInColumn.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}

        <p>Add Another Task:</p>
        <TaskForm onSubmit={handleCreate} columnId={columnId} />
      </SortableContext>
    </div>
  );
}
