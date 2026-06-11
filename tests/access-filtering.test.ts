import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getEffectiveDashboardRole,
  getEligibleLearningItems,
  type AccessProfile,
} from "@/lib/access";
import { getLearningItems } from "@/lib/data";
import { searchLearningItems } from "@/lib/search";

const sarah: AccessProfile = {
  userType: "attorney",
  accessStatus: "approved",
  jurisdiction: ["MA"],
};

const kevin: AccessProfile = {
  userType: "non_lawyer_advocate",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  uplAcknowledgedDate: "2026-06-01",
};

const suspendedKevin: AccessProfile = {
  ...kevin,
  accessStatus: "suspended",
};

const admin: AccessProfile = {
  userType: "admin",
  accessStatus: "approved",
  jurisdiction: ["MA"],
};

function titlesFor(user: AccessProfile) {
  return getEligibleLearningItems(getLearningItems(), user).map((item) => item.title);
}

test("Sarah can see attorney and new-attorney items", () => {
  const titles = titlesFor(sarah);
  assert.ok(titles.includes("New Attorney Foundations"));
  assert.ok(titles.includes("Your First Steps in Court"));
});

test("Kevin cannot see attorney-only discovery items", () => {
  const titles = titlesFor(kevin);
  assert.equal(titles.includes("New Attorney Foundations"), false);
  assert.equal(titles.includes("Your First Steps in Court"), false);
  assert.equal(titles.includes("Eviction Defense: The First 48 Hours"), false);
});

test("Kevin can see approved advocate-safe courses", () => {
  const titles = titlesFor(kevin);
  assert.ok(titles.includes("Legal Boundaries for Advocates"));
  assert.ok(titles.includes("Client-Centered Communication"));
  assert.ok(titles.includes("Advocate Boundaries Onboarding"));
});

test("Kevin search results do not leak hidden titles", () => {
  const eligibleItems = getEligibleLearningItems(getLearningItems(), kevin);
  const results = searchLearningItems(eligibleItems, "first appearance");
  assert.equal(
    results.some((result) => result.item.title === "The First Appearance Checklist"),
    false,
  );
});

test("Suspended or inactive users receive no discovery items", () => {
  assert.equal(getEligibleLearningItems(getLearningItems(), suspendedKevin).length, 0);
  assert.equal(
    getEligibleLearningItems(getLearningItems(), { ...kevin, accessStatus: "inactive" }).length,
    0,
  );
});

test("MLRI Admin can see the full discovery catalog", () => {
  assert.equal(
    getEligibleLearningItems(getLearningItems(), admin).length,
    getLearningItems().length,
  );
});

test("Only admin receives the effective super-admin dashboard role", () => {
  assert.equal(getEffectiveDashboardRole(admin), "super_admin");
  assert.equal(getEffectiveDashboardRole(sarah), "learner");
  assert.equal(getEffectiveDashboardRole(kevin), "learner");
});
