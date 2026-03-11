import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Home from "./pages/Home.jsx";
import Updater from "./pages/Updater.jsx";
import Adapter from "./pages/Adapter.jsx";
import Review from "./pages/Review.jsx";

const NAV = [
  { to: "/",          label: "Inicio",         icon: "⌂" },
  { to: "/atualizar", label: "Atualizar CV",    icon: "✎" },
  { to: "/adaptar",   label: "Adaptar p/ Vaga", icon: "⚡" },
  { to: "/revisar",   label: "Revisao IA",      icon: "◎" },
];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0f; font-family: 'DM Mono', monospace; color: #e8e4d9; min-height: 100vh; }
  #root { display: flex; min-height: 100vh; }

  .sidebar {
    width: 220px; min-height: 100vh; background: #0d0d15;
    border-right: 1px solid #1a1a2a; display: flex; flex-direction: column;
    padding: 28px 0; position: fixed; top: 0; left: 0; bottom: 0;
  }
  .logo { padding: 0 24px 32px; font-family: 'Syne', sans-serif; font-size: 20px;
    font-weight: 800; color: #fff; letter-spacing: -0.5px;
    border-bottom: 1px solid #1a1a2a; margin-bottom: 24px; }
  .logo span { color: #c8ff00; }
  nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; }
  nav a { display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; font-size: 12px; color: #555; text-decoration: none;
    letter-spacing: 0.3px; transition: all 0.15s; }
  nav a:hover { color: #aaa; background: #111120; }
  nav a.active { color: #c8ff00; background: #111120; }
  nav a .icon { font-size: 14px; width: 20px; text-align: center; }

  .content { margin-left: 220px; flex: 1; padding: 48px; max-width: 960px; }

  h1 { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 6px; }
  h2 { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 12px; }
  .sub { font-size: 12px; color: #555; letter-spacing: 0.5px; margin-bottom: 32px; }

  textarea, input[type=text] { width: 100%; background: #111118; border: 1px solid #252535;
    border-radius: 10px; color: #c8c4b8; font-family: 'DM Mono', monospace; font-size: 13px;
    line-height: 1.7; padding: 16px 20px; resize: vertical; outline: none; transition: border-color 0.2s; }
  textarea:focus, input[type=text]:focus { border-color: #c8ff00; }
  textarea::placeholder, input::placeholder { color: #333; }

  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px;
    border-radius: 8px; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
    cursor: pointer; border: none; transition: all 0.15s; letter-spacing: 0.2px; }
  .btn-primary { background: #c8ff00; color: #0a0a0f; }
  .btn-primary:hover:not(:disabled) { background: #d8ff33; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: #666; border: 1px solid #252535; }
  .btn-ghost:hover { border-color: #444; color: #aaa; }
  .btn-sm { padding: 8px 16px; font-size: 12px; }

  .card { background: #111118; border: 1px solid #252535; border-radius: 10px; padding: 24px; }
  .label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
  .tip { background: #111118; border-left: 2px solid #c8ff00; padding: 10px 14px;
    border-radius: 0 6px 6px 0; font-size: 11px; color: #666; margin-bottom: 24px; line-height: 1.6; }
  .tip strong { color: #c8ff00; }
  .divider { height: 1px; background: #1a1a2a; margin: 28px 0; }
  .actions { display: flex; gap: 10px; margin-top: 20px; align-items: center; flex-wrap: wrap; }
  .tag { background: #1a1a2a; border: 1px solid #252535; border-radius: 6px; padding: 4px 12px; font-size: 11px; color: #666; }
  .tag-green { background: #0f1f0f; border-color: #1e3a1e; color: #4caf50; }
  .tag-yellow { background: #1f1a0a; border-color: #3a2e00; color: #d4a017; }
  .error { color: #ff6b6b; font-size: 12px; margin-top: 12px; }

  .spinner { width: 32px; height: 32px; border: 2px solid #252535; border-top-color: #c8ff00;
    border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading { display: flex; align-items: center; gap: 14px; font-size: 12px; color: #555;
    letter-spacing: 1px; padding: 40px 0; }
  .score-bar { height: 6px; border-radius: 3px; background: #1a1a2a; margin-top: 6px; }
  .score-fill { height: 100%; border-radius: 3px; background: #c8ff00; transition: width 0.5s; }
`;

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <style>{css}</style>
        <div className="sidebar">
          <div className="logo">CV<span>adapt</span></div>
          <nav>
            {NAV.map(({ to, label, icon }) => (
              <NavLink key={to} to={to} end={to === "/"}>
                <span className="icon">{icon}</span> {label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/atualizar" element={<Updater />} />
            <Route path="/adaptar" element={<Adapter />} />
            <Route path="/revisar" element={<Review />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
