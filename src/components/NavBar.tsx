export default function NavBar() {
  return (
    <nav className="flex items-center justify-between bg-slate-900 px-6 py-3 shadow-sm">
      <h1 className="text-lg font-bold tracking-wide text-white">My Board</h1>

      <div className="flex items-center gap-4">
        <button className="rounded bg-white/20 px-3 py-1 text-sm font-medium text-gray-900 hover:bg-white/30">
          Log out
        </button>
      </div>
    </nav>
  );
}
