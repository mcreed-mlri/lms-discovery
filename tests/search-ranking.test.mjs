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
const search = loadTypeScriptModule(path.join(rootDir, "lib", "search.ts"));

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test("exact title matches rank above tag-only matches", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "Client-Centered Communication");
  assert.equal(results[0].item.title, "Client-Centered Communication");
  assert.ok(results[0].score > results[1].score);
});

test("module can match through its parent course relationship", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "Professional Foundations");
  const titles = results.map((result) => result.item.title);
  assert.ok(titles.includes("Ethics and Confidentiality in Legal Aid"));
});

test("legal aid synonyms return expected learning content", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "DV");
  assert.equal(results[0].item.title, "Safety Screening and Crisis Recognition");
});

test("plural and singular query variants match", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "motions");
  assert.ok(results.some((result) => result.item.title === "Your First Steps in Court"));
});

test("irrelevant multi-token queries do not overmatch", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "banana patent submarine");
  assert.equal(results.length, 0);
});

test("facet filters constrain otherwise valid matches", () => {
  const results = search.searchLearningItems(data.getLearningItems(), "client", {
    audiences: ["Program staff"],
  });
  assert.equal(results.length, 0);
});
