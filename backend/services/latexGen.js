const PIPE = String.fromCharCode(36) + "|" + String.fromCharCode(36);

function esc(s) {
  return String(s || "")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/</g, "\\textless{}")
    .replace(/>/g, "\\textgreater{}");
}

function formatPeriodo(ini, fim, atual, idioma) {
  if (!ini) return "";
  var fimStr = atual ? (idioma === "en" ? "Present" : "Atual") : (fim || "");
  return ini + " -- " + fimStr;
}

function bullets(arr) {
  if (!arr || arr.length === 0) return "";
  var items = arr.map(function(b) { return "      \\resumeItem{" + esc(b) + "}"; }).join("\n");
  return "    \\resumeItemListStart\n" + items + "\n    \\resumeItemListEnd";
}

export function gerarLatex(cv, idioma) {
  idioma = idioma || "pt";
  var contato = cv.contato || {};
  var resumo = cv.resumo || "";
  var experiencias = cv.experiencias || [];
  var projetos = cv.projetos || [];
  var formacao = cv.formacao || [];
  var certificacoes = cv.certificacoes || [];
  var skills = cv.skills || {};

  var L = idioma === "en" ? {
    experiencia: "Work Experience",
    projetos: "Projects",
    formacao: "Education",
    certs: "Certifications",
    skills: "Technical Skills",
    linguagens: "Languages",
    frameworks: "Frameworks \\& Tools",
    idiomas: "Languages",
    resumo: "Summary"
   } : {
    experiencia: "Experiência Profissional",
    projetos: "Projetos",
    formacao: "Formação",
    certs: "Certificações",
    skills: "Habilidades",
    linguagens: "Linguagens",
    frameworks: "Frameworks e Ferramentas",
    idiomas: "Idiomas",
    resumo: "Resumo"
  };

  var expSection = experiencias.map(function(e) {
    return "\n  \\resumeSubheading\n" +
      "    {" + esc(e.cargo) + "}{" + formatPeriodo(e.periodo_inicio, e.periodo_fim, e.atual, idioma) + "}\n" +
      "    {" + esc(e.empresa) + "}{" + esc(e.cidade || "") + "}\n" +
      bullets(e.bullets);
  }).join("\n");

  var projSection = projetos.map(function(p) {
    var stack = (p.stack || []).map(esc).join(", ");
    return "\n  \\resumeProjectHeading\n" +
      "    {\\textbf{" + esc(p.nome) + "} " + PIPE + " \\emph{" + stack + "}}{" + esc(p.periodo || "") + "}\n" +
      bullets(p.bullets);
  }).join("\n");

  var formSection = formacao.map(function(f) {
    return "\n  \\resumeSubheading\n" +
      "    {" + esc(f.instituicao) + "}{" + (f.periodo_inicio || "") + " -- " + (f.periodo_fim || "") + "}\n" +
      "    {" + esc(f.grau) + " em " + esc(f.curso) + "}{}";
  }).join("\n");

  var certSection = certificacoes.map(function(c) {
    return "    \\resumeItem{" + esc(c.nome) + " -- " + esc(c.emissor) + " (" + (c.data || "") + ")}\n";
  }).join("");

  var skillLines = [];
  if (skills.linguagens && skills.linguagens.length)
    skillLines.push("    \\item \\textbf{" + L.linguagens + "}{: " + skills.linguagens.map(esc).join(", ") + "}");
  var fw = (skills.frameworks || []).concat(skills.ferramentas || []);
  if (fw.length)
    skillLines.push("    \\item \\textbf{" + L.frameworks + "}{: " + fw.map(esc).join(", ") + "}");
  if (skills.idiomas && skills.idiomas.length)
    skillLines.push("    \\item \\textbf{" + L.idiomas + "}{: " + skills.idiomas.map(function(i) { return esc(i.idioma) + " (" + esc(i.nivel) + ")"; }).join(", ") + "}");

  var resumoTexto = typeof resumo === "string" ? resumo : (resumo[idioma] || resumo.pt || "");
  var tel = contato.telefone ? esc(contato.telefone) + " $|$ " : "";
  var emailStr = "\\href{mailto:" + esc(contato.email || "") + "}{\\underline{" + esc(contato.email || "") + "}}";
  var linkedinStr = contato.linkedin ? " $|$ \\href{https://" + esc(contato.linkedin) + "}{\\underline{" + esc(contato.linkedin) + "}}" : "";
  var githubStr = contato.github ? " $|$ \\href{https://" + esc(contato.github) + "}{\\underline{" + esc(contato.github) + "}}" : "";
  var certBlock = certificacoes.length ? "\\section{" + L.certs + "}\n  \\resumeItemListStart\n" + certSection + "  \\resumeItemListEnd\n" : "";
  var today = new Date().toLocaleDateString("pt-BR");

  var lines = [
    "%-------------------------",
    "% CV gerado por CVAdapt - " + today,
    "%-------------------------",
    "\\documentclass[letterpaper,11pt]{article}",
    "\\usepackage{latexsym}",
    "\\usepackage[empty]{fullpage}",
    "\\usepackage{titlesec}",
    "\\usepackage{marvosym}",
    "\\usepackage[usenames,dvipsnames]{color}",
    "\\usepackage{verbatim}",
    "\\usepackage{enumitem}",
    "\\usepackage[hidelinks]{hyperref}",
    "\\usepackage{fancyhdr}",
    "\\usepackage[english]{babel}",
    "\\usepackage{tabularx}",
    "\\input{glyphtounicode}",
    "\\pagestyle{fancy}",
    "\\fancyhf{}",
    "\\fancyfoot{}",
    "\\renewcommand{\\headrulewidth}{0pt}",
    "\\renewcommand{\\footrulewidth}{0pt}",
    "\\addtolength{\\oddsidemargin}{-0.5in}",
    "\\addtolength{\\evensidemargin}{-0.5in}",
    "\\addtolength{\\textwidth}{1in}",
    "\\addtolength{\\topmargin}{-.5in}",
    "\\addtolength{\\textheight}{1.0in}",
    "\\urlstyle{same}",
    "\\raggedbottom",
    "\\raggedright",
    "\\setlength{\\tabcolsep}{0in}",
    "\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]",
    "\\pdfgentounicode=1",
    "\\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-2pt}}}",
    "\\newcommand{\\resumeSubheading}[4]{%",
    "  \\vspace{-2pt}\\item",
    "  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}",
    "    \\textbf{#1} & #2 \\\\",
    "    \\textit{\\small#3} & \\textit{\\small #4} \\\\",
    "  \\end{tabular*}\\vspace{-7pt}}",
    "\\newcommand{\\resumeProjectHeading}[2]{%",
    "  \\item",
    "  \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}",
    "    \\small#1 & #2 \\\\",
    "  \\end{tabular*}\\vspace{-7pt}}",
    "\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}",
    "\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}",
    "\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}",
    "\\newcommand{\\resumeItemListStart}{\\begin{itemize}}",
    "\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}",
    "\\begin{document}",
    "\\begin{center}",
    "  {\\Huge \\scshape " + esc(contato.nome || "") + "} \\\\ \\vspace{1pt}",
    "  \\small " + tel + emailStr + linkedinStr + githubStr,
    "\\end{center}",
    "\\section{" + L.resumo + "}",
    "\\small " + esc(resumoTexto),
    "\\section{" + L.experiencia + "}",
    "  \\resumeSubHeadingListStart",
    expSection,
    "  \\resumeSubHeadingListEnd",
    "\\section{" + L.projetos + "}",
    "  \\resumeSubHeadingListStart",
    projSection,
    "  \\resumeSubHeadingListEnd",
    "\\section{" + L.formacao + "}",
    "  \\resumeSubHeadingListStart",
    formSection,
    "  \\resumeSubHeadingListEnd",
    certBlock,
    "\\section{" + L.skills + "}",
    "  \\begin{itemize}[leftmargin=0.15in, label={}]",
    "    \\small{",
    skillLines.join("\n"),
    "    }",
    "  \\end{itemize}",
    "\\end{document}"
  ];

  return lines.join("\n");
}
