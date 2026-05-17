import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Stránka nenalezena
      </h1>
      <p className="mt-2 text-slate-600">
        Stránka, kterou hledáte, neexistuje nebo byla přesunuta.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button href="/">Domů</Button>
        <Button href="/leky" variant="secondary">
          Léky
        </Button>
      </div>
    </div>
  );
}
