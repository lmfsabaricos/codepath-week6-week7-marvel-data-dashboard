import { useEffect, useMemo, useState } from "react";

const PROXY = "http://localhost:5174/api/marvel"; // our secure backend

export default function App() {
  // controls
  const [q, setQ] = useState("spider");     // search name
  const [minComics, setMinComics] = useState(0); // slider filter
  const [page, setPage] = useState(0);

  // data
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const limit = 50; // bigger page to ensure 10+ rows after filtering

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(page * limit)
        });
        const qTrim = q.trim();
        if (qTrim) params.set("nameStartsWith", qTrim);

        const res = await fetch(`${PROXY}/characters?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setRows(json.data.results || []);
        setTotal(json.data.total || 0);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q, page]);

  // live filter on comics count
  const filtered = useMemo(
    () => rows.filter(c => (c.comics?.available ?? 0) >= minComics),
    [rows, minComics]
  );

  // summary stats
  const stats = useMemo(() => {
    if (!filtered.length) return { count: 0, avgComics: 0, medianStories: 0, pctDesc: 0 };
    const comics = filtered.map(c => c.comics?.available ?? 0);
    const stories = filtered.map(c => c.stories?.available ?? 0);
    const avgComics = comics.reduce((a,b)=>a+b,0)/comics.length;
    const srt = [...stories].sort((a,b)=>a-b);
    const mid = Math.floor(srt.length/2);
    const medianStories = srt.length % 2 ? srt[mid] : (srt[mid-1]+srt[mid])/2;
    const pctDesc = (filtered.filter(c => (c.description||"").trim()).length / filtered.length) * 100;
    return { count: filtered.length, avgComics, medianStories, pctDesc };
  }, [filtered]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "240px 1fr",
      minHeight: "100vh",
      color: "white"
    }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ fontWeight: 800, marginBottom: 16, fontSize: 18 }}>🪐 AstroDash</div>
        <div className="card" style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.count}</div>
          <div>Characters (filtered)</div>
        </div>
        <nav style={{ display: "grid", gap: 8 }}>
          <div className="card">🏠 Dashboard</div>
          <div className="card">🔍 Search</div>
          <div className="card">ℹ️ About</div>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ padding: 20 }}>
        {/* Header */}
        <h1 style={{ margin: 0, marginBottom: 12 }}>Marvel Character Dashboard</h1>

        {/* Stat Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12,
          marginBottom: 16
        }}>
          <div className="card">
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.avgComics.toFixed(1)}</div>
            <div>Avg Comics Available</div>
          </div>
          <div className="card">
            <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.medianStories.toFixed(0)}</div>
            <div>Median Stories</div>
          </div>
          <div className="card">
            <div style={{ fontSize: 28, fontWeight: 700 }}>{`${stats.pctDesc.toFixed(0)}%`}</div>
            <div>With Description</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: 12
        }}>
          <input
            className="input"
            placeholder="Search name starts with… (spider, iron, cap)"
            value={q}
            onChange={e => { setPage(0); setQ(e.target.value); }}
            style={{ minWidth: 280 }}
          />
          <div className="card" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>Min Comics</span>
            <input
              type="range"
              min={0}
              max={500}
              value={minComics}
              onChange={e => setMinComics(Number(e.target.value))}
              style={{ width: 220 }}
            />
            <strong>{minComics}</strong>
          </div>
          <button className="btn" onClick={() => setPage(p => Math.max(0, p-1))} disabled={page===0}>← Prev</button>
          <button className="btn" onClick={() => setPage(p => p+1)} disabled={(page+1)*limit >= total}>Next →</button>
          <span style={{ opacity:.8 }}>Page {page+1} • Total {total}</span>
        </div>

        {/* List */}
        <div className="card">
          {loading ? (
            <p>Loading…</p>
          ) : err ? (
            <p style={{ color: "#ff9c9c" }}>Error: {err}</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Comics</th>
                    <th>Series</th>
                    <th>Stories</th>
                    <th>Thumbnail</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id}>
                      <td title={c.description || ""}>{c.name}</td>
                      <td>{c.comics?.available ?? 0}</td>
                      <td>{c.series?.available ?? 0}</td>
                      <td>{c.stories?.available ?? 0}</td>
                      <td>
                        {c.thumbnail ? (
                          <img
                            alt={c.name}
                            src={`${c.thumbnail.path}/standard_small.${c.thumbnail.extension}`}
                            style={{ borderRadius: 6 }}
                          />
                        ) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <p style={{ marginTop: 12 }}>No results. Try changing filters.</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
