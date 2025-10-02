export default function Loader({ message = "Chargement" } = {}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#071019] text-white/70">
      <div className="loader w-[32vw] max-w-xs">
        <div className="light" />
        <div className="black_overlay" />
      </div>
      <p className="mt-6 font-mono text-xs uppercase tracking-[0.45em] text-white/40">{message}</p>
    </div>
  );
}
