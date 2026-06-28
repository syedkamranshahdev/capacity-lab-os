// hooks/useUser.ts
// Thin wrapper around AuthContext.
// Replaces your old useUser.ts with a context-backed version.
// Import this anywhere you need user data in a client component.

export { useAuth as useUser } from "@/context/AuthContext";