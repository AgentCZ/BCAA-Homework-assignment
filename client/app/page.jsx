"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import Button from "@/components/Button";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import { medicationApi, usageRecordApi } from "@/lib/api";
import { describeError, formatDateTime } from "@/lib/format";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [latestRecords, setLatestRecords] = useState([]);
  const [medMap, setMedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const [meds, recs] = await Promise.all([
          medicationApi.list(),
          usageRecordApi.list(),
        ]);
        if (!alive) return;
        setStats({
          medications: meds.itemList?.length || 0,
          records: recs.itemList?.length || 0,
        });
        setLatestRecords((recs.itemList || []).slice(0, 5));
        setMedMap(recs.medicationMap || {});
      } catch (err) {
        if (alive) setError(describeError(err));
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-slate-900">
          Vítejte v MedLogu
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Spravujte svůj seznam léků a evidujte, kdy jste si je vzali. Aplikace
          slouží jako digitální deník
        </p>
      </section>

      {loading ? (
        <Loading label="Načítám přehled…" />
      ) : error ? (
        <ErrorBox message={error} />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Léky</p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {stats.medications}
                    </p>
                  </div>
                  <Button href="/leky" variant="secondary" size="sm">
                    Spravovat
                  </Button>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Záznamy užití
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-900">
                      {stats.records}
                    </p>
                  </div>
                  <Button href="/zaznamy" variant="secondary" size="sm">
                    Zobrazit
                  </Button>
                </div>
              </CardBody>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader
                title="Poslední užití"
                subtitle="5 nejnovějších záznamů"
                actions={
                  <Button href="/zaznamy/novy" size="sm">
                    + Nový záznam
                  </Button>
                }
              />
              <CardBody className="px-0 py-0">
                {latestRecords.length === 0 ? (
                  <div className="px-5 py-6">
                    <EmptyState
                      title="Žádné záznamy"
                      hint="Začněte tím, že přidáte lék a zapíšete první užití."
                      action={
                        <Button href="/leky/novy">+ Přidat lék</Button>
                      }
                    />
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {latestRecords.map((rec) => {
                      const med = medMap[rec.medicationId];
                      return (
                        <li
                          key={rec.id}
                          className="flex items-center justify-between gap-4 px-5 py-3"
                        >
                          <div>
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
                              <p className="mt-0.5 text-sm text-slate-500">
                                {rec.notes}
                              </p>
                            )}
                          </div>
                          <span className="whitespace-nowrap text-sm text-slate-500">
                            {formatDateTime(rec.timestamp)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardBody>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
