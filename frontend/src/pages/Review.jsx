import { useState } from "react";
import { useCV } from "../hooks/useCV.js";

export default function Review() {
  const { cv } = useCV();
  const [vaga, setVaga] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const revisar = async () => {
    setLoading(true); setError(""); setResultado(null);
    try {
      const res = await fetch("/api/reviewer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_adaptado: cv, vaga_texto: vaga || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultado(data);
    } catch(e) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <>
      <h1>Revisao Inteligente</h1>
      <div className="sub">A IA analisa seu CV fonte e da feedback concreto para melhorar</div>
      {!resultado ? (
        <>
          <div className="tip"><strong>Opcional:</strong> Cole uma vaga de referencia para revisao mais especifica.</div>
          <div className="label">Vaga de referencia (opcional)</div>
          <textarea rows={6} placeholder="Cole aqui a descricao de uma vaga..." value={vaga} onChange={(e) => setVaga(e.target.value)} />
           <div className="actions">
             <button 
               className="btn btn-primary" 
               disabled={loading || !cv} 
               onClick={revisar}
               aria-label="Analyze CV quality and get improvement suggestions"
             >
               {loading ? "Analisando..." : "Revisar CV"}
             </button>
           </div>
          {loading && <div className="loading"><div className="spinner" /><span>Analisando clareza, impacto e keywords...</span></div>}
          {error && <div className="error">Erro: {error}</div>}
        </>
      ) : (
        <ResultadoRevisao resultado={resultado} onReset={() => setResultado(null)} />
      )}
    </>
  );
}

function ScoreItem({ label, value }) {
  const color = value >= 8 ? "#4caf50" : value >= 6 ? "#d4a017" : "#ff6b6b";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "Syne, sans-serif" }}>{value}/10</span>
      </div>
      <div className="score-bar"><div className="score-fill" style={{ width: value * 10 + "%", background: color }} /></div>
    </div>
  );
}

function ResultadoRevisao({ resultado, onReset }) {
  const { scores, resumo_avaliacao, sugestoes_gerais, bullets_melhorados, skills_faltando, pontos_fortes, pontos_criticos } = resultado;
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        <div className="card">
          <div style={{ fontSize: 36, fontFamily: "Syne, sans-serif", fontWeight: 800, color: "#c8ff00", textAlign: "center" }}>{scores?.geral}/10</div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 1, textAlign: "center", marginTop: 4 }}>SCORE GERAL</div>
        </div>
        <div className="card">
          <ScoreItem label="Clareza" value={scores?.clareza} />
          <ScoreItem label="Impacto" value={scores?.impacto} />
          <ScoreItem label="Keywords" value={scores?.keywords} />
          <ScoreItem label="Formato" value={scores?.formato} />
        </div>
      </div>
      {resumo_avaliacao && <div className="tip" style={{ marginBottom: 24 }}>{resumo_avaliacao}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <div className="card">
          <div className="label" style={{ color: "#4caf50", marginBottom: 12 }}>Pontos fortes</div>
          {(pontos_fortes || []).map((p, i) => <div key={i} style={{ fontSize: 12, color: "#888", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #4caf50" }}>{p}</div>)}
        </div>
        <div className="card">
          <div className="label" style={{ color: "#ff6b6b", marginBottom: 12 }}>Pontos criticos</div>
          {(pontos_criticos || []).map((p, i) => <div key={i} style={{ fontSize: 12, color: "#888", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #ff6b6b" }}>{p}</div>)}
        </div>
      </div>
      {bullets_melhorados?.length > 0 && (
        <>
          <h2>Bullets Reescritos</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {bullets_melhorados.map((b, i) => (
              <div key={i} className="card">
                <div style={{ fontSize: 11, color: "#ff6b6b", marginBottom: 6 }}>ORIGINAL</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 12, lineHeight: 1.6 }}>{b.original}</div>
                <div style={{ fontSize: 11, color: "#4caf50", marginBottom: 6 }}>SUGERIDO</div>
                <div style={{ fontSize: 12, color: "#c8c4b8", marginBottom: 10, lineHeight: 1.6 }}>{b.sugerido}</div>
                <div style={{ fontSize: 11, color: "#555", fontStyle: "italic" }}>{b.motivo}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {skills_faltando?.length > 0 && (
        <>
          <h2>Skills em Alta no Mercado</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {skills_faltando.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span className="tag tag-yellow">{s.skill}</span>
                <span style={{ fontSize: 12, color: "#666", paddingTop: 2 }}>{s.motivo}</span>
              </div>
            ))}
          </div>
        </>
      )}
      {sugestoes_gerais?.length > 0 && (
        <>
          <h2>Sugestoes Gerais</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
            {sugestoes_gerais.map((s, i) => {
              const color = s.tipo === "critica" ? "#ff6b6b" : s.tipo === "elogio" ? "#4caf50" : "#d4a017";
              const icon = s.tipo === "critica" ? "x" : s.tipo === "elogio" ? "v" : ">";
              return <div key={i} style={{ fontSize: 12, color: "#888", paddingLeft: 12, borderLeft: "2px solid " + color, lineHeight: 1.6 }}><span style={{ color }}>{icon} </span>{s.descricao}</div>;
            })}
          </div>
        </>
      )}
      <div className="actions"><button className="btn btn-ghost" onClick={onReset}>Nova revisao</button></div>
    </>
  );
}
