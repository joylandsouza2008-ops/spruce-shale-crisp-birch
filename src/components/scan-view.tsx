import { Camera, Keyboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { findByBarcode, MEDICINES } from "@/lib/catalog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

type Hit = ReturnType<typeof findByBarcode>;

export function ScanView() {
  const [code, setCode] = useState("");
  const [hit, setHit] = useState<Hit>(undefined);
  const [miss, setMiss] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);

  function applyCode(raw: string) {
    const c = raw.replace(/\s+/g, "");
    setCode(c);
    const found = findByBarcode(c);
    setHit(found);
    setMiss(!found && c.length >= 8);
  }

  useEffect(() => {
    return () => stopCam();
  }, []);

  function stopCam() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }

  async function startCam() {
    setCamError(null);
    if (!("BarcodeDetector" in window)) {
      setCamError("This browser cannot scan barcodes. Type the number from the pack instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);
      const Detector = (
        window as unknown as {
          BarcodeDetector: new (opts: { formats: string[] }) => {
            detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
          };
        }
      ).BarcodeDetector;
      const detector = new Detector({ formats: ["ean_13", "ean_8", "code_128", "upc_a"] });
      timerRef.current = window.setInterval(() => {
        const video = videoRef.current;
        if (!video || video.readyState < 2) return;
        void detector.detect(video).then((barcodes) => {
          const value = barcodes[0]?.rawValue;
          if (value) {
            applyCode(value);
            stopCam();
          }
        });
      }, 400);
    } catch {
      setCamError("Camera permission was denied. You can still type the barcode.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">Scan a medicine</h1>
        <p className="max-w-xl text-muted">
          Check expiry guidance, whether it is a common salt, and the cheapest catalog equivalent.
          Demo barcodes are listed below.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Keyboard className="pointer-events-none absolute top-3 left-3 size-4 text-subtle" />
              <Input
                className="pl-10"
                inputMode="numeric"
                placeholder="Enter barcode number"
                value={code}
                onChange={(e) => applyCode(e.target.value)}
                aria-label="Barcode"
              />
            </div>
            {scanning ? (
              <Button type="button" variant="secondary" onClick={stopCam}>
                Stop camera
              </Button>
            ) : (
              <Button type="button" variant="secondary" onClick={() => void startCam()}>
                <Camera />
                Use camera
              </Button>
            )}
          </div>
          {camError ? <p className="text-sm text-warn">{camError}</p> : null}
          <video
            ref={videoRef}
            className={scanning ? "h-48 w-full rounded-lg bg-fg object-cover" : "hidden"}
            muted
            playsInline
          />
        </CardContent>
      </Card>

      {hit ? <MedicineCard medicine={hit} /> : null}
      {miss ? (
        <p className="text-sm text-muted">
          That code is not in the demo catalog. Try one of the sample barcodes below.
        </p>
      ) : null}

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">Sample barcodes</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {MEDICINES.slice(0, 8).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => applyCode(m.barcode)}
              className="flex min-h-11 items-center justify-between rounded-lg border border-border bg-surface px-4 text-left text-sm hover:bg-raised"
            >
              <span>{m.brand}</span>
              <span className="font-mono text-xs text-subtle tabular-nums">{m.barcode}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MedicineCard({ medicine }: { medicine: NonNullable<Hit> }) {
  const expiredDemo = false;
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{medicine.brand}</CardTitle>
          <Badge variant={medicine.rarity === "common" ? "success" : "warn"}>
            {medicine.rarity} salt
          </Badge>
        </div>
        <CardDescription>
          {medicine.salt} · {medicine.strength} · {medicine.form}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <p>{medicine.typicalUse}</p>
        <p className="text-muted">
          {expiredDemo
            ? "Expiry check: this pack looks expired in the demo."
            : "Expiry check: no expiry printed on a barcode alone — look at the pack strip. Demo packs are treated as in date."}
        </p>
        <div className="flex flex-wrap gap-4 tabular-nums">
          <span>Brand ₹{medicine.mrp}</span>
          <span>Generic ₹{medicine.genericMrp}</span>
          <span className="text-success">Jan Aushadhi ₹{medicine.janAushadhiMrp}</span>
        </div>
      </CardContent>
    </Card>
  );
}
