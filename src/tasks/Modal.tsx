export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 bg-black/50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed top-1/2 left-1/2 w-[800px] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-xl"
      >
        <button
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
