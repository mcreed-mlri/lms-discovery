/**
 * Finds a voice the current ElevenLabs plan can actually use via the API.
 *
 * Run:  npm run probe-voices
 *
 * The account key lacks `voices_read`, so the voice list cannot be fetched.
 * This instead attempts a 5-character synthesis against each well-known
 * premade voice and reports which succeed. Rejected calls (402/401) cost
 * nothing; successes cost ~5 characters each.
 *
 * Delete this file once a working voice is chosen.
 */
const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("ELEVENLABS_API_KEY is not set.");
  process.exit(1);
}

// Long-standing premade voices, which historically sit outside the Voice
// Library and so are available on free plans.
const CANDIDATES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", note: "American female, calm narration" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", note: "American female, soft news" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", note: "American female, strong" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", note: "American female, younger" },
  { id: "XrExE9yKIg1WjnnlVkGX", name: "Matilda", note: "American female, warm" },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Dorothy", note: "British female" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", note: "American male, deep" },
];

const working = [];

for (const v of CANDIDATES) {
  process.stdout.write(`${v.name.padEnd(9)} ${v.id}  ... `);

  let res;
  try {
    res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${v.id}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Test.", model_id: "eleven_multilingual_v2" }),
      },
    );
  } catch (err) {
    console.log(`network error: ${err.message}`);
    continue;
  }

  if (res.ok) {
    console.log("OK - usable on this plan");
    working.push(v);
    continue;
  }

  let reason = `${res.status}`;
  try {
    const body = await res.json();
    reason += ` ${body?.detail?.message ?? body?.detail?.status ?? ""}`;
  } catch {
    /* non-JSON body */
  }
  console.log(reason.trim());
}

console.log("");
if (working.length === 0) {
  console.log("No premade voice worked. This plan likely cannot use the TTS API at all.");
  console.log("Upgrading (Starter tier) is the remaining option.");
} else {
  console.log(`${working.length} usable voice(s):`);
  for (const v of working) {
    console.log(`  ${v.id}  ${v.name} - ${v.note}`);
  }
  console.log("");
  console.log("Set the one you prefer as ELEVENLABS_VOICE_ID in .env.local,");
  console.log("then run: npm run voiceover");
}
