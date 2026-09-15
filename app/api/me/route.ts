import { NextRequest, NextResponse } from "next/server";

import { demoUser, type User } from "@/lib/auth-constants";
import { getSessionSecret, SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * User types a real Brightspace login may be assigned via HUB_DEFAULT_USER_TYPE.
 * "admin" is intentionally excluded: admin capability stays behind
 * server-side secrets (see lib/admin-auth.ts), never a default.
 */
const ASSIGNABLE_USER_TYPES = ["attorney", "non_lawyer_advocate", "paralegal"] as const;

type AssignableUserType = (typeof ASSIGNABLE_USER_TYPES)[number];

function getDefaultUserType(): AssignableUserType {
  const configured = process.env.HUB_DEFAULT_USER_TYPE;
  if (ASSIGNABLE_USER_TYPES.includes(configured as AssignableUserType)) {
    return configured as AssignableUserType;
  }
  // Fail safe: the most restricted type until the UPL access matrix is
  // signed off and real role mapping exists.
  return "non_lawyer_advocate";
}

/**
 * Display name and avatar initials from the session's name fields.
 *
 * Deliberately does NOT fall back to `uniqueName`: for a Google session that is
 * the signed-in email address, and rendering someone's email as their display
 * name is worse than a generic fallback. The Brightspace branch keeps its own
 * `uniqueName` fallback, where a login name is a reasonable thing to show.
 */
function displayIdentity(rawFirst: string, rawLast: string) {
  const firstName = rawFirst || "Learner";
  const lastName = rawLast || "";
  return {
    firstName,
    name: [firstName, lastName].filter(Boolean).join(" "),
    initials:
      `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ""}`.toUpperCase(),
  };
}

export async function GET(request: NextRequest) {
  const secret = getSessionSecret();

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Login is disabled because SESSION_SECRET is not configured." },
      { status: 503 },
    );
  }

  const sessionUser = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value, secret);

  if (!sessionUser) {
    return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  }

  // Temporary staff-meeting demo window: every Google-gated login gets the demo
  // persona's entitlements, so the walkthrough shows the same full catalog to
  // everyone, but under the signer's own name so it reads as their hub rather
  // than someone else's. Only display fields are personalized; every field
  // lib/access.ts consults stays the persona's. The name comes from the ID
  // token's given_name/family_name, never from googleEmail, which stays
  // audit-only. See docs/adr/0012-temporary-google-gated-demo-login.md.
  if (sessionUser.provider === "google") {
    const user: User = {
      ...demoUser,
      ...displayIdentity(sessionUser.firstName, sessionUser.lastName),
      // Name is the signer's; everything else is the Sarah staff-preview
      // persona. Email stays blank (googleEmail is audit-only).
      email: "",
      accessLabel: "Demo access: full catalog",
    };

    return NextResponse.json({ ok: true, user });
  }

  const identity = displayIdentity(
    sessionUser.firstName || sessionUser.uniqueName,
    sessionUser.lastName,
  );

  // Role/attribute fields are pilot defaults until Brightspace user attributes
  // drive real mapping. Annotated as User so the shape is checked against the
  // one the client consumes, rather than asserted by a comment.
  const user: User = {
    id: `brightspace-${sessionUser.brightspaceUserId}`,
    ...identity,
    email: "",
    // Display-only mock for the current demo experience. Access still comes
    // from userType (HUB_DEFAULT_USER_TYPE / the restricted default), not this.
    title: "MLRI Staff Attorney",
    organization: "MLRI",
    unit: "",
    userType: getDefaultUserType(),
    accessStatus: "approved",
    jurisdiction: ["MA"],
    practiceArea: [],
  };

  return NextResponse.json({ ok: true, user });
}
