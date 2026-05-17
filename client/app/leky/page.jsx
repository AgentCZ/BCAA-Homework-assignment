"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Button from "@/components/Button";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import { medicationApi } from "@/lib/api";
import { describeError } from "@/lib/format";

export default function MedicationListPage() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    medicationApi
      .list()
      .then((data) => alive && setItems(data.itemList || []))
      .catch((err) => alive && setError(describeError(err)));
    return () => {
      alive = false;
    };
  }, []);

  const filtered = (items || []).filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Léky</h1>
          <p className="mt-1 text-sm text-slate-600">
            Seznam všech léků uložených v MedLogu.
          </p>
        </div>
        <Button href="/leky/novy">+ Přidat lék</Button>
      </div>

      <ErrorBox message={error} />

      <Card>
        <CardHeader
          title="Seznam léků"
          subtitle={
            items ? `${items.length} položek celkem` : "Načítám…"
          }
          actions={
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hledat podle názvu…"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          }
        />
        <CardBody className="px-0 py-0">
          {items === null ? (
            <div className="px-5 py-4">
              <Loading label="Načítám léky…" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-6">
              <EmptyState
                title={
                  items.length === 0
                    ? "Zatím žádné léky"
                    : "Žádný lék neodpovídá hledání"
                }
                hint={
                  items.length === 0
                    ? "Začněte přidáním prvního léku do seznamu."
                    : "Zkuste upravit hledaný výraz."
                }
                action={
                  items.length === 0 ? (
                    <Button href="/leky/novy">+ Přidat lék</Button>
                  ) : null
                }
              />
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {filtered.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between gap-4 px-5 py-3"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/leky/${m.id}`}
                      className="font-medium text-slate-900 hover:text-brand-700"
                    >
                      {m.name}
                    </Link>
                    {m.dosage && (
                      <span className="ml-2 text-sm text-slate-500">
                        {m.dosage}
                      </span>
                    )}
                    {m.instructions && (
                      <p className="mt-0.5 truncate text-sm text-slate-500">
                        {m.instructions}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Button
                      href={`/leky/${m.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      Detail
                    </Button>
                    <Button
                      href={`/leky/${m.id}/upravit`}
                      variant="ghost"
                      size="sm"
                    >
                      Upravit
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
