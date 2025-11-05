import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCharacters } from "../lib/api"; // <— keep your existing API here
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,
} from "recharts";

export default function Dashboard(){
  // filters & paging
  const [q, setQ] = useState("spider");
  const [minComics, setMinComics] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 20;

  // data
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const loc = useLocation();
  useEffect(()=>{ setPage(0); }, [q, minComics, loc.pathname]);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const json = await getCharacters({ q, limit, offset: page * limit });
        // Expect Marvel shape; if using ComicVine, adapt here or inside getCharacters
        const results = json?.data?.results ?? json?.results ?? [];
        const totalCount = json?.data?.total ?? json?.number_of_total_results ?? results.length;
        setRows(results);
        setTotal(totalCount);
      } catch (e) {
        setErr(String(e));
      } finally { setLoading(false); }
    })();
  }, [q, page]);

  // normalize fields so both APIs work
  const normalized = useMemo(() => rows.map(r => ({
    id: r.id,
    name: r.name || r.title,
    description: r.description || r.deck || "",
    comics: r.comics?.available ?? r.count_of_issues ?? 0,
    series: r.series?.available ?? 0,
    stories: r.stories?.available ?? 0,
    thumb: r.thumbnail
      ? `${r.thumbnail.path}.${r.thumbnail.extension}`
      : (r.image?.small_url || ""),
  })), [rows]);

  // apply filter
  const filtered = useMemo(
    () => normalized.filter(r => (r.comics ?? 0) >= minComics),
    [normalized, minComics]
  );

  // KPIs
  const kpi = useMemo(() => {
    const comicsArr = filtered.map(r => r.comics ?? 0);
    const storiesArr = filtered.map(r => r.stories ?? 0);
    const avg = comicsArr.length ? comicsArr.reduce((a,b)=>a+b,0)/comicsArr.length : 0;
    const sorted = storiesArr.slice().sort((a,b)=>a-b);
    const median = sorted.length ? sorted[Math.floor(sorted.length/2)] : 0;
    const pctDesc = filtered.length
      ? Math.round(100 * filtered.filter(r => (r.description||"").trim()).length / filtered.length)
      : 0;
    return { total: filtered.length, avg: avg.toFixed(1), median, pctDesc };
  }, [filtered]);

  // chart data
  const comicsData = filtered.map(r => ({ name: r.name, comics: r.comics }));
  const storiesData = filtered.map(r => ({ name: r.name, stories: r.stories }));

  return (
    <div>
      <h1 className="h1">Marvel Character Dashboard</h1>

      {/* KPI row */}
      <div className="section-chip">Card</div>
      <div className="cards">
        <div className="card"><div className="k">Characters</div><div className="v">{kpi.total}</div></div>
        <div className="card"><div className="k">Avg Comics</div><div className="v">{kpi.avg}</div></div>
        <div className="card"><div className="k">Median Stories</div><div className="v">{kpi.median}</div></div>
        <div className="card"><div className="k">% with Description</div><div className="v">{kpi.pctDesc}%</div></div>
      </div>

      {/* Controls */}
      <div className="controls">
        <input
          className="input"
          value={q}
          onChange={e=>setQ(e.target.value)}
          placeholder="Enter name… (spider, iron, cap)"
        />
        <input
          className="range"
          type="range"
          min="0" max="200"
          value={minComics}
          onChange={e=>setMinComics(Number(e.target.value))}
        />
        <span className="section-chip">Min Comics: {minComics}</span>

        <button className="btn" disabled={page===0} onClick={()=>setPage(p=>Math.max(0,p-1))}>← Prev</button>
        <button className="btn" onClick={()=>setPage(p=>p+1)}>Next →</button>
        <span className="section-chip">Page {page+1} • Total {total}</span>
      </div>

      {/* List */}
      <div className="section-title">List</div>
      <div className="table-frame">
        <div className="table-wrap">
          {loading ? (
            <div className="empty">Loading…</div>
          ) : err ? (
            <div className="empty" style={{color:'#ffb3b3'}}>Error: {String(err)}</div>
          ) : filtered.length === 0 ? (
            <div className="empty">No results. Try changing filters.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Comics</th>
                  <th>Series</th>
                  <th>Stories</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{c.comics}</td>
                    <td>{c.series}</td>
                    <td>{c.stories}</td>
                    <td><Link className="section-chip" to={`/character/${c.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="grid2">
        <div className="table-frame chart-card">
          <div className="section-chip">Comics by Character</div>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={comicsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comics" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="table-frame chart-card">
          <div className="section-chip">Stories by Character</div>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={storiesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={kpi.median} label="Median" strokeDasharray="6 6" />
              <Line type="monotone" dataKey="stories" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
