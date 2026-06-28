export type CapacityDimension =
  | "energy"
  | "sleep"
  | "regulation"
  | "recovery"
  | "readiness";

export type QuestionId = CapacityDimension | "cycle" | "priority";
export type CapacityAnswers = Partial<Record<QuestionId, string>>;
export type CapacityScores = Record<CapacityDimension, number>;

export type CapacityResult = {
  version: 1;
  completedAt: string;
  scores: CapacityScores;
  overall: number;
  primaryFocus: CapacityDimension;
  priority: string;
  cycleContext: string;
  status: "Protect" | "Rebuild" | "Steady" | "Expand";
  summary: string;
  connections: string[];
  nextSteps: string[];
};

export type CapacityCheckIn = {
  id: string;
  date: string;
  createdAt: string;
  energy: number;
  sleep: number;
  regulation: number;
  recovery: number;
  readiness: number;
  cycleContext: string;
  symptoms: string[];
  note: string;
};

type QuestionOption = {
  label: string;
  value: string;
  score?: number;
  description?: string;
};

export type CapacityQuestion = {
  id: QuestionId;
  eyebrow: string;
  title: string;
  description: string;
  options: QuestionOption[];
};

export const dimensionMeta: Record<
  CapacityDimension,
  { label: string; shortLabel: string; description: string }
> = {
  energy: {
    label: "Energy capacity",
    shortLabel: "Energy",
    description: "How available and steady your energy feels today.",
  },
  sleep: {
    label: "Sleep restoration",
    shortLabel: "Sleep",
    description: "How restored you feel after recent sleep.",
  },
  regulation: {
    label: "Stress regulation",
    shortLabel: "Regulation",
    description: "How able you feel to settle after pressure or stimulation.",
  },
  recovery: {
    label: "Recovery reserve",
    shortLabel: "Recovery",
    description: "How well your body appears to be absorbing recent demands.",
  },
  readiness: {
    label: "Training readiness",
    shortLabel: "Readiness",
    description: "How prepared you feel for purposeful physical effort.",
  },
};

export const capacityQuestions: CapacityQuestion[] = [
  {
    id: "energy",
    eyebrow: "Signal 01 · Energy",
    title: "How available has your energy felt over the last few days?",
    description: "Choose the answer that reflects your usual day, not your best day.",
    options: [
      { label: "Very limited", value: "very-limited", score: 22, description: "I am getting through the essentials." },
      { label: "Unpredictable", value: "unpredictable", score: 42, description: "My energy rises and crashes." },
      { label: "Mostly available", value: "mostly-available", score: 66, description: "I have enough for most priorities." },
      { label: "Steady and reliable", value: "steady", score: 84, description: "My energy feels consistent." },
    ],
  },
  {
    id: "sleep",
    eyebrow: "Signal 02 · Sleep",
    title: "How restored do you feel when you wake?",
    description: "This is about perceived restoration, not a perfect sleep score.",
    options: [
      { label: "Rarely restored", value: "rarely-restored", score: 24 },
      { label: "It varies considerably", value: "variable", score: 44 },
      { label: "Restored more often than not", value: "often-restored", score: 68 },
      { label: "Consistently restored", value: "restored", score: 86 },
    ],
  },
  {
    id: "regulation",
    eyebrow: "Signal 03 · Regulation",
    title: "How easily do you settle after stress or overstimulation?",
    description: "Think about the time it takes to feel calm and present again.",
    options: [
      { label: "I stay activated for a long time", value: "prolonged", score: 22 },
      { label: "I recover, but slowly", value: "slow", score: 44 },
      { label: "I usually return to baseline", value: "usually", score: 68 },
      { label: "I regulate with relative ease", value: "ease", score: 84 },
    ],
  },
  {
    id: "recovery",
    eyebrow: "Signal 04 · Recovery",
    title: "How well are you recovering from training and daily demands?",
    description: "Consider soreness, mental fatigue, motivation and general freshness.",
    options: [
      { label: "I feel behind", value: "behind", score: 24 },
      { label: "Recovery is inconsistent", value: "inconsistent", score: 44 },
      { label: "I am recovering adequately", value: "adequate", score: 68 },
      { label: "I feel resilient", value: "resilient", score: 86 },
    ],
  },
  {
    id: "readiness",
    eyebrow: "Signal 05 · Readiness",
    title: "What level of training feels appropriate today?",
    description: "Your answer is a reflection, not a prescribed workout.",
    options: [
      { label: "Rest or very gentle movement", value: "restore", score: 24 },
      { label: "Light, technique-focused movement", value: "light", score: 44 },
      { label: "A normal training session", value: "normal", score: 68 },
      { label: "I feel ready for a demanding session", value: "strong", score: 86 },
    ],
  },
  {
    id: "cycle",
    eyebrow: "Context · Optional",
    title: "Would you like to add cycle context?",
    description: "This helps you notice your own patterns over time. Capacity Lab does not prescribe intensity from cycle phase alone.",
    options: [
      { label: "Menstrual", value: "Menstrual" },
      { label: "Follicular", value: "Follicular" },
      { label: "Ovulatory", value: "Ovulatory" },
      { label: "Luteal", value: "Luteal" },
      { label: "Unsure / variable", value: "Unsure / variable" },
      { label: "Not applicable", value: "Not applicable" },
    ],
  },
  {
    id: "priority",
    eyebrow: "Your intention",
    title: "What would feel most valuable to improve first?",
    description: "This helps order your experience without turning one signal into a diagnosis.",
    options: [
      { label: "More stable energy", value: "energy" },
      { label: "More restorative sleep", value: "sleep" },
      { label: "Calmer stress recovery", value: "regulation" },
      { label: "Better recovery consistency", value: "recovery" },
      { label: "More confidence in training decisions", value: "readiness" },
    ],
  },
];

