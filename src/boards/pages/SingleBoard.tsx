import Columns from '../../columns/Columns';
import { useState, useEffect } from 'react';
import { getColumns } from '../../api/column';
import { getTasks, updateTask } from '../../api/task';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, rectIntersection } from '@dnd-kit/core';
import type { Column } from '../../types/column.types';
import type { Task } from '../../types/task.types';
import { arrayMove } from '@dnd-kit/sortable';

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

    const overIsTask = tasks.some((task) => task.id.toString() === overId);

    const overIsColumn = columns.some(
      (column) => column.id.toString() === overId,
    );

    if (overIsTask) {
      const activeTaskId = Number(active.id);
      const overTaskId = Number(over.id);

      const activeTask = tasks.find((t) => t.id === activeTaskId);
      const overTask = tasks.find((t) => t.id === overTaskId);

      if (!activeTask || !overTask) return;

      if (activeTask.column_id !== overTask.column_id) {
        return;
      }

      const tasksInColumn = tasks
        .filter((t) => t.column_id === activeTask.column_id)
        .sort((a, b) => a.position - b.position);

      const oldIndex = tasksInColumn.findIndex((t) => t.id === activeTaskId);
      const newIndex = tasksInColumn.findIndex((t) => t.id === overTaskId);

      const newOrder = arrayMove(tasksInColumn, oldIndex, newIndex);

      newOrder.forEach((task, index) => {
        task.position = index;
      });

      const updatedTasks = tasks.map((task) => {
        const updated = newOrder.find((t) => t.id === task.id);
        return updated ? updated : task;
      });

      setTasks(updatedTasks);

      for (const task of newOrder) {
        const original = updatedTasks.find((t) => t.id === task.id);

        await updateTask(task.id, {
          title: original.title,
          description: original.description,
          column_id: original.column_id,
          position: task.position,
        });
      }

      return;
    }

    if (overIsColumn) {
      const newColumnId = Number(overId);

      const tasksInNewColumn = tasks
        .filter((t) => t.column_id === newColumnId)
        .sort((a, b) => a.position - b.position);

      const newPosition = tasksInNewColumn.length;

      setTasks((tasks) =>
        tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                column_id: newColumnId,
                position: newPosition,
              }
            : task,
        ),
      );

      const original = tasks.find((t) => t.id === taskId);

      await updateTask(taskId, {
        title: original.title,
        description: original?.description,
        column_id: newColumnId,
        position: newPosition,
      });
      const tasksResult = await getTasks();
      setTasks(tasksResult.data || []);

      return;
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
