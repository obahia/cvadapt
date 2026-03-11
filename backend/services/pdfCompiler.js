import { writeFileSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import { tmpdir } from "os";

/**
 * Compila um string LaTeX em PDF usando pdflatex.
 * Retorna o path do PDF gerado, ou lanÃ§a erro com o log do compilador.
 */
export function compilarLatex(latexStr, nomeArquivo = "curriculo") {
  const dir = join(tmpdir(), `cvadapt-${Date.now()}`);
  mkdirSync(dir, { recursive: true });

  const texPath = join(dir, `${nomeArquivo}.tex`);
  const pdfPath = join(dir, `${nomeArquivo}.pdf`);

  writeFileSync(texPath, latexStr, "utf-8");

  try {
    // Roda duas vezes para resolver referÃªncias internas
    const cmd = `pdflatex -interaction=nonstopmode -output-directory="${dir}" "${texPath}"`;
    execSync(cmd, { timeout: 30000 });
    execSync(cmd, { timeout: 30000 });

    if (!existsSync(pdfPath)) {
      throw new Error("PDF nÃ£o foi gerado. Verifique se o pdflatex estÃ¡ instalado.");
    }

    return pdfPath;
  } catch (e) {
    // Tenta ler o log para diagnÃ³stico
    const logPath = join(dir, `${nomeArquivo}.log`);
    let log = "";
    try {
      log = require("fs").readFileSync(logPath, "utf-8").slice(-2000);
    } catch {}
    throw new Error(`Erro na compilaÃ§Ã£o LaTeX:\n${e.message}\n\nLog:\n${log}`);
  }
}

/**
 * Verifica se o pdflatex estÃ¡ instalado no sistema
 */
export function verificarPdflatex() {
  try {
    execSync("pdflatex --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

