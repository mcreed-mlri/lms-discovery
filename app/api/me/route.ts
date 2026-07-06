import { NextRequest, NextResponse } from "next/server";

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

  const firstName = sessionUser.firstName || sessionUser.uniqueName || "Learner";
  const lastName = sessionUser.lastName || "";
  const name = [firstName, lastName].filter(Boolean).join(" ");
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ""}`.toUpperCase();

  // Matches the client User shape in lib/auth.tsx. Role/attribute fields are
  // pilot defaults until Brightspace user attributes drive real mapping.
  return NextResponse.json({
    ok: true,
    user: {
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
    },
  });
}
