import Columns from '../../columns/Columns';
import { useState, useEffect } from 'react';
import { getColumns, updateColumn } from '../../api/column';
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
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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
    const id = event.active.id;

    const column = columns.find((c) => c.id.toString() === id);
    if (column) {
      setActiveColumn(column);
      return;
    }

    const taskId = Number(id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeCol = activeColumn;
    if (activeCol) {
      setActiveColumn(null);

      const overCol = columns.find((c) => c.id.toString() === over.id);
      if (!overCol) return;

      const oldIndex = columns.findIndex((c) => c.id === activeCol.id);
      const newIndex = columns.findIndex((c) => c.id === overCol.id);

      if (oldIndex === newIndex) return;

      const newOrder = arrayMove(columns, oldIndex, newIndex);

      const reindexed = newOrder.map((col, index) => ({
        ...col,
        position: index,
      }));

      setColumns(reindexed);

      for (const col of reindexed) {
        await updateColumn(col.id, {
          name: col.name,
          position: col.position,
        });
      }

      return;
    }

    const taskId = Number(active.id);
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    let targetColumnId: number;

    const overTask = tasks.find((t) => t.id.toString() === overId);
    const overColumn = columns.find((c) => c.id.toString() === overId);

    if (overTask) {
      targetColumnId = overTask.column_id;
    } else if (overColumn) {
      targetColumnId = overColumn.id;
    } else {
      return;
    }

    const tasksInTarget = tasks
      .filter((t) => t.column_id === targetColumnId && t.id !== taskId)
      .sort((a, b) => a.position - b.position);

    let targetIndex = tasksInTarget.length;

    if (overTask) {
      targetIndex = tasksInTarget.findIndex((t) => t.id === overTask.id);
      if (targetIndex === -1) targetIndex = tasksInTarget.length;
    }

    const reordered = [
      ...tasksInTarget.slice(0, targetIndex),
      { ...activeTask, column_id: targetColumnId },
      ...tasksInTarget.slice(targetIndex),
    ];

    const reindexed = reordered.map((task, index) => ({
      ...task,
      position: index,
    }));

    const finalTasks = tasks.map((t) => {
      const updated = reindexed.find((r) => r.id === t.id);
      return updated ? updated : t;
    });

    setTasks(finalTasks);

    for (const task of reindexed) {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        column_id: task.column_id,
        position: task.position,
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;
  return (
    <div className="justift-start flex px-10 py-10">
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
          activeTask={activeTask}
        />

        <DragOverlay>
          {activeTask ? (
            <div className="mb-3 rounded bg-gray-100 p-3 shadow-md">
              <h3 className="font-semibold">{activeTask.title}</h3>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
