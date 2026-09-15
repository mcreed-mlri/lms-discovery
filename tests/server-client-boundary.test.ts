import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { test } from "vitest";

/**
 * Server entry points must not import a "use client" module.
 *
 * Route handlers and proxy.ts compile in the RSC/server layer, where every
 * export of a "use client" module becomes a client-reference stub rather than
 * the value. They *use* what they import at runtime, so a stub is silently
 * wrong: app/api/me/route.ts imported demoUser from lib/auth.tsx and answered
 * 200 with the `user` key missing, which bounced the Google demo login back to
 * /login with no error in any log.
 *
 * Deliberately scoped to route handlers and middleware. A server *component*
 * importing a client component is how client components get rendered at all —
 * app/login/page.tsx importing app/login/login-form.tsx is correct.
 *
 * This is static analysis, not a Next build: it catches the import-shaped
 * version of the mistake, not every RSC-boundary error. Cheap, and it is the
 * shape that shipped.
 */

const ROOT = path.resolve(__dirname, "..");
const SPECIFIER = /(?:from|import)\s*\(?\s*["'](@\/[^"']+|\.\.?\/[^"']+)["']/g;
const CANDIDATE_SUFFIXES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function findRouteHandlers(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) findRouteHandlers(full, found);
    else if (entry === "route.ts" || entry === "route.tsx") found.push(full);
  }
  return found;
}

/**
 * Both checks below run on comment-stripped source. Several modules here open
 * with a block-comment header, so a naive first-line directive check would be
 * wrong on exactly the files this walks — and a prose comment mentioning an
 * import would otherwise register as a real edge in the graph.
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'\w])\/\/.*$/gm, "$1");
}

function isClientModule(file: string): boolean {
  return /^["']use client["'];?/.test(stripComments(readFileSync(file, "utf8")).trim());
}

function resolveSpecifier(specifier: string, importer: string): string | null {
  const base = specifier.startsWith("@/")
    ? path.join(ROOT, specifier.slice(2))
    : path.resolve(path.dirname(importer), specifier);

  for (const suffix of CANDIDATE_SUFFIXES) {
    const candidate = base + suffix;
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // Not this shape; try the next suffix.
    }
  }
  // A bare package specifier (next/server, node:crypto, …) — not repo source.
  return null;
}

/** Breadth-first over the import graph, returning the chain to the first client module. */
function findClientImport(entry: string): string[] | null {
  const queue: string[][] = [[entry]];
  const visited = new Set([entry]);

  while (queue.length > 0) {
    const chain = queue.shift()!;
    const file = chain[chain.length - 1];
    const source = stripComments(readFileSync(file, "utf8"));

    for (const match of source.matchAll(SPECIFIER)) {
      const resolved = resolveSpecifier(match[1], file);
      if (!resolved || visited.has(resolved)) continue;
      visited.add(resolved);

      const nextChain = [...chain, resolved];
      if (isClientModule(resolved)) return nextChain;
      queue.push(nextChain);
    }
  }

  return null;
}

/**
 * Self-check. Without it, a broken regex or resolver turns the test below into
 * a no-op that passes forever.
 */
test("the client-module detector recognises a real client module", () => {
  assert.equal(isClientModule(path.join(ROOT, "lib/auth.tsx")), true);
  assert.equal(isClientModule(path.join(ROOT, "lib/auth-constants.ts")), false);
  assert.equal(isClientModule(path.join(ROOT, "lib/session.ts")), false);
  assert.notEqual(resolveSpecifier("@/lib/auth", path.join(ROOT, "proxy.ts")), null);
});

test('no route handler or middleware imports a "use client" module', () => {
  const entries = [...findRouteHandlers(path.join(ROOT, "app")), path.join(ROOT, "proxy.ts")];
  assert.ok(entries.length > 1, "expected to find route handlers to check");

  const violations = entries
    .map((entry) => findClientImport(entry))
    .filter((chain): chain is string[] => chain !== null)
    .map((chain) => chain.map((file) => path.relative(ROOT, file)).join(" -> "));

  assert.deepEqual(
    violations,
    [],
    `server entry points reaching a "use client" module:\n${violations.join("\n")}`,
  );
});
