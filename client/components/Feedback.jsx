
export function Loading({ label = "Načítám…" }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-6 text-slate-500">
      <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-brand-500" />
      {label}
    </div>
  );
}

export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

export function EmptyState({ title, hint, action }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
