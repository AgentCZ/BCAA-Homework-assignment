"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Button from "@/components/Button";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import DeleteButton from "@/components/DeleteButton";
import { medicationApi, usageRecordApi } from "@/lib/api";
import { describeError, formatDateTime } from "@/lib/format";

export default function MedicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [medication, setMedication] = useState(null);
  const [usageRecords, setUsageRecords] = useState(null);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        // Lék i jeho záznamy načteme paralelně.
        const [med, recs] = await Promise.all([
          medicationApi.get(id),
          usageRecordApi.list({ medicationId: id }),
        ]);
        if (!alive) return;
        setMedication(med);
        setUsageRecords(recs.itemList || []);
      } catch (err) {
        if (!alive) return;
        if (err.status === 404) setNotFound(true);
        else setError(describeError(err));
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [id]);

  if (notFound) {
    return (
      <div className="space-y-4">
        <Link href="/leky" className="text-sm text-brand-700 hover:underline">
          ← Zpět na seznam léků
        </Link>
        <EmptyState
          title="Lék nebyl nalezen"
          hint="Pravděpodobně byl smazán nebo neexistuje."
          action={<Button href="/leky">Zpět na seznam</Button>}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/leky" className="text-sm text-brand-700 hover:underline">
          ← Zpět na seznam léků
        </Link>
        <ErrorBox message={error} />
      </div>
    );
  }

  if (!medication || usageRecords === null) {
    return (
      <div className="space-y-4">
        <Link href="/leky" className="text-sm text-brand-700 hover:underline">
          ← Zpět na seznam léků
        </Link>
        <Loading label="Načítám detail léku…" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href="/leky" className="text-brand-700 hover:underline">
          ← Zpět na seznam léků
        </Link>
      </nav>

      <Card>
        <CardHeader
          title={medication.name}
          subtitle={medication.dosage || "Bez uvedeného dávkování"}
          actions={
            <>
              <Button
                href={`/leky/${medication.id}/upravit`}
                variant="secondary"
                size="sm"
              >
                Upravit
              </Button>
              <DeleteButton
                size="sm"
                label="Smazat"
                confirmTitle="Smazat lék?"
                confirmDescription={
                  usageRecords.length > 0
                    ? `Smaže se také ${usageRecords.length} souvisejících záznamů užití. Tuto akci nelze vrátit.`
                    : "Tuto akci nelze vrátit."
                }
                onDelete={() => medicationApi.remove(medication.id)}
                redirectTo="/leky"
              />
            </>
          }
        />
        <CardBody>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">
                Název
              </dt>
              <dd className="text-slate-900">{medication.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase text-slate-500">
                Dávkování
              </dt>
              <dd className="text-slate-900">{medication.dosage || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase text-slate-500">
                Pokyny k užívání
              </dt>
              <dd className="whitespace-pre-line text-slate-900">
                {medication.instructions || "—"}
              </dd>
            </div>
          </dl>
        </CardBody>
      </Card>

      <Card>
        <CardHeader
          title="Historie užití"
          subtitle={`${usageRecords.length} záznamů`}
          actions={
            <Button
              size="sm"
              onClick={() =>
                router.push(
                  `/zaznamy/novy?medicationId=${encodeURIComponent(
                    medication.id
                  )}`
                )
              }
            >
              + Zapsat užití
            </Button>
          }
        />
        <CardBody className="px-0 py-0">
          {usageRecords.length === 0 ? (
            <div className="px-5 py-6">
              <EmptyState
                title="Žádné záznamy"
                hint="Tento lék zatím nemá zaznamenané žádné užití."
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {usageRecords.map((rec) => (
                <li
                  key={rec.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/zaznamy/${rec.id}`}
                      className="font-medium text-slate-900 hover:text-brand-700"
                    >
                      {formatDateTime(rec.timestamp)}
                    </Link>
                    {rec.notes && (
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {rec.notes}
                      </p>
                    )}
                  </div>
                  <Button
                    href={`/zaznamy/${rec.id}/upravit`}
                    variant="ghost"
                    size="sm"
                  >
                    Upravit
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
