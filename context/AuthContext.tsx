"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type {
  User,
  Session,
} from "@supabase/supabase-js";

import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  initials: string;
  avatarUrl: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;

  session: Session | null;

  loading: boolean;

  initialized: boolean;

  signOut: () => Promise<void>;

  refreshUser: () => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function deriveInitials(
  fullName: string,
): string {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase(),
    )
    .join("");
}

function buildAuthUser(
  user: User,
): AuthUser {
  const fullName =
    user.user_metadata
      ?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return {
    id: user.id,

    email: user.email ?? "",

    fullName,

    initials:
      deriveInitials(fullName),

    avatarUrl:
      user.user_metadata
        ?.avatar_url ?? null,
  };
}

/* -------------------------------------------------------------------------- */
/*                                  CONTEXT                                   */
/* -------------------------------------------------------------------------- */

const AuthContext =
  createContext<AuthContextValue>({
    user: null,

    session: null,

    loading: true,

    initialized: false,

    signOut: async () => {},

    refreshUser:
      async () => {},
  });

/* -------------------------------------------------------------------------- */
/*                                 PROVIDER                                   */
/* -------------------------------------------------------------------------- */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const router = useRouter();

  const [user, setUser] =
    useState<AuthUser | null>(
      null,
    );

  const [session, setSession] =
    useState<Session | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [
    initialized,
    setInitialized,
  ] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*                              LOAD CURRENT USER                         */
  /* ---------------------------------------------------------------------- */

  const refreshUser =
    useCallback(async () => {
      try {
        const {
          data: { user },
          error,
        } =
          await supabase.auth.getUser();

        if (error) {
          console.error(
            "Failed to fetch user:",
            error.message,
          );

          return;
        }

        if (!user) {
          setUser(null);

          setSession(null);

          return;
        }

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        setSession(session);

        setUser(
          buildAuthUser(user),
        );
      } catch (error) {
        console.error(
          "User refresh failed:",
          error,
        );
      }
    }, [supabase]);

  /* ---------------------------------------------------------------------- */
  /*                                 SIGN OUT                               */
  /* ---------------------------------------------------------------------- */

  const signOut =
    useCallback(async () => {
      try {
        setLoading(true);

        await supabase.auth.signOut();

        setUser(null);

        setSession(null);

        router.push("/login");

        router.refresh();
      } catch (error) {
        console.error(
          "Sign out failed:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, [router, supabase]);

  /* ---------------------------------------------------------------------- */
  /*                           INITIAL AUTH LOAD                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { user },
          error,
        } =
          await supabase.auth.getUser();

        if (!mounted) return;

        if (error && error.name !== "AuthSessionMissingError") {
          console.error("Initial auth error:", error.message);
        }

        if (user) {
          const {
            data: { session },
          } =
            await supabase.auth.getSession();

          setSession(session);

          setUser(
            buildAuthUser(user),
          );
        } else {
          setUser(null);

          setSession(null);
        }
      } catch (error) {
        console.error(
          "Auth initialization failed:",
          error,
        );
      } finally {
        if (mounted) {
          setLoading(false);

          setInitialized(true);
        }
      }
    }

    initializeAuth();

    /* ------------------------------------------------------------------ */
    /*                          AUTH STATE CHANGES                        */
    /* ------------------------------------------------------------------ */

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (
          event,
          session,
        ) => {

          if (
            event ===
            "SIGNED_OUT"
          ) {
            setUser(null);

            setSession(null);

            setLoading(false);

            return;
          }

          if (
            session?.user
          ) {
            setSession(session);

            setUser(
              buildAuthUser(
                session.user,
              ),
            );
          } else {
            setUser(null);

            setSession(null);
          }

          setLoading(false);

          router.refresh();
        },
      );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, [router, supabase]);

  /* ---------------------------------------------------------------------- */
  /*                              CONTEXT VALUE                             */
  /* ---------------------------------------------------------------------- */

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,

        session,

        loading,

        initialized,

        signOut,

        refreshUser,
      }),
      [
        user,
        session,
        loading,
        initialized,
        signOut,
        refreshUser,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    HOOK                                    */
/* -------------------------------------------------------------------------- */

export function useAuth() {
  return useContext(
    AuthContext,
  );
}