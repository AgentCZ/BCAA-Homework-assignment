"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import { Loading, ErrorBox, EmptyState } from "@/components/Feedback";
import Button from "@/components/Button";
import UsageRecordForm from "@/components/UsageRecordForm";
import { usageRecordApi } from "@/lib/api";
import { describeError } from "@/lib/format";

export default function EditUsageRecordPage() {
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

  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link
          href={`/zaznamy/${id}`}
          className="text-brand-700 hover:underline"
        >
          ← Zpět na detail
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">Upravit záznam</h1>

      {notFound ? (
        <EmptyState
          title="Záznam nebyl nalezen"
          action={<Button href="/zaznamy">Zpět na seznam</Button>}
        />
      ) : error ? (
        <ErrorBox message={error} />
      ) : !record ? (
        <Loading label="Načítám záznam…" />
      ) : (
        <Card>
          <CardHeader title="Údaje o užití" />
          <CardBody>
            <UsageRecordForm mode="edit" initial={record} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
