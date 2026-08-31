/**
 * Lists the voices available to your ElevenLabs account.
 *
 * Run:  npm run voices
 *
 * Prints voice ID, name, and labels so you can paste the ID you want
 * into scripts/voiceover.json (or ELEVENLABS_VOICE_ID in .env).
 * This is the authoritative list - published voice IDs go stale.
 */
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("ELEVENLABS_API_KEY is not set. Add it to .env, then re-run.");
  process.exit(1);
}

const res = await fetch("https://api.elevenlabs.io/v1/voices", {
  headers: { "xi-api-key": apiKey },
});

if (!res.ok) {
  console.error(`${res.status} ${res.statusText}`);
  console.error((await res.text()).slice(0, 400));
  process.exit(1);
}

const { voices } = await res.json();

// Surface American English female voices first - the brief for this project.
const score = (v) => {
  const l = v.labels ?? {};
  const blob = JSON.stringify(l).toLowerCase();
  let s = 0;
  if (blob.includes("american")) s += 2;
  if (blob.includes("female")) s += 2;
  if (/narrat|news|professional|calm|authorit/.test(blob)) s += 1;
  return s;
};

const sorted = [...voices].sort((a, b) => score(b) - score(a));

console.log(`\n${voices.length} voices available.`);
console.log('Best matches for "professional American English woman" first:\n');

for (const v of sorted) {
  const l = v.labels ?? {};
  const desc = [l.gender, l.accent, l.description, l.use_case].filter(Boolean).join(", ");
  const star = score(v) >= 4 ? "*" : " ";
  console.log(`${star} ${v.voice_id}  ${v.name.padEnd(14)} ${desc}`);
}

console.log("\n(* = matches your brief. Paste the ID into scripts/voiceover.json)");
