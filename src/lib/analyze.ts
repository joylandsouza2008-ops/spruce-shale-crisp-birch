import { createServerFn } from "@tanstack/react-start";
import { enrichExtract, localExtract, type AiExtract } from "./enrich";
import type { AnalysisResult } from "./types";

const SYSTEM = `You are MedAssist, a prescription interpreter for Indian patients.
You do NOT diagnose and you do NOT change doses. You only interpret what a doctor already wrote.
Return STRICT JSON only, no markdown.

Schema:
{
  "patientName": string|null,
  "age": string|null,
  "diagnosis": string|null,
  "followUp": string|null,
  "medicines": [{
    "rawName": string,
    "dose": string,
    "frequency": string,
    "timing": string,
    "duration": string,
    "sos": boolean,
    "purpose": string,
    "confidence": number
  }],
  "questionsForDoctor": string[],
  "reasoning": string[],
  "warnings": string[]
}

Rules:
- frequency should preserve 1-0-0 / 1-0-1 / 0-0-1 when present (morning-afternoon-night).
- purpose is a short plain-language guess of why that class of medicine is commonly used — never a diagnosis of this patient.
- questionsForDoctor: 3 short follow-up questions the family can ask at the next visit.
- reasoning: 4-6 short steps explaining what you extracted (transparent, not a black box).
- If handwriting/photo is unclear, lower confidence and list the uncertainty in warnings.
- English output. Keep medicine brand names as written.`;

function parseJson(text: string): AiExtract | null {
  const trimmed = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as AiExtract;
  } catch {
    return null;
  }
}

export const analyzePrescription = createServerFn({ method: "POST" })
  .validator((input: { text?: string; imageDataUrl?: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; result: AnalysisResult } | { ok: false; error: string }> => {
    const text = (data.text ?? "").slice(0, 8000);
    const imageDataUrl = data.imageDataUrl;
    if (!text.trim() && !imageDataUrl) {
      return { ok: false, error: "Paste a prescription or add a photo first." };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      if (!text.trim()) {
        return {
          ok: false,
          error: "AI is not available to read photos here. Paste the prescription text instead.",
        };
      }
      return { ok: true, result: enrichExtract(localExtract(text), "local") };
    }

    const userContent: Array<
      { type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }
    > = [
      {
        type: "text",
        text: text.trim()
          ? `Interpret this prescription / discharge summary:\n\n${text}`
          : "Interpret the prescription or discharge summary in the image. Extract every medicine.",
      },
    ];
    if (imageDataUrl?.startsWith("data:image/")) {
      userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });
    }

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.2,
          max_tokens: 1800,
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: userContent },
          ],
        }),
      });
      if (!res.ok) {
        if (text.trim()) return { ok: true, result: enrichExtract(localExtract(text), "local") };
        return { ok: false, error: `Could not reach the AI service (${res.status}).` };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = body.choices?.[0]?.message?.content ?? "";
      const parsed = parseJson(raw);
      if (!parsed || !parsed.medicines?.length) {
        if (text.trim()) return { ok: true, result: enrichExtract(localExtract(text), "local") };
        return { ok: false, error: "Could not read medicines from that photo. Try a clearer image or paste the text." };
      }
      return { ok: true, result: enrichExtract(parsed, "ai") };
    } catch {
      if (text.trim()) return { ok: true, result: enrichExtract(localExtract(text), "local") };
      return { ok: false, error: "Network error while reading the prescription." };
    }
  });
