import { describe, expect, test } from "vitest";

import { analyzeQuery, citations, findCitations, synonymGroups } from "@/lib/search-vocabulary";
import { normalize } from "@/lib/search-text";

/* content/search/*.json is edited by the content team. These checks catch a
   malformed edit before it silently changes search. */

describe("content/search/vocabulary.json", () => {
  test("every group has at least two terms, none empty", () => {
    for (const group of synonymGroups) {
      expect(group.length, group.join(" / ")).toBeGreaterThanOrEqual(2);
      group.forEach((term) => expect(term).not.toBe(""));
    }
  });

  test("no term belongs to two groups", () => {
    const seen = new Map<string, number>();
    const duplicates: string[] = [];
    synonymGroups.forEach((group, index) =>
      group.forEach((term) => {
        if (seen.has(term) && seen.get(term) !== index) duplicates.push(term);
        seen.set(term, index);
      }),
    );
    expect(duplicates).toEqual([]);
  });
});

describe("content/search/citations.json", () => {
  test("every citation is recognised and says what it means", () => {
    for (const entry of citations) {
      expect(entry.key, entry.cite).not.toBeNull();
      expect(entry.means.length, entry.cite).toBeGreaterThan(0);
    }
  });

  test("no two citations share a key", () => {
    const keys = citations.map((entry) => entry.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("citations in a query", () => {
  test.each([
    ["G.L. c. 239", "chapter:239"],
    ["M.G.L. c. 239 § 8A", "chapter:239"],
    ["chapter 239", "chapter:239"],
    ["ch. 186", "chapter:186"],
    ["MGL 239", "chapter:239"],
    ["Mass. G. Evid. § 801", "evidence:801"],
    ["Guide to Evidence 803", "evidence:803"],
    ["FRE 805", "evidence:805"],
  ])("%s is %s", (query, key) => {
    expect(findCitations(normalize(query)).map((match) => match.key)).toContain(key);
  });

  test("ordinary numbers are not citations", () => {
    expect(findCitations(normalize("14-day notice"))).toEqual([]);
    expect(findCitations(normalize("part 2 of 5"))).toEqual([]);
  });

  test("a citation becomes one concept, and its words are not searched on their own", () => {
    const { concepts, citations: found } = analyzeQuery("G.L. c. 239 answer");
    expect(found.map((entry) => entry.cite)).toEqual(["G.L. c. 239"]);
    expect(concepts).toEqual([["summary process", "eviction", "notice to quit"], ["answer"]]);
  });

  test("a synonym group becomes one concept", () => {
    expect(analyzeQuery("NTQ deadline").concepts).toEqual([
      ["notice to quit", "ntq"],
      ["deadline"],
    ]);
  });
});
