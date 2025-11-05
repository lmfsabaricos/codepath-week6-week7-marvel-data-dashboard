import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCharacterById } from "../lib/api";

export default function CharacterDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true); setErr("");
      try {
        const j = await getCharacterById(id);
        setItem(j?.data?.results?.[0] || null);
      } catch (e) {
        setErr(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="error">{err}</p>;
  if (!item) return <p>Not found.</p>;

  return (
    <div>
      <h1 className="h1">{item.name}</h1>
      <div className="card" style={{display:"flex", gap:16}}>
        {item.thumbnail?.path && (
          <img
            src={item.thumbnail.path}
            alt={item.name}
            style={{width:160, height:160, objectFit:"cover", borderRadius:12}}
          />
        )}
        <div>
          <p>{item.description || "No description available."}</p>
          <p className="badge">Comics: {item.comics?.available ?? 0}</p>
          <p className="badge">Stories: {item.stories?.available ?? 0}</p>
        </div>
      </div>
      <p style={{marginTop:12}}><Link to="/" className="badge">← Back to dashboard</Link></p>
    </div>
  );
}
