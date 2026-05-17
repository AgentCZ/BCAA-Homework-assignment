"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import UsageRecordForm from "@/components/UsageRecordForm";
import { Loading } from "@/components/Feedback";

function NewUsageRecordContent() {
  const params = useSearchParams();
  // Pokud uživatel přijde z detailu léku, předvyplníme medicationId.
  const presetMedicationId = params.get("medicationId") || "";

  return (
    <Card>
      <CardHeader
        title="Údaje o užití"
        subtitle="Povinný je pouze lék. Pokud nezadáte čas, použije se aktuální."
      />
      <CardBody>
        <UsageRecordForm
          mode="create"
          presetMedicationId={presetMedicationId}
        />
      </CardBody>
    </Card>
  );
}

export default function NewUsageRecordPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href="/zaznamy" className="text-brand-700 hover:underline">
          ← Zpět na seznam záznamů
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">Nový záznam užití</h1>

      <Suspense fallback={<Loading label="Načítám formulář…" />}>
        <NewUsageRecordContent />
      </Suspense>
    </div>
  );
}
