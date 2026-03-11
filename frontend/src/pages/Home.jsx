import { useCV } from "../hooks/useCV.js";

export default function Home() {
  const { cv, loading, error } = useCV();

  if (loading) return <div className="loading"><div className="spinner" /><span>Carregando CV fonte...</span></div>;
  if (error) return <div className="error">Erro: {error} — Backend rodando? Execute: npm run dev</div>;

  const { contato, experiencias, projetos, formacao, certificacoes, skills, _meta } = cv;

  return (
    <>
      <h1>{contato?.nome || "Seu Nome"}</h1>
      <div className="sub">CV Fonte — ultima atualizacao: {_meta?.ultima_atualizacao || "—"}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
        <Stat label="Experiencias" value={experiencias?.length || 0} />
        <Stat label="Projetos" value={projetos?.length || 0} />
        <Stat label="Certificacoes" value={certificacoes?.length || 0} />
        <Stat label="Skills" value={(skills?.linguagens?.length || 0) + (skills?.frameworks?.length || 0)} />
      </div>

      <div className="divider" />

      <h2>Contato</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        {[["Email", contato?.email], ["Telefone", contato?.telefone], ["LinkedIn", contato?.linkedin], ["GitHub", contato?.github], ["Localizacao", contato?.cidade]].filter(([,v]) => v).map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 16, marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: "#555", width: 90, flexShrink: 0 }}>{k}</span>
            <span style={{ color: "#c8c4b8" }}>{v}</span>
          </div>
        ))}
      </div>

      <h2>Habilidades</h2>
      <div className="card" style={{ marginBottom: 20 }}>
        <SkillRow label="Linguagens" items={skills?.linguagens} />
        <SkillRow label="Frameworks" items={skills?.frameworks} />
        <SkillRow label="Ferramentas" items={skills?.ferramentas} />
      </div>

      <h2>Experiencias</h2>
      {(experiencias || []).map((e) => (
        <div key={e.id} className="card" style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <strong style={{ color: "#fff", fontSize: 14 }}>{e.cargo}</strong>
            <span style={{ color: "#555", fontSize: 12 }}>{e.periodo_inicio} — {e.atual ? "Atual" : e.periodo_fim}</span>
          </div>
          <div style={{ color: "#666", fontSize: 12, marginBottom: 10 }}>{e.empresa}</div>
          <ul style={{ paddingLeft: 16 }}>
            {(e.bullets || []).map((b, i) => (
              <li key={i} style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#c8ff00", fontFamily: "Syne, sans-serif" }}>{value}</div>
      <div style={{ fontSize: 11, color: "#555", marginTop: 4, letterSpacing: 1 }}>{label}</div>
    </div>
  );
}

function SkillRow({ label, items }) {
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
      <span style={{ color: "#555", fontSize: 11, width: 90, paddingTop: 4, flexShrink: 0 }}>{label}</span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((s) => <span key={s} className="tag">{s}</span>)}
      </div>
    </div>
  );
}
