"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { describeError } from "@/lib/format";


export default function DeleteButton({
  onDelete,
  redirectTo,
  label = "Smazat",
  confirmTitle = "Opravdu smazat?",
  confirmDescription,
  size = "md",
  variant = "danger",
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    try {
      await onDelete();
      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch (err) {
      setError(describeError(err));
      setBusy(false);
    }
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <ConfirmDialog
        open={open}
        title={confirmTitle}
        description={
          error ? (
            <span className="text-red-600">{error}</span>
          ) : (
            confirmDescription
          )
        }
        confirmLabel="Smazat"
        cancelLabel="Zrušit"
        variant="danger"
        busy={busy}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!busy) {
            setOpen(false);
            setError(null);
          }
        }}
      />
    </>
  );
}
