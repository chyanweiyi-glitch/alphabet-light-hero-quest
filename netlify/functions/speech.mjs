const jsonHeaders = { "Content-Type": "application/json; charset=utf-8" };

function json(statusCode, body) {
  return { statusCode, headers: jsonHeaders, body: JSON.stringify(body) };
}

export async function handler(event) {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return json(500, { error: "OPENAI_API_KEY missing" });

  const text = (event.queryStringParameters?.text || "").trim();
  if (!text) return json(400, { error: "Missing text" });

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

  if (!response.ok) {
    return json(response.status, { error: await response.text() });
  }

  const audio = Buffer.from(await response.arrayBuffer());
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=604800",
    },
    isBase64Encoded: true,
    body: audio.toString("base64"),
  };
}
