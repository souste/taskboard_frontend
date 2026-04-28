export default function Modal({ open, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-999 bg-black/40">
      <div className="w-500px fixed top-1/2 left-1/2 z-1000 max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-8 shadow-xl">
        <button onClick={onClose}>Close Modal</button>
        {children}
      </div>
    </div>
  );
}
