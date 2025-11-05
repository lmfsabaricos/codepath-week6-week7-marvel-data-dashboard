const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5174;
const CV_KEY = process.env.COMICVINE_API_KEY;
const CV_BASE = "https://comicvine.gamespot.com/api";

// map ComicVine character to a Marvel-like shape we use in UI
function mapCharacter(c) {
  const img = c.image?.original_url || "";
  return {
    id: c.id,                         // ComicVine character id (numeric part)
    name: c.name || "Unknown",
    description: c.deck || "",
    comics: { available: c.count_of_issue_appearances || 0 },
    series: { available: c.count_of_issue_appearances || 0 },
    stories: { available: Math.floor((c.count_of_issue_appearances || 0) * 0.6) },
    thumbnail: img ? { path: img, extension: "jpg" } : null
  };
}

async function fetchJSON(url) {
  const r = await fetch(url, { headers: { "User-Agent": "CodePath-Dashboard" } });
  const text = await r.text();
  try { return { status: r.status, json: JSON.parse(text) }; }
  catch { return { status: r.status, json: { error: "bad_json", raw: text } }; }
}

// list / search
app.get("/api/characters", async (req, res) => {
  if (!CV_KEY) return res.status(500).json({ error: "missing_key", hint: "Set COMICVINE_API_KEY in .env" });
  const q = req.query.q || "";
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);

  const url = new URL(`${CV_BASE}/characters/`);
  url.searchParams.set("api_key", CV_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  if (q) url.searchParams.set("filter", `name:${q}`);

  const { status, json } = await fetchJSON(url.toString());
  if (status !== 200) return res.status(status).json(json);

  const results = (json.results || []).map(mapCharacter);
  res.json({ data: { total: json.number_of_total_results || results.length, results } });
});

app.get("/api/characters/:id", async (req, res) => {
  if (!CV_KEY) return res.status(500).json({ error: "missing_key" });
  const { id } = req.params;
  const url = new URL(`${CV_BASE}/character/4005-${id}/`);
  url.searchParams.set("api_key", CV_KEY);
  url.searchParams.set("format", "json");

  const { status, json } = await fetchJSON(url.toString());
  if (status !== 200) return res.status(status).json(json);

  const result = json.results ? mapCharacter(json.results) : null;
  res.json({ data: { results: result ? [result] : [] } });
});

app.get("/health", (_req, res) => res.json({ ok: true, keyLoaded: !!CV_KEY, port: PORT }));

app.listen(PORT, () => console.log(`ComicVine proxy running http://localhost:${PORT}`));
