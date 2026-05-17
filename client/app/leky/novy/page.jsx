import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/Card";
import MedicationForm from "@/components/MedicationForm";

export default function NewMedicationPage() {
  return (
    <div className="space-y-6">
      <nav className="text-sm">
        <Link href="/leky" className="text-brand-700 hover:underline">
          ← Zpět na seznam léků
        </Link>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900">Nový lék</h1>

      <Card>
        <CardHeader
          title="Údaje o léku"
          subtitle="Vyplňte alespoň název. Dávkování a pokyny jsou nepovinné."
        />
        <CardBody>
          <MedicationForm mode="create" />
        </CardBody>
      </Card>
    </div>
  );
}
