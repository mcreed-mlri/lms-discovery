import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE } from "@/lib/session-constants";
import { verifySessionTokenEdge } from "@/lib/session-edge";

/**
 * Server-side route gating.
 *
 * Before this existed, every gated page was a client component that rendered a
 * loading card, called /api/me from an effect, and only then decided whether to
 * redirect. Two consequences: role gating was entirely client-side, and the
 * first paint was *always* a spinner even for a signed-in user, because the
 * session cookie was never read until the browser asked for it.
 *
 * Checking the cookie here means an unauthenticated request never reaches the
 * page, and an authenticated one skips the waterfall.
 *
 * Scope note: this gates the routes that already gated themselves client-side.
 * /learn/[slug] is deliberately NOT included — it is a statically generated,
 * per-item page with its own generateMetadata, i.e. a shareable deep link.
 * Making it private is a product decision, not a refactor.
 */

const PROTECTED_PREFIXES = ["/browse", "/curriculum-map", "/updates", "/my-learning", "/dashboard"];

/**
 * Demo personas live in localStorage, not in a cookie, so there is nothing here
 * for middleware to verify. Gating while they are enabled would redirect a demo
 * user to /login forever — they would pick a persona, land back on a gated
 * route, and bounce again. When personas are on, the client-side gate remains
 * the only gate. Both flags are NEXT_PUBLIC_*, so they are inlined at build.
 */
const demoPersonasEnabled =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
  process.env.NEXT_PUBLIC_SHOW_DEMO_USERS === "true";

function isProtected(pathname: string) {
  if (pathname === "/") return true;
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function middleware(request: NextRequest) {
  if (demoPersonasEnabled) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    // Fail open, loudly. Without a secret the OAuth callback cannot mint a
    // session either, so nobody could get past a closed gate — a misconfigured
    // deploy would be a total lockout rather than a degraded one. Data access
    // does not rely on this check: /api/me verifies the cookie server-side and
    // Supabase reads are RLS-scoped, so failing open cannot leak records.
    console.warn("[lace] SESSION_SECRET is not set — middleware auth gate is disabled");
    return NextResponse.next();
  }

  const session = await verifySessionTokenEdge(request.cookies.get(SESSION_COOKIE)?.value, secret);
  if (session) return NextResponse.next();

  // Preserve where they were headed so login can send them back.
  const loginUrl = new URL("/login", request.url);
  const returnTo = `${pathname}${search}`;
  if (returnTo && returnTo !== "/") loginUrl.searchParams.set("returnTo", returnTo);

  const response = NextResponse.redirect(loginUrl);
  // An expired or forged cookie should not linger and re-trigger this on every
  // navigation.
  if (request.cookies.has(SESSION_COOKIE)) response.cookies.delete(SESSION_COOKIE);
  return response;
}

export const config = {
  /**
   * Skip API routes (they do their own auth and must return 401 rather than a
   * redirect), Next internals, and anything with a file extension. /login and
   * the OAuth callback must stay reachable while signed out.
   */
  matcher: ["/((?!api|_next/static|_next/image|login|favicon.ico|.*\\.).*)"],
};