export const capacityDimensions: CapacityDimension[] = [
  "energy",
  "sleep",
  "regulation",
  "recovery",
  "readiness",
];

function scoreFor(questionId: CapacityDimension, answer?: string) {
  const question = capacityQuestions.find((item) => item.id === questionId);
  return question?.options.find((option) => option.value === answer)?.score ?? 50;
}

export function statusForScore(score: number): CapacityResult["status"] {
  if (score < 38) return "Protect";
  if (score < 56) return "Rebuild";
  if (score < 74) return "Steady";
  return "Expand";
}

export function calculateCapacityResult(answers: CapacityAnswers): CapacityResult {
  const scores = capacityDimensions.reduce(
    (result, dimension) => ({ ...result, [dimension]: scoreFor(dimension, answers[dimension]) }),
    {} as CapacityScores,
  );

  const lowest = [...capacityDimensions].sort((a, b) => scores[a] - scores[b])[0];
  const requestedPriority = capacityDimensions.includes(answers.priority as CapacityDimension)
    ? (answers.priority as CapacityDimension)
    : lowest;
  const primaryFocus = scores[requestedPriority] <= scores[lowest] + 18 ? requestedPriority : lowest;
  const overall = Math.round(
    capacityDimensions.reduce((total, dimension) => total + scores[dimension], 0) / capacityDimensions.length,
  );

  const connections: string[] = [];
  if (scores.sleep < 56 && scores.energy < 56) {
    connections.push("Lower sleep restoration and limited energy are appearing together. Track both before changing training intensity.");
  }
  if (scores.regulation < 56 && scores.recovery < 56) {
    connections.push("Stress regulation and recovery reserve are both asking for attention. Fewer inputs and clearer recovery boundaries may be useful to test.");
  }
  if (scores.readiness < 56 && scores.recovery >= 60) {
    connections.push("Recovery appears more available than training readiness. Motivation, soreness and life load may add useful context.");
  }
  if (connections.length === 0) {
    connections.push("No single connection dominates today. A few short check-ins will show which signals move together for you.");
  }
  if (answers.cycle && answers.cycle !== "Not applicable") {
    connections.push(answers.cycle + " context has been recorded for pattern awareness—not as a rule for what your body should do.");
  }

  const focusLabel = dimensionMeta[primaryFocus].label.toLowerCase();
  return {
    version: 1,
    completedAt: new Date().toISOString(),
    scores,
    overall,
    primaryFocus,
    priority: answers.priority ?? primaryFocus,
    cycleContext: answers.cycle ?? "Not recorded",
    status: statusForScore(overall),
    summary: "Your current map points to " + focusLabel + " as the clearest place to begin. This is a reflection of your answers, not a diagnosis or fixed label.",
    connections,
    nextSteps: [
      "Complete one 60-second check-in each day for the next week.",
      "Choose one supportive practice for " + focusLabel + " rather than changing everything at once.",
      "Review the pattern after seven entries before drawing conclusions.",
    ],
  };
}

export function createCheckInResult(checkIn: Omit<CapacityCheckIn, "id" | "createdAt">) {
  const scores: CapacityScores = {
    energy: checkIn.energy,
    sleep: checkIn.sleep,
    regulation: checkIn.regulation,
    recovery: checkIn.recovery,
    readiness: checkIn.readiness,
  };
  const primaryFocus = [...capacityDimensions].sort((a, b) => scores[a] - scores[b])[0];
  const overall = Math.round(
    capacityDimensions.reduce((total, dimension) => total + scores[dimension], 0) / capacityDimensions.length,
  );
  return { scores, primaryFocus, overall, status: statusForScore(overall) };
}

export function scoreToWords(score: number) {
  if (score < 38) return "Needs protection";
  if (score < 56) return "Needs support";
  if (score < 74) return "Available";
  return "Strong today";
}
