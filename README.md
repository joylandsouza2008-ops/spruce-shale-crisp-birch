# MedAssist

AI-powered portal that turns a prescription or discharge summary into a plain-language medicine schedule, cheaper same-salt options, and a nearby pharmacy check.

Built by **Team Orbit** (St Joseph Engineering College, Mangalore) for *Build for Billions — Agentic AI for Billions*.

## What it does

1. **Explain my discharge** — extract medicines, doses, and a morning / afternoon / night plan, plus questions for the next visit.
2. **Find cheaper medicine** — map brands to salts and show generic / Jan Aushadhi price bands.
3. **Check before you go** — demo Mangalore pharmacy stock, pickup hints, and combination flags.
4. **Scan a medicine** — barcode (camera or typed) for common vs uncommon salts and cheaper equivalents.

The agent **does not diagnose**. It only interprets what a doctor already prescribed.

## Stack

- React 19 + TanStack Start / Router
- Tailwind CSS v4
- xAI Grok for extraction (falls back to a local Indian-Rx parser)
- Demo catalog of common Indian medicines and Mangalore pharmacies

## Safety

Not medical advice. Confirm every medicine, substitute, and interaction with a registered doctor or pharmacist. Pharmacy stock and prices in this prototype are sample data.

## Team

| Member | Role |
| --- | --- |
| Joylan Dsouza | Team lead; AI extraction |
| Manvith | Frontend |
| Amaan | Generics, pharmacy check, catalog |
| Lakshya | Discharge schedule |
| Denzil | Barcode scan |
| Clinston | Testing and documentation |
