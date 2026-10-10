/* Text handling shared by library search, binder search and the search
   vocabulary: one normalisation, one tokeniser, one list of filler words. */

export function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string) {
  return normalize(value).split(" ").filter(Boolean);
}

/* Words that carry no topic on their own. A question like "how do I respond
   to a hearsay objection" is matched on "respond hearsay objection". If a
   query is nothing but these words, they are kept so it can still match. */
export const STOP_WORDS = new Set(
  (
    "a about after an and any are as at be been before but by can could did do does doing " +
    "during for from get gets getting got had has have how i if in into is it its just me " +
    "my need needs of on or our should so than that the their them then there these they " +
    "this to too up us was we were what when where which while who why will with would " +
    "you your many much"
  ).split(" "),
);

/** Query words that carry meaning: filler words dropped, unless nothing is left. */
export function meaningfulTokens(tokens: string[]) {
  const kept = tokens.filter((token) => !STOP_WORDS.has(token));
  return kept.length > 0 ? kept : tokens;
}

/** Whether `phrase` appears in `text` as whole words (both already normalised). */
export function containsPhrase(text: string, phrase: string) {
  return phrase.length > 0 && ` ${text} `.includes(` ${phrase} `);
}
