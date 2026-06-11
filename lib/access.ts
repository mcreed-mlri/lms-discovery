import { courses, type LearningItem } from "@/lib/data";
import { getSearchMetadata, type AccessUserType } from "@/lib/search-metadata";

export type AccessProfile = {
  userType: AccessUserType;
  accessStatus: "approved" | "pending" | "suspended" | "inactive";
  jurisdiction?: string[];
  uplAcknowledgedDate?: string;
};

function hasJurisdictionAccess(user: AccessProfile, allowedJurisdictions?: string[]) {
  if (!allowedJurisdictions?.length) return true;
  return allowedJurisdictions.some((jurisdiction) => user.jurisdiction?.includes(jurisdiction));
}

function hasUplAccess(user: AccessProfile, requiresUplAck?: boolean) {
  if (!requiresUplAck) return true;
  if (user.userType === "attorney" || user.userType === "admin") return true;
  return Boolean(user.uplAcknowledgedDate);
}

export function canAccessLearningItem(
  user: AccessProfile | null | undefined,
  item: LearningItem,
): boolean {
  if (!user || user.accessStatus !== "approved") return false;
  if (user.userType === "admin") return true;

  const metadata = getSearchMetadata(item);
  const access = metadata.access;

  if (!access.allowedUserTypes.includes(user.userType)) return false;
  if (!hasJurisdictionAccess(user, access.jurisdictions)) return false;
  if (!hasUplAccess(user, access.requiresUplAck)) return false;

  if (item.type === "PATH") {
    const relatedCourses = courses.filter((course) => item.courseIds.includes(course.id));
    return relatedCourses.every((course) =>
      canAccessLearningItem(user, { ...course, type: "COURSE" as const }),
    );
  }

  return true;
}

export function getEligibleLearningItems(
  items: LearningItem[],
  user: AccessProfile | null | undefined,
) {
  return items.filter((item) => canAccessLearningItem(user, item));
}

export function getAccessLabel(userType: AccessUserType) {
  if (userType === "non_lawyer_advocate") return "Non-lawyer advocate";
  if (userType === "attorney") return "Attorney";
  if (userType === "paralegal") return "Paralegal";
  return "Admin";
}

export function getEffectiveDashboardRole(
  user: AccessProfile | null | undefined,
): "learner" | "super_admin" {
  if (user?.accessStatus === "approved" && user.userType === "admin") return "super_admin";
  return "learner";
}
