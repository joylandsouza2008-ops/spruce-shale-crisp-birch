import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({ component: AboutPage });

const TEAM = [
  { name: "Joylan Dsouza", role: "Team lead · AI extraction engine" },
  { name: "Manvith", role: "Frontend · portal UI" },
  { name: "Amaan", role: "Generics, pharmacy check, catalog" },
  { name: "Lakshya", role: "Discharge schedule" },
  { name: "Denzil", role: "Barcode scan" },
  { name: "Clinston", role: "Testing, documentation, demo" },
];

function AboutPage() {
  return (
    <AppShell>
      <div className="max-w-2xl space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight">About MedAssist</h1>
          <p className="text-muted">
            Built by Team Orbit, St Joseph Engineering College, Mangalore, for Build for Billions —
            Agentic AI for Billions. One engine, four everyday pharmacy problems.
          </p>
        </header>
        <Card>
          <CardHeader>
            <CardTitle>Team Orbit</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {TEAM.map((m) => (
              <div key={m.name} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:justify-between">
                <span className="font-medium">{m.name}</span>
                <span className="text-sm text-muted">{m.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Safety</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>
              MedAssist does not diagnose, prescribe, or change doses. It interprets text a clinician
              already wrote, then looks up a demo catalog of salts, prices, and Mangalore pharmacy
              stock.
            </p>
            <p>
              Always confirm generics, interactions, and availability with a registered doctor or
              pharmacist. Stock and prices here are sample data for the prototype.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
