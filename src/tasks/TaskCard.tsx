import { Link } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px )`,
      }
    : undefined;

  return (
    <Link to={`/tasks/${task.id}`}>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="mb-3 block rounded bg-gray-100 p-3 shadow-md"
        style={style}
      >
        {transform ? (
          <h3 className="font-semibold wrap-break-word">{task.title}</h3>
        ) : (
          <h3 className="font-semibold wrap-break-word">{task.title}</h3>
        )}
      </div>
    </Link>
  );
}
