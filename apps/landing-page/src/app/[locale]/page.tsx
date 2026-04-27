import { Button } from "@erp/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-16">
      <section className="w-full max-w-3xl rounded-3xl p-10 text-center sm:p-16">
        <div className="space-y-4">
          <h1 className="text-h1 sm:text-display">ERP Scolaire</h1>
          <p className="mx-auto max-w-xl text-body-md text-muted-foreground">
            La plateforme tout-en-un pour piloter votre établissement.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button size="md">Commencer</Button>
          <Button size="md" variant="outline">
            En savoir plus
          </Button>
        </div>
      </section>
    </main>
  );
}
