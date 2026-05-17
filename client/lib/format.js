
export function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function toLocalInputValue(iso) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes())
  );
}

export function describeError(err) {
  if (!err) return "Neznámá chyba";
  switch (err.code) {
    case "uniqueNameAlreadyExists":
      return "Lék se stejným názvem už existuje.";
    case "medicationDoesNotExist":
      return "Vybraný lék neexistuje.";
    case "medicationNotFound":
      return "Lék nebyl nalezen.";
    case "usageRecordNotFound":
      return "Záznam o užití nebyl nalezen.";
    case "invalidTimestamp":
      return "Čas užití nemůže být v budoucnosti.";
    case "dtoInIsNotValid":
      return "Vstupní data nejsou platná.";
    default:
      return err.message || "Něco se pokazilo.";
  }
}
