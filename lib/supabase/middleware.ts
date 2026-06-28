import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextRequest,
  NextResponse,
} from "next/server";

/* -------------------------------------------------------------------------- */
/*                                   ROUTES                                   */
/* -------------------------------------------------------------------------- */

const protectedRoutes = [
  "/dashboard",
  "/protocols",
  "/progress",
  "/schedule",
  "/settings",
];

const authRoutes = [
  "/login",
  "/signup",
];

/* -------------------------------------------------------------------------- */
/*                                MIDDLEWARE                                  */
/* -------------------------------------------------------------------------- */

export async function middleware(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  /* ---------------------------------------------------------------------- */
  /*                         CREATE SUPABASE CLIENT                          */
  /* ---------------------------------------------------------------------- */

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,

      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,

      {
        cookies: {
          get(name: string) {
            return request.cookies.get(
              name,
            )?.value;
          },

          set(
            name: string,
            value: string,
            options,
          ) {
            request.cookies.set({
              name,
              value,
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value,
              ...options,
            });
          },

          remove(
            name: string,
            options,
          ) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });

            response =
              NextResponse.next({
                request,
              });

            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      },
    );

  /* ---------------------------------------------------------------------- */
  /*                               GET USER                                  */
  /* ---------------------------------------------------------------------- */

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError) {
    console.error(
      "Middleware auth error:",
      authError.message,
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                               PATH INFO                                 */
  /* ---------------------------------------------------------------------- */

  const pathname =
    request.nextUrl.pathname;

  const isProtectedRoute =
    protectedRoutes.some(
      (route) =>
        pathname.startsWith(route),
    );

  const isAuthRoute =
    authRoutes.some((route) =>
      pathname.startsWith(route),
    );

  const isOnboardingRoute =
    pathname.startsWith(
      "/onboarding",
    );

  /* ---------------------------------------------------------------------- */
  /*                   REDIRECT UNAUTHENTICATED USERS                        */
  /* ---------------------------------------------------------------------- */

  if (
    isProtectedRoute &&
    !user
  ) {
    return NextResponse.redirect(
      new URL(
        `/login?next=${encodeURIComponent(
          pathname,
        )}`,
        request.url,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /*              REDIRECT UNAUTH USERS FROM ONBOARDING                      */
  /* ---------------------------------------------------------------------- */

  if (
    isOnboardingRoute &&
    !user
  ) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }

  /* ---------------------------------------------------------------------- */
  /*                        USER PROFILE + ONBOARDING                        */
  /* ---------------------------------------------------------------------- */

  if (user) {
    const {
      data: profile,
      error:
        profileError,
    } =
      await supabase
        .from("profiles")
        .select(
          "onboarding_completed",
        )
        .eq("id", user.id)
        .single();

    if (profileError) {
      console.error(
        "Profile fetch error:",
        profileError.message,
      );
    }

    const onboardingCompleted =
      profile
        ?.onboarding_completed ??
      false;

    /* ------------------------------------------------------------------ */
    /* FORCE ONBOARDING */
    /* ------------------------------------------------------------------ */

    if (
      !onboardingCompleted &&
      !isOnboardingRoute
    ) {
      return NextResponse.redirect(
        new URL(
          "/onboarding",
          request.url,
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* PREVENT RETURNING TO ONBOARDING */
    /* ------------------------------------------------------------------ */

    if (
      onboardingCompleted &&
      isOnboardingRoute
    ) {
      return NextResponse.redirect(
        new URL(
          "/dashboard",
          request.url,
        ),
      );
    }

    /* ------------------------------------------------------------------ */
    /* REDIRECT AUTH USERS FROM LOGIN/SIGNUP */
    /* ------------------------------------------------------------------ */

    if (isAuthRoute) {
      return NextResponse.redirect(
        new URL(
          onboardingCompleted
            ? "/dashboard"
            : "/onboarding",
          request.url,
        ),
      );
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                                RESPONSE                                 */
  /* ---------------------------------------------------------------------- */

  return response;
}

/* -------------------------------------------------------------------------- */
/*                                  MATCHER                                   */
/* -------------------------------------------------------------------------- */

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};