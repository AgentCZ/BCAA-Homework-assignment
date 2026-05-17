"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Button from "@/components/Button";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import DeleteButton from "@/components/DeleteButton";
import { usageRecordApi } from "@/lib/api";
import { describeError, formatDateTime } from "@/lib/format";

export default function UsageRecordDetailPage() {
  const { id } = useParams();

  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    usageRecordApi
      .get(id)
      .then((data) => alive && setRecord(data))
      .catch((err) => {
        if (!alive) return;
        if (err.status === 404) setNotFound(true);
        else setError(describeError(err));
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="space-y-4">
        <Link
          href="/zaznamy"
          className="text-sm text-brand-700 hover:underline"
        >
          ← Zpět na seznam záznamů
        </Link>
        <EmptyState
          title="Záznam nebyl nalezen"
          hint="Pravděpodobně byl smazán nebo neexistuje."
          action={<Button href="/zaznamy">Zpět na seznam</Button>}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/zaznamy"
          className="text-sm text-brand-700 hover:underline"
        >
          ← Zpět na seznam záznamů
        </Link>
        <ErrorBox message={error} />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="space-y-4">
        <Link
          href="/zaznamy"
          className="text-sm text-brand-700 hover:underline"
        >
          ← Zpět na seznam záznamů
        </Link>
        <Loading label="Načítám záznam…" />
      </div>
    );
  }

  const med = record.medication;

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link
          href="/zaznamy"
          className="text-brand-700 hover:underline"
        >
          ← Zpět na seznam záznamů
        </Link>
      </nav>

      <Card>
        <CardHeader
          title={med ? `Užití: ${med.name}` : "Záznam užití"}
          subtitle={formatDateTime(record.timestamp)}
          actions={
            <>
              <Button
                href={`/zaznamy/${record.id}/upravit`}
                variant="secondary"
                size="sm"
              >
                Upravit
              </Button>
              <DeleteButton
                size="sm"
                label="Smazat"
                confirmTitle="Smazat záznam?"
                confirmDescription="Tuto akci nelze vrátit."
                onDelete={() => usageRecordApi.remove(record.id)}
                redirectTo="/zaznamy"
              />
            </>
          }
        />
        <CardBody>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">
                Lék
              </dt>
              <dd className="text-slate-900">
                {med ? (
                  <Link
                    href={`/leky/${med.id}`}
                    className="text-brand-700 hover:underline"
                  >
                    {med.name}
                    {med.dosage && (
                      <span className="ml-2 text-sm text-slate-500">
                        {med.dosage}
                      </span>
                    )}
                  </Link>
                ) : (
                  "(neznámý)"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">
                Čas užití
              </dt>
              <dd className="text-slate-900">
                {formatDateTime(record.timestamp)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase text-slate-500">
                Poznámka
              </dt>
              <dd className="whitespace-pre-line text-slate-900">
                {record.notes || "—"}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
