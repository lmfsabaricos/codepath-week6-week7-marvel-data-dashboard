import { NavLink, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import CharacterDetail from "./pages/CharacterDetail.jsx";
import "./index.css";

export default function App(){
  return (
    <div className="wrap">
      <aside className="sidebar">
        <div className="side-frame">
          <div className="side-title">Header</div>
          <div className="brand">AstroDash</div>
        </div>

        <div className="side-frame">
          <div className="side-title">NavBar</div>
          <nav className="nav">
            <NavLink to="/" end>🏠 Dashboard</NavLink>
            <NavLink to="/search">🔎 Search</NavLink>
            <NavLink to="/about">📘 About</NavLink>
          </nav>
        </div>
      </aside>

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<Dashboard />} />
          <Route path="/character/:id" element={<CharacterDetail />} />
          <Route path="/about" element={<p>About page.</p>} />
        </Routes>
      </main>
    </div>
  );
}
