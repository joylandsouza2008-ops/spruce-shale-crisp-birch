import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ScanView } from "@/components/scan-view";

export const Route = createFileRoute("/scan")({ component: ScanPage });

function ScanPage() {
  return (
    <AppShell>
      <ScanView />
    </AppShell>
  );
}
