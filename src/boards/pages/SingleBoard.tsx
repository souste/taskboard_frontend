import Columns from '../../columns/Columns';
import { useState, useEffect } from 'react';
import { getColumns } from '../../api/column';
import { getTasks, updateTask } from '../../api/task';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import type { Column } from '../../types/column.types';
import type { Task } from '../../types/task.types';

export default function SingleBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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

  const handleDragStart = (event) => {
    const taskId = Number(event.active.id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const overId = over.id;

    console.log('active:', active.id, 'over:', over?.id);

    const overIsTask = tasks.some((task) => task.id.toString() === overId);

    const overIsColumn = columns.some(
      (column) => column.id.toString() === overId,
    );

    // if (overIsTask) {
    //   const newTaskId = Number(overId);
    //   setTasks(() =>
    //     tasks.map((task) =>
    //       task.id === taskId
    //         ? {
    //             ...task,
    //             id: newTaskId,
    //           }
    //         : task,
    //     ),
    //   );
    //   await updateTask(taskId, {
    //     ...tasks.find((task) => task.id === taskId)!,
    //     [CHANGE!!!]: newTaskId,
    //   });
    //   const tasksResult = await getTasks();
    //   setTasks(tasksResult.data || []);
    // }

    if (overIsColumn) {
      const newColumnId = Number(overId);
      console.log('newColumnId', newColumnId);
      setTasks(() =>
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                column_id: newColumnId,
              }
            : task,
        ),
      );
      await updateTask(taskId, {
        ...tasks.find((task) => task.id === taskId)!,
        column_id: newColumnId,
      });
      const tasksResult = await getTasks();
      setTasks(tasksResult.data || []);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;
  return (
    <>
      <h1>MVP Board</h1>
      <DndContext
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Columns
          columns={columns}
          setColumns={setColumns}
          tasks={tasks}
          setTasks={setTasks}
        />

        <DragOverlay>
          {activeTask ? (
            <div className="mb-3 rounded bg-gray-100 p-3 shadow-md">
              <h3 className="font-semibold">{activeTask.title}</h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
