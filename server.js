// server.js (CommonJS)
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const fetch = require("node-fetch"); // v2 (CommonJS)
require("dotenv").config();

const app = express();
app.use(cors());

const PUBLIC = process.env.MARVEL_PUBLIC_KEY;
const PRIVATE = process.env.MARVEL_PRIVATE_KEY;
const PORT = process.env.PORT || 5174;
const BASE = "https://gateway.marvel.com/v1/public";

function md5(s) {
  return crypto.createHash("md5").update(s).digest("hex");
}

// Generic proxy: /api/marvel/<resource>?<query>
// e.g., /api/marvel/characters?nameStartsWith=spider&limit=50
app.get("/api/marvel/:resource", async (req, res) => {
  try {
    const ts = Date.now().toString();
    const hash = md5(ts + PRIVATE + PUBLIC);

    const params = new URLSearchParams(req.query);
    params.set("ts", ts);
    params.set("apikey", PUBLIC);
    params.set("hash", hash);

    const url = `${BASE}/${req.params.resource}?${params.toString()}`;
    const r = await fetch(url);
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).send(text);
    }
    const json = await r.json();
    res.json(json);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(PORT, () => {
  console.log(`Marvel proxy running on http://localhost:${PORT}`);
});
