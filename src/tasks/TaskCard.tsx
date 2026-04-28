// import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { TaskCardProps } from '../types/task.types';
import { useState } from 'react';
import Modal from './Modal';
import SingleTask from './SingleTask';

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

  return (
    <div
      ref={setNodeRef}
      className="mb-3 block rounded bg-gray-100 p-3 shadow-md"
      style={style}
    >
      <div className="flex items-center gap-2">
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab text-sm text-gray-500"
        >
          ⋮⋮
        </div>

        <h3
          onClick={() => setModalIsOpen(true)}
          className="cursor-pointer font-semibold wrap-break-word"
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
