"use client";

import { createClient } from "@/lib/supabase/client";
import type { CapacityAnswers, CapacityCheckIn, CapacityResult } from "@/lib/capacity/model";

const ASSESSMENT_PREFIX = "capacity-lab:assessment:";
const CHECKINS_PREFIX = "capacity-lab:checkins:";
const GUEST_OWNER = "guest";

function owner(userId?: string | null) {
  return userId || GUEST_OWNER;
}

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export function readLocalAssessment(userId?: string | null): CapacityResult | null {
  if (!canUseStorage()) return null;
  const value = window.localStorage.getItem(ASSESSMENT_PREFIX + owner(userId));
  if (!value) return null;
  try {
    return JSON.parse(value) as CapacityResult;
  } catch {
    return null;
  }
}

export function writeLocalAssessment(result: CapacityResult, userId?: string | null) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(ASSESSMENT_PREFIX + owner(userId), JSON.stringify(result));
}

export function claimGuestAssessment(userId: string) {
  const existing = readLocalAssessment(userId);
  if (existing) return existing;
  const guest = readLocalAssessment();
  if (guest) writeLocalAssessment(guest, userId);
  return guest;
}

export function readLocalCheckIns(userId?: string | null): CapacityCheckIn[] {
  if (!canUseStorage()) return [];
  const value = window.localStorage.getItem(CHECKINS_PREFIX + owner(userId));
  if (!value) return [];
  try {
    return (JSON.parse(value) as CapacityCheckIn[]).sort((a, b) => a.date.localeCompare(b.date));
  } catch {
    return [];
  }
}

export function writeLocalCheckIns(checkIns: CapacityCheckIn[], userId?: string | null) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CHECKINS_PREFIX + owner(userId), JSON.stringify(checkIns));
}

export async function getAssessment(userId?: string | null): Promise<CapacityResult | null> {
  const local = readLocalAssessment(userId) ?? (userId ? claimGuestAssessment(userId) : null);
  if (!userId) return local;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("capacity_assessments")
      .select("result")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data?.result) {
      const remote = data.result as CapacityResult;
      writeLocalAssessment(remote, userId);
      return remote;
    }
  } catch {
    // Local persistence keeps the founding beta useful before migration.
  }

  return local;
}

export async function saveAssessment(
  result: CapacityResult,
  answers: CapacityAnswers,
  userId?: string | null,
) {
  writeLocalAssessment(result, userId);
  if (!userId) return { synced: false };

  try {
    const supabase = createClient();
    const { error } = await supabase.from("capacity_assessments").insert({
      user_id: userId,
      answers,
      result,
      overall_score: result.overall,
      primary_focus: result.primaryFocus,
    });
    return { synced: !error };
  } catch {
    return { synced: false };
  }
}

export async function getCheckIns(userId?: string | null): Promise<CapacityCheckIn[]> {
  const local = readLocalCheckIns(userId);
  if (!userId) return local;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("capacity_checkins")
      .select("*")
      .eq("user_id", userId)
      .order("checkin_date", { ascending: true })
      .limit(60);

    if (!error && data?.length) {
      const remote = data.map((item) => ({
        id: item.id,
        date: item.checkin_date,
        createdAt: item.created_at,
        energy: item.energy,
        sleep: item.sleep,
        regulation: item.regulation,
        recovery: item.recovery,
        readiness: item.readiness,
        cycleContext: item.cycle_context || "Not recorded",
        symptoms: item.symptoms || [],
        note: item.note || "",
      })) as CapacityCheckIn[];
      writeLocalCheckIns(remote, userId);
      return remote;
    }
  } catch {
    // Fall back to this device while the beta backend is unavailable.
  }

  return local;
}

export async function saveCheckIn(checkIn: CapacityCheckIn, userId?: string | null) {
  const existing = readLocalCheckIns(userId).filter((item) => item.date !== checkIn.date);
  writeLocalCheckIns(
    [...existing, checkIn].sort((a, b) => a.date.localeCompare(b.date)),
    userId,
  );

  if (!userId) return { synced: false };
  try {
    const supabase = createClient();
    const { error } = await supabase.from("capacity_checkins").upsert(
      {
        user_id: userId,
        checkin_date: checkIn.date,
        energy: checkIn.energy,
        sleep: checkIn.sleep,
        regulation: checkIn.regulation,
        recovery: checkIn.recovery,
        readiness: checkIn.readiness,
        cycle_context: checkIn.cycleContext,
        symptoms: checkIn.symptoms,
        note: checkIn.note,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,checkin_date" },
    );
    return { synced: !error };
  } catch {
    return { synced: false };
  }
}
