export const PROXY = "http://localhost:5174/api";

export async function getCharacters({ q = "", limit = 20, offset = 0 }) {
  const p = new URLSearchParams({ q, limit: String(limit), offset: String(offset) });
  const res = await fetch(`${PROXY}/characters?${p.toString()}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getCharacterById(id) {
  const res = await fetch(`${PROXY}/characters/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
