/**
 * Generates voiceover audio from ElevenLabs, offline.
 *
 * Run:  npm run voiceover
 *
 * Reads ELEVENLABS_API_KEY from .env via Node's --env-file flag.
 * The key stays on the Node side and never reaches the browser bundle.
 * Output lands in audio/<id>.mp3 and is skipped if it already exists,
 * so re-runs don't burn API credits on unchanged lines.
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// public/audio so Next serves the files at /audio/<id>.mp3
const outDir = join(root, "public", "audio");

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error(
    "ELEVENLABS_API_KEY is not set.\n" + "Add it to .env (no VITE_ prefix), then re-run.",
  );
  process.exit(1);
}

const manifest = JSON.parse(await readFile(join(root, "scripts", "voiceover.json"), "utf8"));
const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || manifest.voiceId;
const voiceId = defaultVoiceId;
if (!voiceId) {
  console.error("No voice ID. Set ELEVENLABS_VOICE_ID or voiceId in voiceover.json.");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

let made = 0;
let skipped = 0;

for (const line of manifest.lines) {
  const dest = join(outDir, `${line.id}.mp3`);

  if (await exists(dest)) {
    console.log(`skip   ${line.id}.mp3 (already exists)`);
    skipped++;
    continue;
  }

  process.stdout.write(
    `fetch  ${line.id.padEnd(12)} ${(line.voiceId ? "voice:" + line.voiceId.slice(0, 8) : "default").padEnd(16)} ... `,
  );

  // A line may name its own voice - used for the call transcript, where the
  // client and the advocate are different speakers from the narrator.
  const lineVoice = line.voiceId ?? defaultVoiceId;

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${lineVoice}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: line.text,
        model_id: manifest.modelId ?? "eleven_multilingual_v2",
        // Higher stability = steadier, less theatrical delivery, which is
        // what you want for legal explainer content. Lower it toward 0.4
        // if the read sounds flat.
        voice_settings: manifest.voiceSettings ?? {
          stability: 0.6,
          similarity_boost: 0.8,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!res.ok) {
    console.log("FAILED");
    console.error(`  ${res.status} ${res.statusText}`);
    console.error(`  ${(await res.text()).slice(0, 400)}`);
    process.exit(1);
  }

  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log("ok");
  made++;
}

console.log(`\nDone. ${made} generated, ${skipped} skipped. Files in public/audio/`);
