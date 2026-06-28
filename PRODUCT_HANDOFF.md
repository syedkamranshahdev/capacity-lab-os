# Capacity Lab OS — Product Handoff

## What changed

This is no longer a decorative coaching dashboard. It is a coherent founding-beta product built around Capacity Lab’s strongest idea: a woman’s health signals are connected, and useful decisions require context.

### The member journey

- A public **Capacity State Check** captures five signals and optional cycle context.
- The result becomes a private **Capacity Map** after sign-in.
- A **60-second daily check-in** records only member-entered data.
- **Guided experiments** respond to the current lowest signal with one small, cautious action.
- **Connections** shows timelines, context and reflections without claiming causation.
- **Settings and notifications** now work from real member state.

### Trust improvements

- Removed invented testimonials, client counts, outcome percentages and random health scores.
- Removed universal cycle-phase training rules.
- Replaced medical-sounding promises with educational pattern-awareness language.
- Added clear boundaries around diagnosis, treatment and training clearance.
- Added row-level security for assessments and check-ins.
- Kept the app private-beta/no-index by default.

## Before sharing with testers

1. Apply `supabase/migrations/20260627000000_capacity_product.sql` to the connected Supabase project.
2. Verify Vercel has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Rotate the demo password that was shared in messages, then create a fresh tester account.
4. Test sign-up, State Check, check-in, refresh, and sign-in from a second browser.
5. Add a Privacy Policy, Terms, contact address and data-deletion process before collecting real health-adjacent data.
6. Ask a qualified health professional/legal adviser to review any future biomarker, supplement or symptom guidance.
7. Keep this as a 5–10 person founding beta until at least two weeks of real usage reveals what members return for.

## What not to build yet

- Wearable integrations
- Lab or biomarker interpretation
- AI health recommendations
- Complex meal or workout prescriptions
- A large content library

Those features add cost and risk before the core habit—check in, notice a connection, test one supportive action—has been validated.

## Suggested message to Georgianna

> Hi Georgianna — I took your feedback as product direction and rebuilt the beta around it. The experience now connects a State Check, a five-signal Capacity Map, daily check-ins, context-aware guided experiments, and a Connections view based only on what the member actually records. I also removed the unsupported claims and medical-style positioning you flagged. Would you be open to a short walkthrough this week? If the direction fits Capacity Lab, I can then define the founding-beta scope, backend launch steps and final fixed price with you before any further work.

Do not send another long feature list after this message. The next goal is a 20-minute call, a clear yes/no on the founding beta, and agreement on scope before more custom work.

## Commercial structure to propose on the call

- **Paid discovery / scope lock:** confirm audience, first paid offer, data boundaries and success metric.
- **Founding-beta delivery:** current product, production database migration, deployment, branded copy pass and launch QA.
- **Optional monthly support:** small improvements and bug fixes; integrations priced separately.

Use a written scope, 50% upfront, two feedback rounds and a final acceptance date. Avoid offering unlimited revisions or continuing speculative work without a deposit.
