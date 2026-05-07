import Columns from '../../columns/Columns';
import { useState, useEffect } from 'react';
import { getColumns, updateColumn } from '../../api/column';
import { getTasks, updateTask } from '../../api/task';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
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

      const overCol = columns.find(
        (c) => c.id.toString() === over.id.toString(),
      );
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

      try {
        await Promise.all(
          reindexed.map((col) =>
            updateColumn(col.id, {
              name: col.name,
              position: col.position,
            }),
          ),
        );
      } catch (err) {
        console.error('Column sync failed', err);
      }

      return;
    }

    const taskId = Number(active.id);
    const overId = over.id;

    const activeTask = tasks.find((t) => t.id === taskId);
    if (!activeTask) return;

    let targetColumnId: number;

    const overTask = tasks.find((t) => t.id.toString() === overId.toString());
    const overColumn = columns.find(
      (c) => c.id.toString() === overId.toString(),
    );

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

    try {
      await Promise.all(
        reindexed.map((task) =>
          updateTask(task.id, {
            title: task.title,
            description: task.description,
            column_id: task.column_id,
            position: task.position,
          }),
        ),
      );
    } catch (err) {
      console.error('Batch sync failed', err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor),
  );

  if (loading) return <p>Loading...</p>;
  if (errors) return <p>{errors}</p>;
  return (
    <div className="custom-scrollbar flex h-screen w-full overflow-x-auto scroll-smooth bg-slate-100 p-4 md:p-10">
      {columns.length === 0 ? (
        <div className="flex w-full flex-col items-center justify-center space-y-4 rounded-xl border-2 border-dashed border-slate-300 p-20 text-center">
          <div className="rounded-full bg-slate-200 p-4">📋</div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Your board is empty
            </h2>
            <p className="text-slate-600">
              Create your first list to start organizing your tasks!
            </p>
          </div>

          <Columns
            columns={columns}
            setColumns={setColumns}
            tasks={tasks}
            setTasks={setTasks}
            activeTask={activeTask}
          />
        </div>
      ) : (
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div className="flex items-start gap-4 md:gap-6">
            <Columns
              columns={columns}
              setColumns={setColumns}
              tasks={tasks}
              setTasks={setTasks}
              activeTask={activeTask}
            />
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="mb-3 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
                <h3 className="font-semibold text-slate-800">
                  {activeTask.title}
                </h3>
              </div>
            )}

            {activeColumn && (
              <div className="flex h-[500px] w-80 rotate-3 flex-col rounded-lg border border-slate-300 bg-white p-3 shadow-2xl transition-transform">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-gray-400">⋮⋮</span>
                  <p className="font-semibold text-gray-800">
                    {activeColumn.name}
                  </p>
                </div>

                <div className="space-y-2 opacity-40">
                  <div className="h-14 w-full rounded-md bg-slate-100" />
                  <div className="h-14 w-full rounded-md bg-slate-100" />
                  <div className="h-14 w-full rounded-md bg-slate-100" />
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
