# Capacity Lab OS — Founding Beta

Capacity Lab OS turns scattered wellness signals into a simple personal reflection loop:

1. **State Check** — capture energy, sleep restoration, stress regulation, recovery and training readiness.
2. **Capacity Map** — see the five signals together without turning them into a diagnosis.
3. **Daily Check-in** — record a 60-second snapshot plus optional cycle and symptom context.
4. **Guided experiments** — try one small supportive action connected to the signal asking for attention.
5. **Connections** — review only the data the member actually recorded and notice what moves together.

The product intentionally avoids universal cycle prescriptions, fake social proof, invented health scores and medical claims.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.local.example` to `.env.local` and add the Supabase project values.
3. Apply `supabase/migrations/20260627000000_capacity_product.sql` in the Supabase SQL editor.
4. Run `npm run dev`.
5. Open `http://localhost:3000`.

## Verification

- `npm run typecheck`
- `npm run lint`
- `npm run build`

The founding beta keeps a local-device fallback if the new Supabase tables have not been migrated. Apply the migration before inviting real testers so entries persist across devices.

## Product boundaries

Capacity Lab OS is for educational pattern awareness. It does not diagnose, treat, prescribe exercise intensity, or replace qualified medical care. Any future biomarker interpretation, supplement guidance or symptom triage should receive appropriate clinical, privacy and regulatory review before release.
