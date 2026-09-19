import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { ResultsView } from "@/components/results-view";
import { Button } from "@/components/ui/button";
import { useAnalysis } from "@/lib/store";

export const Route = createFileRoute("/result")({ component: ResultPage });

function ResultPage() {
  const result = useAnalysis((s) => s.result);
  const hydrate = useAnalysis((s) => s.hydrate);

  useEffect(() => {
    if (!result) hydrate();
  }, [result, hydrate]);

  if (!result) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md space-y-4 py-16 text-center">
          <h1 className="font-display text-2xl font-semibold">No prescription yet</h1>
          <p className="text-muted">Paste a discharge summary on the home page to get a plan.</p>
          <Button asChild>
            <Link to="/">Read a prescription</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ResultsView result={result} />
      <div className="mt-8">
        <Button asChild variant="secondary">
          <Link to="/">Read another</Link>
        </Button>
      </div>
    </AppShell>
  );
}
