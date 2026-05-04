// import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskCardProps } from '../types/task.types';
import { useState } from 'react';
import Modal from './Modal';
import SingleTask from './SingleTask';
import { toggleTask } from '../api/task';

export default function TaskCard({ task, refreshTasks }: TaskCardProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id.toString(),
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    try {
      await toggleTask(task.id, {
        ...task,
        completed: !task.completed,
      });

      refreshTasks();
    } catch (err) {
      console.error('Toggle failed', err);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="mb-3 w-full cursor-pointer rounded bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
      style={style}
    >
      <div className="flex items-center gap-3">
        <div
          {...listeners}
          {...attributes}
          className="flex-shrink-0 cursor-grab text-sm text-gray-500"
        >
          ⋮⋮
        </div>

        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <h3
          onClick={() => setModalIsOpen(true)}
          className={`font-semibold break-all transition-all duration-200 ${
            task.completed
              ? 'text-gray-400 line-through opacity-60'
              : 'text-gray-800'
          }`}
        >
          {task.title}
        </h3>
      </div>
      <Modal open={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        <SingleTask taskId={task.id} refreshTasks={refreshTasks} />
      </Modal>
    </div>
  );
}
