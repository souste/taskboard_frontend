import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { createTask } from '../api/task';
import type { TaskListProps, TaskBody } from '../types/task.types';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TaskList({ tasks, setTasks, columnId }: TaskListProps) {
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

  const tasksInColumn = tasks.filter((task) => task.column_id === columnId);

  return (
    <div>
      <SortableContext
        items={tasksInColumn.map((task) => task.id.toString())}
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
