"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { medicationApi, usageRecordApi } from "@/lib/api";
import { describeError, toLocalInputValue } from "@/lib/format";
import { SelectField, DateTimeField, TextareaField } from "./Field";
import { ErrorBox, Loading } from "./Feedback";
import Button from "./Button";


export default function UsageRecordForm({
  mode = "create",
  initial = {},
  presetMedicationId,
}) {
  const router = useRouter();
  const [medications, setMedications] = useState(null);
  const [loadErr, setLoadErr] = useState(null);

  const [medicationId, setMedicationId] = useState(
    initial.medicationId || presetMedicationId || ""
  );
  const [timestamp, setTimestamp] = useState(
    toLocalInputValue(initial.timestamp)
  );
  const [notes, setNotes] = useState(initial.notes || "");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = mode === "edit";

  useEffect(() => {
    let alive = true;
    medicationApi
      .list()
      .then((data) => {
        if (alive) setMedications(data.itemList || []);
      })
      .catch((err) => {
        if (alive) setLoadErr(describeError(err));
      });
    return () => {
      alive = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    let isoTimestamp = null;
    if (timestamp) {
      const d = new Date(timestamp);
      if (Number.isNaN(d.getTime())) {
        setError("Neplatný formát data a času.");
        setBusy(false);
        return;
      }
      if (d.getTime() > Date.now()) {
        setError("Čas užití nemůže být v budoucnosti.");
        setBusy(false);
        return;
      }
      isoTimestamp = d.toISOString();
    }

    const payload = {
      medicationId,
      ...(isoTimestamp ? { timestamp: isoTimestamp } : {}),
      ...(notes.trim() ? { notes: notes.trim() } : {}),
    };

    try {
      if (isEdit) {
        const updated = await usageRecordApi.update({
          id: initial.id,
          ...payload,
        });
        router.push(`/zaznamy/${updated.id}`);
        router.refresh();
      } else {
        const created = await usageRecordApi.create(payload);
        router.push(`/zaznamy/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  }

  if (medications === null && !loadErr) {
    return <Loading label="Načítám seznam léků…" />;
  }

  const options = (medications || []).map((m) => ({
    value: m.id,
    label: m.dosage ? `${m.name} (${m.dosage})` : m.name,
  }));

  const noMedications = medications && medications.length === 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorBox message={error || loadErr} />

      {noMedications ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Zatím nemáte žádný lék. Nejdřív si{" "}
          <a
            href="/leky/novy"
            className="font-medium text-amber-900 underline underline-offset-2"
          >
            založte lék
          </a>
          .
        </div>
      ) : (
        <SelectField
          label="Lék"
          value={medicationId}
          onChange={setMedicationId}
          options={options}
          required
          disabled={busy}
        />
      )}

      <DateTimeField
        label="Čas užití"
        value={timestamp}
        onChange={setTimestamp}
        max={toLocalInputValue(new Date().toISOString())}
        disabled={busy}
      />
      <p className="-mt-2 text-xs text-slate-500">
        Pokud necháte prázdné, použije se aktuální čas.
      </p>

      <TextareaField
        label="Poznámka"
        value={notes}
        onChange={setNotes}
        maxLength={500}
        rows={3}
        placeholder="např. Po jídle, kvůli bolesti hlavy."
        disabled={busy}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={busy}
        >
          Zrušit
        </Button>
        <Button
          type="submit"
          disabled={busy || !medicationId || noMedications}
        >
          {busy ? "Ukládám…" : isEdit ? "Uložit změny" : "Zapsat užití"}
        </Button>
      </div>
    </form>
  );
}
