import { Router } from "express";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { callClaudeJSON } from "../services/claude.js";
import { scrapeVaga } from "../services/scraper.js";
import { CVAdaptError, asyncHandler } from "../utils/errors.js";
import Logger from "../utils/logger.js";

const router = Router();
const __dir = dirname(fileURLToPath(import.meta.url));
const CV_PATH = join(__dir, "../data/cv-fonte.json");
const logger = new Logger("Adapter");

/**
 * POST /api/adapter - Adapt CV for a specific job posting
 * @param {Object} req - Request object
 * @param {string} req.body.vaga - Job description text
 * @param {string} req.body.url - Optional job posting URL (will be scraped)
 * @param {string} req.body.idioma - Language (pt or en)
 * @returns {Object} Adapted CV with job analysis and match score
 * @throws {400} Missing job text/URL
 * @throws {500} API call failed
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    logger.debug("Adapter route called", { body: req.body });

    const { vaga, url, idioma } = req.body;
    const lang = idioma || "pt";

    let textoVaga = vaga;
    if (!textoVaga && url) {
      logger.debug("Scraping job description from URL", { url });
      textoVaga = await scrapeVaga(url);
    }
    if (!textoVaga || !textoVaga.trim()) {
      throw new CVAdaptError("Forneça descrição da vaga ou URL válida", 400);
    }

    logger.debug("Loading source CV");
    const cvFonte = JSON.parse(readFileSync(CV_PATH, "utf-8"));
    const langName = lang === "en" ? "English" : "Portuguese (Brazilian)";

    const system = `You are a tech recruitment expert and resume writer.
Your task is to adapt a base resume for a specific job posting, maximizing chances of passing ATS and impressing human recruiters.

OUTPUT LANGUAGE: ${langName}
${lang === "en" ? "Translate ALL content to professional English. Use active voice and strong action verbs." : "Use professional Brazilian Portuguese. Active voice, strong action verbs."}

PROCESS:
1. Analyze the job: extract keywords, tech stack, required/desired skills, seniority level, company culture
2. For each item in the base resume, calculate a relevance score (0-10) for this job
3. Adapt the resume:
   - Rewrite the professional summary focused on what the job needs
   - Reorder experiences/projects by relevance (most relevant first)
   - Rewrite bullets to mirror the job language and keywords
   - Include only relevant skills
   - Add impact metrics where it makes sense (without inventing unrealistic numbers)
4. Stay honest: adapt what exists, do not invent experiences

Return ONLY this JSON:
{
  "analise_vaga": {
    "titulo": "...",
    "empresa": "...",
    "nivel": "junior|pleno|senior|staff",
    "keywords_tecnicas": [],
    "keywords_comportamentais": [],
    "requisitos_obrigatorios": [],
    "requisitos_desejaveis": [],
    "cultura": "..."
  },
  "cv_adaptado": {
    "contato": {},
    "resumo": "adapted summary for this job",
    "experiencias": [],
    "projetos": [],
    "formacao": [],
    "certificacoes": [],
    "skills": {}
  },
  "score_match": 0,
  "justificativa_score": "...",
  "gaps_identificados": []
}`;

    logger.debug("Calling AI to adapt CV");
    const result = await callClaudeJSON(
      system,
      [
        {
          role: "user",
          content: "BASE RESUME:\n" + JSON.stringify(cvFonte, null, 2) + "\n\nJOB DESCRIPTION:\n" + textoVaga
        }
      ],
      8192
    );

    logger.info("CV adapted successfully", { score: result.score_match });
    res.json({ ok: true, ...result });
  })
);

export default router;
