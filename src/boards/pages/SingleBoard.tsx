import Columns from '../../columns/Columns';
import { useState, useEffect } from 'react';
import { getColumns } from '../../api/column';
import { getTasks } from '../../api/task';
import type { DragEndEvent } from '@dnd-kit/react';

type Column = {
  id: number;
  user_id: number;
  name: string;
  position: number;
  created_at: string;
};

type Task = {
  id: number;
  user_id: number;
  column_id: number;
  title: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export default function SingleBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        setLoading(true);
        setErrors('');

        const result = await getColumns();
        if (result.errors) {
          setErrors(result.errors.error);
          setColumns([]);
        } else {
          setColumns(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch columns', err);
        setErrors('Failed to fetch columns');
      } finally {
        setLoading(false);
      }
    };
    fetchColumns();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setErrors('');

        const result = await getTasks();
        if (result.errors) {
          setErrors(result.errors.error);
          setTasks([]);
        } else {
          setTasks(result.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
        setErrors('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const taskId = active.id as string;
  //   const newColumnId = over.id as Task['column_id'];

  //   setTasks(() =>
  //     tasks.map((task) =>
  //       task.id === taskId
  //         ? {
  //             ...task,
  //             column_id: newColumnId,
  //             //api call here??
  //           }
  //         : task,
  //     ),
  //   );
  // };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;
  return (
    <>
      <h1>MVP Board</h1>

      <Columns
        columns={columns}
        setColumns={setColumns}
        tasks={tasks}
        setTasks={setTasks}
      />
    </>
  );
}
