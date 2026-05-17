"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { medicationApi } from "@/lib/api";
import { describeError } from "@/lib/format";
import { TextField, TextareaField } from "./Field";
import { ErrorBox } from "./Feedback";
import Button from "./Button";


export default function MedicationForm({ mode = "create", initial = {} }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name || "");
  const [dosage, setDosage] = useState(initial.dosage || "");
  const [instructions, setInstructions] = useState(initial.instructions || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = mode === "edit";

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const payload = {
      name: name.trim(),
      ...(dosage.trim() ? { dosage: dosage.trim() } : {}),
      ...(instructions.trim() ? { instructions: instructions.trim() } : {}),
    };

    try {
      if (isEdit) {
        const updated = await medicationApi.update({ id: initial.id, ...payload });
        router.push(`/leky/${updated.id}`);
        router.refresh();
      } else {
        const created = await medicationApi.create(payload);
        router.push(`/leky/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ErrorBox message={error} />

      <TextField
        label="Název léku"
        value={name}
        onChange={setName}
        required
        maxLength={100}
        placeholder="např. Paralen"
        disabled={busy}
      />

      <TextField
        label="Dávkování"
        value={dosage}
        onChange={setDosage}
        maxLength={100}
        placeholder="např. 500 mg"
        disabled={busy}
      />

      <TextareaField
        label="Pokyny k užívání"
        value={instructions}
        onChange={setInstructions}
        maxLength={500}
        rows={4}
        placeholder="např. Užívat při bolesti nebo horečce, max. 4× denně po 4–6 hodinách."
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
        <Button type="submit" disabled={busy || !name.trim()}>
          {busy ? "Ukládám…" : isEdit ? "Uložit změny" : "Vytvořit lék"}
        </Button>
      </div>
    </form>
  );
}
