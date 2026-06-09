import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { createReadStream, readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 5173);
loadEnvFile(".env.local");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".webm": "audio/webm",
};

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match || process.env[match[1]]) continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    return;
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  return join(root, clean === "/" ? "index.html" : clean);
}

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "speech";
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function handleSpeech(req, res) {
  if (!process.env.OPENAI_API_KEY) return sendJson(res, 500, { error: "OPENAI_API_KEY missing" });
  const url = new URL(req.url, `http://${req.headers.host}`);
  const text = (url.searchParams.get("text") || "").trim();
  if (!text) return sendJson(res, 400, { error: "Missing text" });

  const audioDir = join(root, "assets", "audio");
  await mkdir(audioDir, { recursive: true });
  const outPath = join(audioDir, `${slug(text)}.mp3`);
  try {
    await stat(outPath);
    res.writeHead(200, { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000" });
    createReadStream(outPath).pipe(res);
    return;
  } catch {
    // Generate below.
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: text,
      response_format: "mp3",
      speed: text.length === 1 ? 0.72 : 0.86,
      instructions: "Speak clearly for a young English learner. Use a warm natural teacher voice.",
    }),
  });
  if (!response.ok) return sendJson(res, response.status, { error: await response.text() });
  const audio = Buffer.from(await response.arrayBuffer());
  await writeFile(outPath, audio);
  res.writeHead(200, { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=31536000" });
  res.end(audio);
}

async function handleTranscribe(req, res) {
  if (!process.env.OPENAI_API_KEY) return sendJson(res, 500, { error: "OPENAI_API_KEY missing" });
  const audio = await readBody(req);
  if (!audio.length) return sendJson(res, 400, { error: "Missing audio" });

  const form = new FormData();
  const contentType = req.headers["content-type"] || "audio/webm";
  const extension = contentType.includes("mpeg") || contentType.includes("mp3") ? "mp3" : contentType.includes("wav") ? "wav" : "webm";
  form.append("model", "gpt-4o-mini-transcribe");
  form.append("response_format", "json");
  form.append("language", "en");
  form.append("prompt", "A child is repeating one English letter or one simple English word for an alphabet learning game.");
  form.append("file", new Blob([audio], { type: contentType }), `repeat.${extension}`);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });
  if (!response.ok) return sendJson(res, response.status, { error: await response.text() });
  const result = await response.json();
  sendJson(res, 200, { text: result.text || "" });
}

async function serveStatic(req, res) {
  const filePath = safePath(req.url);
  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("not file");
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  } catch {
    sendJson(res, 404, { error: "Not found" });
  }
}

createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api/speech")) return await handleSpeech(req, res);
    if (req.url.startsWith("/api/transcribe") && req.method === "POST") return await handleTranscribe(req, res);
    return await serveStatic(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
}).listen(port, () => {
  console.log(`Alphabet Light Hero Quest running at http://localhost:${port}`);
});
