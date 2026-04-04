import TaskForm from './TaskForm';
import TaskCard from './TaskCard';
import { createTask } from '../api/task';
import type { TaskListProps, TaskBody } from '../types/task.types';

export default function TaskList({ tasks, setTasks, columnId }: TaskListProps) {
  const handleCreate = async (values: TaskBody) => {
    const response = await createTask(values);
    const newTask = response.data;
    if (!newTask) return;
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div>
      {tasks
        .filter((task) => task.column_id === columnId)
        .map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}

      <p>Add Another Task:</p>
      <TaskForm onSubmit={handleCreate} columnId={columnId} />
    </div>
  );
}
