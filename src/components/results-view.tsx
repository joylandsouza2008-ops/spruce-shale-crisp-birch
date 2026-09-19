import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "schedule", label: "Schedule" },
  { id: "generics", label: "Cheaper options" },
  { id: "pharmacies", label: "Pharmacies" },
  { id: "reasoning", label: "How it read this" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ResultsView({ result }: { result: AnalysisResult }) {
  const [tab, setTab] = useState<TabId>("schedule");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={result.source === "ai" ? "primary" : "default"}>
            {result.source === "ai" ? "Read by AI" : "Read locally"}
          </Badge>
          {result.patientName ? (
            <span className="text-sm text-muted">{result.patientName}</span>
          ) : null}
          {result.age ? <span className="text-sm text-subtle">{result.age} yrs</span> : null}
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Your medicine plan</h1>
        {result.diagnosis ? (
          <p className="text-muted">As written: {result.diagnosis}</p>
        ) : (
          <p className="text-muted">
            {result.medicines.length} medicine{result.medicines.length === 1 ? "" : "s"} extracted
            from the prescription.
          </p>
        )}
      </header>

      {result.interactions.length > 0 ? (
        <Card className="border-warn/30">
          <CardContent className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warn" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Flagged combinations — confirm with your doctor</p>
              {result.interactions.map((i) => (
                <p key={i.note} className="text-sm text-muted">
                  <span className="font-medium text-fg">{i.medicines.join(" + ")}.</span> {i.note}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="flex gap-2 rounded-lg border border-danger/20 bg-surface px-4 py-3 text-sm text-danger">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div>
            {result.warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Medicines" value={String(result.medicines.length)} />
        <Stat
          label="Possible monthly save"
          value={`₹${result.monthlySave}`}
          hint="vs listed brand MRP, using Jan Aushadhi prices in the demo catalog"
        />
        <Stat
          label="Best demo pickup"
          value={result.pharmacies[0]?.name ?? "—"}
          hint={
            result.pharmacies[0]
              ? `${result.pharmacies[0].inStock}/${result.pharmacies[0].total} in stock`
              : undefined
          }
        />
      </div>

      <div className="flex gap-1 overflow-x-auto rounded-lg bg-raised p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "min-h-11 flex-1 rounded-md px-3 text-sm font-medium whitespace-nowrap",
              tab === t.id ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "schedule" ? <ScheduleTab result={result} /> : null}
      {tab === "generics" ? <GenericsTab result={result} /> : null}
      {tab === "pharmacies" ? <PharmaciesTab result={result} /> : null}
      {tab === "reasoning" ? <ReasoningTab result={result} /> : null}
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
        <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="mt-1 text-xs text-subtle">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function ScheduleTab({ result }: { result: AnalysisResult }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {result.schedule.map((slot) => (
        <Card key={slot.when}>
          <CardHeader>
            <CardTitle>{slot.label}</CardTitle>
            <CardDescription>
              {slot.items.length} item{slot.items.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {slot.items.map((item, i) => (
              <div key={`${item.name}-${i}`} className="rounded-md bg-raised/70 p-3">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted">{item.how}</p>
                <p className="mt-1 text-xs text-subtle">{item.purpose}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Ask at the next visit</CardTitle>
          <CardDescription>These are prompts, not medical advice.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {result.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ol>
          {result.followUp ? (
            <p className="mt-4 text-sm text-muted">Follow-up as written: {result.followUp}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function GenericsTab({ result }: { result: AnalysisResult }) {
  if (!result.generics.length) {
    return <p className="text-sm text-muted">No catalog matches — savings need a known salt.</p>;
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Same salt, different brand. Confirm any switch with your doctor or pharmacist before buying.
      </p>
      {result.generics.map((g) => (
        <Card key={g.medicineId}>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{g.prescribed}</p>
              <p className="text-sm text-muted">{g.salt}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm tabular-nums">
              <Price label="Brand MRP" value={g.brandMrp} />
              <Price label="Generic" value={g.genericMrp} />
              <Price label="Jan Aushadhi" value={g.janAushadhiMrp} highlight />
            </div>
            <Badge variant="success">Save ~{g.savePct}%</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Price({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-subtle">{label}</p>
      <p className={cn("font-medium", highlight && "text-success")}>
        <IndianRupee className="mr-0.5 inline size-3.5" />
        {value}
      </p>
    </div>
  );
}

function PharmaciesTab({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        Demo stock for Mangalore — not live inventory. Call before you travel.
      </p>
      {result.pharmacies.map((p) => (
        <Card key={p.pharmacyId}>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="flex items-center gap-1 text-sm text-muted">
                  <MapPin className="size-3.5" />
                  {p.area}
                </p>
              </div>
              <Badge variant={p.inStock === p.total ? "success" : p.inStock === 0 ? "danger" : "warn"}>
                {p.inStock}/{p.total} in stock
              </Badge>
            </div>
            <p className="text-sm text-muted">{p.address}</p>
            <div className="flex flex-wrap gap-4 text-xs text-subtle">
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3.5" />
                {p.phone}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {p.hours}
              </span>
              {p.estimatedTotal > 0 ? (
                <span className="tabular-nums">Est. bill ₹{p.estimatedTotal}</span>
              ) : null}
            </div>
            {p.missing.length ? (
              <p className="text-sm text-warn">
                Missing: {p.missing.join(", ")}
                {p.etaHours != null ? ` · restock ~${p.etaHours}h` : ""}
              </p>
            ) : (
              <p className="flex items-center gap-1 text-sm text-success">
                <CheckCircle2 className="size-4" />
                Full list available in the demo
              </p>
            )}
            <p className="text-xs text-subtle">{p.pickupHint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ReasoningTab({ result }: { result: AnalysisResult }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transparent steps</CardTitle>
        <CardDescription>What the engine did with this text — not a black box.</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="space-y-3">
          {result.reasoning.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-raised text-xs font-medium tabular-nums">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          {result.medicines.map((m) => (
            <li key={m.rawName + m.dose} className="flex flex-wrap items-baseline justify-between gap-2">
              <span>
                {m.rawName}{" "}
                <span className="text-muted">
                  {m.dose} {m.frequency}
                </span>
              </span>
              <span className="text-xs text-subtle tabular-nums">
                confidence {Math.round(m.confidence * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
