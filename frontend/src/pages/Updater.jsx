import { useState, useRef, useEffect } from "react";
import { useCV } from "../hooks/useCV.js";

const EXEMPLOS = [
  "Adicionei Kafka no projeto de streaming em marco de 2024",
  "Fiz um curso de AWS Solutions Architect Professional, concluido em junho de 2025",
  "Participei de um projeto freelance de e-commerce com Next.js e Stripe",
  "Aprendi Rust e ja fiz alguns projetos pessoais com ele",
];

export default function Updater() {
  const { refresh } = useCV();
  const [mensagem, setMensagem] = useState("");
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historico]);

  const enviar = async (msg) => {
    const texto = (msg || mensagem).trim();
    if (!texto) return;
    setHistorico((h) => [...h, { role: "user", content: texto }]);
    setMensagem("");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/updater", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHistorico((h) => [...h, { role: "assistant", alteracoes: data.alteracoes, avisos: data.avisos }]);
      refresh();
    } catch(e) {
      setError(e.message);
      setHistorico((h) => h.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  return (
    <>
      <h1>Atualizar CV Fonte</h1>
      <div className="sub">Fale em linguagem natural - a IA adiciona no lugar certo do seu curriculo</div>

      {historico.length === 0 && (
        <>
          <div className="tip"><strong>Como usar:</strong> Descreva a nova informacao naturalmente. A IA interpreta e insere no lugar certo do seu JSON.</div>
          <div className="label" style={{ marginBottom: 12 }}>Exemplos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
            {EXEMPLOS.map((ex) => (
              <button key={ex} className="btn btn-ghost" style={{ textAlign: "left", fontSize: 12, padding: "10px 16px" }} onClick={() => enviar(ex)}>
                "{ex}"
              </button>
            ))}
          </div>
        </>
      )}

      {historico.length > 0 && (
        <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {historico.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? <UserBubble content={msg.content} /> : <AssistantBubble alteracoes={msg.alteracoes} avisos={msg.avisos} />}
            </div>
          ))}
          {loading && <div className="loading"><div className="spinner" /><span>Atualizando curriculo...</span></div>}
          <div ref={bottomRef} />
        </div>
      )}

      <div className="card">
        <div className="label">Nova informacao</div>
        <textarea rows={4} placeholder="Ex: Trabalhei com Kafka e Redis no projeto de pagamentos da empresa X, de jan a mar de 2025." value={mensagem} onChange={(e) => setMensagem(e.target.value)} onKeyDown={handleKey} disabled={loading} />
         <div className="actions">
           <button 
             className="btn btn-primary" 
             disabled={!mensagem.trim() || loading} 
             onClick={() => enviar()}
             aria-label="Submit message to update CV"
           >
             {loading ? "Processando..." : "Adicionar ao CV"}
           </button>
           <span style={{ fontSize: 11, color: "#444" }}>Enter para enviar / Shift+Enter nova linha</span>
         </div>
        {error && <div className="error">Erro: {error}</div>}
      </div>
    </>
  );
}

function UserBubble({ content }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: "#1a1a2a", border: "1px solid #252535", borderRadius: "10px 10px 2px 10px", padding: "12px 16px", maxWidth: "75%", fontSize: 13, color: "#c8c4b8", lineHeight: 1.6 }}>
        {content}
      </div>
    </div>
  );
}

function AssistantBubble({ alteracoes, avisos }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-start" }}>
      <div style={{ background: "#0f1f0f", border: "1px solid #1e3a1e", borderRadius: "10px 10px 10px 2px", padding: "16px 20px", maxWidth: "75%" }}>
        <div style={{ fontSize: 11, color: "#4caf50", letterSpacing: 1, marginBottom: 12 }}>CV ATUALIZADO</div>
        {(alteracoes || []).map((a, i) => (
          <div key={i} style={{ fontSize: 13, color: "#c8c4b8", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid #4caf50" }}>{a}</div>
        ))}
        {(avisos || []).length > 0 && avisos.map((v, i) => (
          <div key={i} style={{ fontSize: 11, color: "#d4a017", marginTop: 4 }}>Aviso: {v}</div>
        ))}
      </div>
    </div>
  );
}
