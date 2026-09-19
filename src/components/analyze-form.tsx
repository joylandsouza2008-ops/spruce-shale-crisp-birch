import { useNavigate } from "@tanstack/react-router";
import { FileImage, FileSearch, LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { analyzePrescription } from "@/lib/analyze";
import { SAMPLE_DISCHARGE, SAMPLE_INFECTION } from "@/lib/catalog";
import { useAnalysis } from "@/lib/store";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Textarea } from "./ui/input";

async function shrinkImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const max = 960;
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read image");
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", 0.72);
}

export function AnalyzeForm() {
  const navigate = useNavigate();
  const setResult = useAnalysis((s) => s.setResult);
  const [text, setText] = useState("");
  const [imageName, setImageName] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose a photo of the prescription.");
      return;
    }
    try {
      const url = await shrinkImage(file);
      setImageDataUrl(url);
      setImageName(file.name);
      setError(null);
    } catch {
      setError("Could not read that image.");
    }
  }

  async function run() {
    if (!text.trim() && !imageDataUrl) {
      setError("Paste the prescription or add a photo.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await analyzePrescription({
        data: { text: text.trim() || undefined, imageDataUrl: imageDataUrl ?? undefined },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setResult(res.result);
      await navigate({ to: "/result" });
    } catch {
      setError("Something went wrong while reading the prescription.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setText(SAMPLE_DISCHARGE)}
          >
            Sample discharge
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setText(SAMPLE_INFECTION)}
          >
            Sample clinic Rx
          </Button>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a discharge summary or prescription here…"
          aria-label="Prescription text"
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={(e) => void onFile(e.target.files?.[0])}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <FileImage />
              {imageName ? "Change photo" : "Add photo"}
            </Button>
            {imageName ? (
              <span className="max-w-40 truncate text-xs text-muted">{imageName}</span>
            ) : (
              <span className="text-xs text-subtle">Optional. Works with a phone photo.</span>
            )}
          </div>
          <Button type="button" size="lg" className="w-full sm:w-auto" disabled={busy} onClick={() => void run()}>
            {busy ? <LoaderCircle className="animate-spin" /> : <FileSearch />}
            {busy ? "Reading…" : "Explain prescription"}
          </Button>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <p className="text-xs text-subtle">
          MedAssist interprets what the doctor already wrote. It does not diagnose or change
          doses.
        </p>
      </CardContent>
    </Card>
  );
}
