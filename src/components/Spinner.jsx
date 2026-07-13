export default function Spinner({ label = "Yükleniyor" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-sm font-bold text-muted">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
