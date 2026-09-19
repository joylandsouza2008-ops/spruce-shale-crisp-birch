import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardList, IndianRupee, ScanLine, Store } from "lucide-react";
import { AnalyzeForm } from "@/components/analyze-form";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({ component: Home });

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Explain my discharge",
    body: "Plain-language, day-by-day schedule plus questions to ask the doctor.",
  },
  {
    icon: IndianRupee,
    title: "Find cheaper medicine",
    body: "Same-salt generics and Jan Aushadhi price bands from the demo catalog.",
  },
  {
    icon: Store,
    title: "Check before you go",
    body: "Nearby Mangalore pharmacy stock, pickup hints, and combination flags.",
  },
  {
    icon: ScanLine,
    title: "Scan a medicine",
    body: "Barcode lookup for common vs uncommon salts and cheaper equivalents.",
  },
];

function Home() {
  return (
    <AppShell>
      <section className="mb-10 max-w-2xl space-y-4">
        <p className="text-sm font-medium tracking-wide text-primary uppercase">
          Orbit · Agentic AI for billions
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Leave the hospital knowing what to take, and where.
        </h1>
        <p className="text-lg text-muted">
          MedAssist reads a prescription or discharge summary and turns it into a schedule, cheaper
          same-salt options, and a pharmacy check — without diagnosing.
        </p>
      </section>

      <AnalyzeForm />

      <section className="mt-12 grid gap-3 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <Card key={f.title}>
            <CardContent className="flex gap-3">
              <f.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <h2 className="font-medium">{f.title}</h2>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <p className="mt-8 text-center text-sm text-subtle">
        Already analysed something?{" "}
        <Link to="/result" className="text-primary underline-offset-2 hover:underline">
          Open last result
        </Link>
      </p>
    </AppShell>
  );
}
