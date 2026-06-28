// lib/utils.ts
// Utility for merging Tailwind classes safely.
// Install: npm install clsx tailwind-merge

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}