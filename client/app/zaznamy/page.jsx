"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Button from "@/components/Button";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import { medicationApi, usageRecordApi } from "@/lib/api";
import { describeError, formatDateTime } from "@/lib/format";

export default function UsageRecordListPage() {
  const [records, setRecords] = useState(null);
  const [medMap, setMedMap] = useState({});
  const [medicationOptions, setMedicationOptions] = useState([]);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const recs = await usageRecordApi.list(
          filter ? { medicationId: filter } : {}
        );
        if (!alive) return;
        setRecords(recs.itemList || []);
        setMedMap(recs.medicationMap || {});
      } catch (err) {
        if (alive) setError(describeError(err));
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [filter, reloadKey]);

  // Seznam léků pro filtr
  useEffect(() => {
    let alive = true;
    medicationApi
      .list()
      .then((data) => {
        if (!alive) return;
        setMedicationOptions(data.itemList || []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Záznamy užití</h1>
          <p className="mt-1 text-sm text-slate-600">
            Chronologická historie užití všech léků.
          </p>
        </div>
        <Button href="/zaznamy/novy">+ Nový záznam</Button>
      </div>

      <ErrorBox message={error} />

      <Card>
        <CardHeader
          title="Seznam záznamů"
          subtitle={
            records
              ? `${records.length} záznamů${filter ? " (filtrováno)" : ""}`
              : "Načítám…"
          }
          actions={
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Všechny léky</option>
              {medicationOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          }
        />
        <CardBody className="px-0 py-0">
          {records === null ? (
            <div className="px-5 py-4">
              <Loading label="Načítám záznamy…" />
            </div>
          ) : records.length === 0 ? (
            <div className="px-5 py-6">
              <EmptyState
                title={
                  filter
                    ? "Pro vybraný lék zatím neexistují záznamy"
                    : "Zatím žádné záznamy"
                }
                hint={
                  filter
                    ? "Zkuste filtr odebrat nebo zapsat nové užití."
                    : "Začněte zapsáním prvního užití."
                }
                action={
                  filter ? (
                    <Button
                      variant="secondary"
                      onClick={() => setFilter("")}
                    >
                      Vymazat filtr
                    </Button>
                  ) : (
                    <Button href="/zaznamy/novy">+ Nový záznam</Button>
                  )
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {records.map((rec) => {
                const med = medMap[rec.medicationId];
                return (
                  <li
                    key={rec.id}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/zaznamy/${rec.id}`}
                        className="font-medium text-slate-900 hover:text-brand-700"
                      >
                        {med ? med.name : "(neznámý lék)"}
                      </Link>
                      {med?.dosage && (
                        <span className="ml-2 text-sm text-slate-500">
                          {med.dosage}
                        </span>
                      )}
                      {rec.notes && (
                        <p className="mt-0.5 truncate text-sm text-slate-500">
                          {rec.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <span className="whitespace-nowrap text-sm text-slate-500">
                        {formatDateTime(rec.timestamp)}
                      </span>
                      <Button
                        href={`/zaznamy/${rec.id}/upravit`}
                        variant="ghost"
                        size="sm"
                      >
                        Upravit
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
