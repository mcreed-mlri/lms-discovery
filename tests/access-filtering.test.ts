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

test("Sarah can see attorney-only and planned curriculum items", () => {
  const titles = titlesFor(sarah);
  assert.ok(titles.includes("Eviction Defense: The First 48 Hours"));
  // Planned curriculum offerings are open to all standard roles.
  assert.ok(titles.includes("Case Lifecycle"));
});

test("Kevin cannot see attorney-only discovery items", () => {
  const titles = titlesFor(kevin);
  assert.equal(titles.includes("Eviction Defense: The First 48 Hours"), false);
  assert.equal(titles.includes("The Four Notice Types"), false);
});

test("Kevin can see approved advocate-safe content", () => {
  const titles = titlesFor(kevin);
  assert.ok(titles.includes("Welcome to the Learning Hub"));
  // Planned curriculum offerings are advocate-safe (no attorney-only gate).
  assert.ok(titles.includes("Case Lifecycle"));
});

test("Kevin search results do not leak hidden titles", () => {
  const eligibleItems = getEligibleLearningItems(getLearningItems(), kevin);
  const results = searchLearningItems(eligibleItems, "notice");
  assert.equal(
    results.some((result) => result.item.title === "The Four Notice Types"),
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
