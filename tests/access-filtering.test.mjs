import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleCache = new Map();

function resolveModule(request, fromFile) {
  if (request.startsWith("@/")) return path.join(rootDir, `${request.slice(2)}.ts`);
  if (request.startsWith(".")) return path.resolve(path.dirname(fromFile), `${request}.ts`);
  throw new Error(`Unsupported test import: ${request}`);
}

function loadTypeScriptModule(filePath) {
  const normalizedPath = path.normalize(filePath);
  if (moduleCache.has(normalizedPath)) return moduleCache.get(normalizedPath).exports;

  const source = fs.readFileSync(normalizedPath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(normalizedPath, module);

  const localRequire = (request) => loadTypeScriptModule(resolveModule(request, normalizedPath));
  const execute = new Function("require", "exports", "module", output);
  execute(localRequire, module.exports, module);
  return module.exports;
}

const data = loadTypeScriptModule(path.join(rootDir, "lib", "data.ts"));
const access = loadTypeScriptModule(path.join(rootDir, "lib", "access.ts"));
const search = loadTypeScriptModule(path.join(rootDir, "lib", "search.ts"));

const sarah = {
  userType: "attorney",
  accessStatus: "approved",
  jurisdiction: ["MA"],
};

const kevin = {
  userType: "non_lawyer_advocate",
  accessStatus: "approved",
  jurisdiction: ["MA"],
  uplAcknowledgedDate: "2026-06-01",
};

const suspendedKevin = {
  ...kevin,
  accessStatus: "suspended",
};

function titlesFor(user) {
  return access.getEligibleLearningItems(data.getLearningItems(), user).map((item) => item.title);
}

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
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
  assert.ok(titles.includes("UPL Boundaries for Advocates"));
  assert.ok(titles.includes("Client-Centered Communication"));
  assert.ok(titles.includes("Advocate UPL Onboarding"));
});

test("Kevin search results do not leak hidden titles", () => {
  const eligibleItems = access.getEligibleLearningItems(data.getLearningItems(), kevin);
  const results = search.searchLearningItems(eligibleItems, "first appearance");
  assert.equal(results.some((result) => result.item.title === "The First Appearance Checklist"), false);
});

test("Suspended or inactive users receive no discovery items", () => {
  assert.equal(access.getEligibleLearningItems(data.getLearningItems(), suspendedKevin).length, 0);
  assert.equal(access.getEligibleLearningItems(data.getLearningItems(), { ...kevin, accessStatus: "inactive" }).length, 0);
});
