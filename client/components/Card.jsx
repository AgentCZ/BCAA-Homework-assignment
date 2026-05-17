export default function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-lg border border-slate-200 bg-white shadow-sm " + className
      }
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-shrink-0 gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={"px-5 py-4 " + className}>{children}</div>;
}
