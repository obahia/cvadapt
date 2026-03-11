import { useState } from "react";

export default function Adapter() {
  const [modo, setModo] = useState("texto"); // "texto" | "url"
  const [vaga, setVaga] = useState("");
  const [url, setUrl] = useState("");
  const [idioma, setIdioma] = useState("pt");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const gerar = async () => {
    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const res = await fetch("/api/adapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaga: modo === "texto" ? vaga : null,
          url: modo === "url" ? url : null,
          idioma,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultado(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const baixarLatex = async () => {
    try {
      const res = await fetch("/api/latex/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_adaptado: resultado.cv_adaptado, idioma }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar LaTeX");
      
      const blob = new Blob([data.latex], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "curriculo.tex";
      a.click();
    } catch (e) {
      setError(`Erro ao baixar LaTeX: ${e.message}`);
    }
  };

  const baixarPDF = async () => {
    try {
      const res = await fetch("/api/latex/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv_adaptado: resultado.cv_adaptado, idioma }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erro ao gerar PDF");
      }
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "curriculo.pdf";
      a.click();
    } catch (e) {
      setError(`Erro ao baixar PDF: ${e.message}`);
    }
  };

  return (
    <>
      <h1>Adaptar para Vaga</h1>
      <div className="sub">Cole a vaga ou link aqui” o CV serao reescrito para maximizar suas chances</div>

      {!resultado ? (
        <>
          {/* Modo */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[["texto", "Colar texto"], ["url", "URL da vaga"]].map(([v, l]) => (
              <button
                key={v}
                className={`btn btn-ghost btn-sm ${modo === v ? "active" : ""}`}
                style={modo === v ? { borderColor: "#c8ff00", color: "#c8ff00" } : {}}
                onClick={() => setModo(v)}
              >
                {l}
              </button>
            ))}
          </div>

          {modo === "texto" ? (
            <>
              <div className="label">Descrição da vaga</div>
              <textarea
                rows={12}
                placeholder={"Título: Senior Backend Engineer\n\nSomos uma fintech...\n\nResponsabilidades:\n- ...\n\nRequisitos:\n- ..."}
                value={vaga}
                onChange={(e) => setVaga(e.target.value)}
              />
            </>
          ) : (
            <>
              <div className="label">URL da vaga</div>
              <input
                type="text"
                placeholder="https://linkedin.com/jobs/view/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <div className="tip" style={{ marginTop: 12 }}>
                <strong>Suporte:</strong> LinkedIn, Gupy, Greenhouse, Workable, pages de carreiras e a maioria dos sites de vagas. Sites com autenticação podem não funcionar.
              </div>
            </>
          )}

          {/* Idioma */}
          <div style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}>
            <span className="label" style={{ marginBottom: 0 }}>Idioma do CV:</span>
            {[["pt", "🇧🇷 Português"], ["en", "🇺🇸 English"]].map(([v, l]) => (
              <button
                key={v}
                className={`btn btn-ghost btn-sm`}
                style={idioma === v ? { borderColor: "#c8ff00", color: "#c8ff00" } : {}}
                onClick={() => setIdioma(v)}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="actions">
            <button
              className="btn btn-primary"
              disabled={loading || (modo === "texto" ? vaga.trim().length < 50 : url.trim().length < 10)}
              onClick={gerar}
              aria-label={`Generate adapted CV ${modo === "texto" ? "from text" : "from URL"}`}
            >
              {loading ? "Gerando..." : "⚡ Gerar CV adaptado"}
            </button>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner" />
              <span>Analisando vaga e reescrevendo CV...</span>
            </div>
          )}
          {error && <div className="error">⚠ {error}</div>}
        </>
      ) : (
        <Resultado resultado={resultado} idioma={idioma} onReset={() => setResultado(null)} onLatex={baixarLatex} onPDF={baixarPDF} />
      )}
    </>
  );
}

function Resultado({ resultado, idioma, onReset, onLatex, onPDF }) {
  const { analise_vaga, cv_adaptado, score_match, justificativa_score, gaps_identificados } = resultado;
  const scoreColor = score_match >= 70 ? "#4caf50" : score_match >= 45 ? "#d4a017" : "#ff6b6b";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: "#555", letterSpacing: 1, marginBottom: 4 }}>VAGA DETECTADA</div>
          <div style={{ fontSize: 18, fontFamily: "Syne, sans-serif", fontWeight: 700, color: "#fff" }}>
            {analise_vaga?.titulo || "â€”"}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>{analise_vaga?.empresa} Â· {analise_vaga?.nivel}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontFamily: "Syne, sans-serif", fontWeight: 800, color: scoreColor }}>{score_match}%</div>
          <div style={{ fontSize: 10, color: "#555", letterSpacing: 1 }}>MATCH</div>
        </div>
      </div>

      <div className="score-bar" style={{ marginBottom: 24 }}>
        <div className="score-fill" style={{ width: `${score_match}%`, background: scoreColor }} />
      </div>

      {justificativa_score && (
        <div className="tip" style={{ marginBottom: 24 }}>{justificativa_score}</div>
      )}

      {/* Keywords da vaga */}
      {analise_vaga?.keywords_tecnicas?.length > 0 && (
        <>
          <div className="label">Keywords técnicas da vaga</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {analise_vaga.keywords_tecnicas.map((k) => (
              <span key={k} className="tag tag-green">{k}</span>
            ))}
          </div>
        </>
      )}

      {/* Gaps */}
      {gaps_identificados?.length > 0 && (
        <>
          <div className="label">Gaps identificados</div>
          <div style={{ marginBottom: 24 }}>
            {gaps_identificados.map((g, i) => (
              <div key={i} style={{ fontSize: 12, color: "#d4a017", marginBottom: 4 }}>âš  {g}</div>
            ))}
          </div>
        </>
      )}

      <div className="divider" />

       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
         <h2 style={{ marginBottom: 0 }}>CV Gerado — {idioma === "en" ? "English" : "Português"}</h2>
         <div style={{ display: "flex", gap: 8 }}>
           <button 
             className="btn btn-ghost btn-sm" 
             onClick={baixarLatex}
             aria-label="Download LaTeX source code for Overleaf"
             title="Download .tex file for Overleaf"
           >
             ⬇ .tex (Overleaf)
           </button>
           <button 
             className="btn btn-primary btn-sm" 
             onClick={baixarPDF}
             aria-label="Download PDF version of adapted CV"
             title="Download PDF file"
           >
             ⬇ PDF
           </button>
         </div>
       </div>

      <div className="card" style={{ fontSize: 12, lineHeight: 1.9, color: "#aaa", whiteSpace: "pre-wrap", maxHeight: 500, overflow: "auto" }}>
        {JSON.stringify(cv_adaptado, null, 2)}
      </div>

      <div className="actions">
        <button className="btn btn-ghost" onClick={onReset}> Nova vaga</button>
      </div>
    </>
  );
}

