"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import Button from "@/components/Button";
import MedicationForm from "@/components/MedicationForm";
import { medicationApi } from "@/lib/api";
import { describeError } from "@/lib/format";

export default function EditMedicationPage() {
  const { id } = useParams();
  const [medication, setMedication] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    medicationApi
      .get(id)
      .then((data) => alive && setMedication(data))
      .catch((err) => {
        if (!alive) return;
        if (err.status === 404) setNotFound(true);
        else setError(describeError(err));
      });
    return () => {
      alive = false;
    };
  }, [id]);

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href={`/leky/${id}`} className="text-brand-700 hover:underline">
          ← Zpět na detail
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">Upravit lék</h1>

      {notFound ? (
        <EmptyState
          title="Lék nebyl nalezen"
          action={<Button href="/leky">Zpět na seznam</Button>}
        />
      ) : error ? (
        <ErrorBox message={error} />
      ) : !medication ? (
        <Loading label="Načítám lék…" />
      ) : (
        <Card>
          <CardHeader title="Údaje o léku" />
          <CardBody>
            <MedicationForm mode="edit" initial={medication} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
