const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

function audioExtension(contentType) {
  if (contentType.includes("mp4")) return "mp4";
  if (contentType.includes("mpeg") || contentType.includes("mp3")) return "mp3";
  if (contentType.includes("ogg")) return "ogg";
  if (contentType.includes("wav")) return "wav";
  if (contentType.includes("webm")) return "webm";
  return "webm";
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: "OPENAI_API_KEY missing" });
  if (!event.body) return json(400, { error: "Missing audio" });

  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "audio/webm";
  const audio = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body, "binary");
  if (!audio.length) return json(400, { error: "Missing audio" });

  const form = new FormData();
  form.append("model", "gpt-4o-mini-transcribe");
  form.append("response_format", "json");
  form.append("language", "en");
  form.append("prompt", "A child is repeating one English letter or one simple English word for an alphabet learning game. Prefer simple alphabet letters and common kid words.");
  form.append("file", new Blob([audio], { type: contentType }), `repeat.${audioExtension(contentType)}`);

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: form,
  });

  if (!response.ok) {
    return json(response.status, { error: await response.text() });
  }

  const result = await response.json();
  return json(200, { text: result.text || "" });
}
