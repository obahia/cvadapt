import { Router } from "express";
import { readFileSync } from "fs";
import { gerarLatex } from "../services/latexGen.js";
import { compilarLatex, verificarPdflatex } from "../services/pdfCompiler.js";
import { CVAdaptError, asyncHandler } from "../utils/errors.js";
import Logger from "../utils/logger.js";

const router = Router();
const logger = new Logger("LaTeX");

/**
 * POST /api/latex/gerar - Generate LaTeX source code
 * @param {Object} req.body - { cv_adaptado: Object, idioma: string }
 * @returns {Object} LaTeX source code and PDF availability
 * @throws {400} Missing CV
 * @throws {500} Generation failed
 */
router.post(
  "/gerar",
  asyncHandler(async (req, res) => {
    logger.debug("POST /api/latex/gerar called");

    const { cv_adaptado, idioma = "pt" } = req.body;
    if (!cv_adaptado) {
      throw new CVAdaptError("Envie cv_adaptado para gerar LaTeX", 400);
    }

    logger.debug("Generating LaTeX source");
    const latex = gerarLatex(cv_adaptado, idioma);
    const pdfDisponivel = verificarPdflatex();

    logger.info("LaTeX source generated successfully", { idioma, pdfDisponivel });
    res.json({ ok: true, latex, pdf_disponivel: pdfDisponivel });
  })
);

/**
 * POST /api/latex/pdf - Generate and compile PDF
 * @param {Object} req.body - { cv_adaptado: Object, idioma: string }
 * @returns {Buffer} PDF file binary
 * @throws {400} Missing CV
 * @throws {503} pdflatex not installed
 * @throws {500} Compilation failed
 */
router.post(
  "/pdf",
  asyncHandler(async (req, res) => {
    logger.debug("POST /api/latex/pdf called");

    const { cv_adaptado, idioma = "pt" } = req.body;
    if (!cv_adaptado) {
      throw new CVAdaptError("Envie cv_adaptado para gerar PDF", 400);
    }

    if (!verificarPdflatex()) {
      logger.warn("pdflatex not found");
      throw new CVAdaptError(
        "pdflatex não encontrado. Instale com: sudo apt install texlive-full (Linux) ou baixe MacTeX (Mac)",
        503
      );
    }

    logger.debug("Generating LaTeX and compiling to PDF");
    const latex = gerarLatex(cv_adaptado, idioma);
    const pdfPath = compilarLatex(latex, "curriculo");

    const pdfBuffer = readFileSync(pdfPath);
    logger.info("PDF generated successfully", { size: pdfBuffer.length });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="curriculo.pdf"');
    res.send(pdfBuffer);
  })
);

export default router;

