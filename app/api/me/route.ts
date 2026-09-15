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

  // Temporary staff-meeting demo window: every Google-gated login shares one
  // identity so the demo is consistent regardless of which MLRI Google
  // account signed in. See docs/adr/0012-temporary-google-gated-demo-login.md.
  if (sessionUser.provider === "google") {
    return NextResponse.json({ ok: true, user: demoUser });
  }

  const firstName = sessionUser.firstName || sessionUser.uniqueName || "Learner";
  const lastName = sessionUser.lastName || "";
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ""}`.toUpperCase();

  // Role/attribute fields are pilot defaults until Brightspace user attributes
  // drive real mapping. Annotated as User so the shape is checked against the
  // one the client consumes, rather than asserted by a comment.
  const user: User = {
    id: `brightspace-${sessionUser.brightspaceUserId}`,
    name,
    firstName,
    email: "",
    title: "Learner",
    organization: "LACE",
    unit: "",
    initials,
    userType: getDefaultUserType(),
    accessStatus: "approved",
    jurisdiction: ["MA"],
    practiceArea: [],
  };

  return NextResponse.json({ ok: true, user });
}
