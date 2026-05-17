
export function TextField({
  label,
  name,
  value,
  onChange,
  required,
  maxLength,
  placeholder,
  disabled,
  error,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        className={
          "w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm " +
          "focus:outline-none focus:ring-2 focus:ring-brand-500 " +
          (error
            ? "border-red-400 focus:ring-red-400"
            : "border-slate-300")
        }
      />
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function TextareaField({
  label,
  name,
  value,
  onChange,
  maxLength,
  rows = 3,
  placeholder,
  disabled,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      <textarea
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  placeholder = "— vyberte —",
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DateTimeField({
  label,
  value,
  onChange,
  required,
  max,
  disabled,
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      <input
        type="datetime-local"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        max={max}
        disabled={disabled}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
    </label>
  );
}
