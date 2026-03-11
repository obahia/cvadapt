import { Router } from "express";
import { callClaudeJSON } from "../services/claude.js";
import { CVAdaptError, asyncHandler } from "../utils/errors.js";
import Logger from "../utils/logger.js";

const router = Router();
const logger = new Logger("Reviewer");

/**
 * POST /api/reviewer - Analyze and review CV quality
 * @param {Object} req - Request object
 * @param {Object} req.body.cv_adaptado - CV to review (JSON)
 * @param {string} req.body.vaga_texto - Optional job description for context
 * @returns {Object} Review scores and improvement suggestions
 * @throws {400} Missing CV
 * @throws {500} API call failed
 */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    logger.debug("Reviewer route called");

    const { cv_adaptado, vaga_texto } = req.body;
    if (!cv_adaptado) {
      throw new CVAdaptError("Envie cv_adaptado para revisão", 400);
    }

    const system = `You are a tech recruitment expert with 15 years of experience reviewing resumes for companies like FAANG, startups and scale-ups.

Analyze the resume in 4 dimensions and return concrete, actionable feedback.

${vaga_texto ? "Context: there is a specific job. Consider alignment with it in the analysis." : ""}

ANALYSIS DIMENSIONS:
1. CLARITY (0-10): Objectivity, absence of vague jargon, concise sentences
2. IMPACT (0-10): Use of metrics, strong action verbs, achievements vs responsibilities
3. KEYWORDS (0-10): Alignment with current tech market terms, ATS-friendly
4. FORMAT (0-10): Logical structure, completeness, absence of common errors

For each experience/project bullet, evaluate and suggest an improved rewrite.

Return ONLY this JSON:
{
  "scores": {
    "clareza": 0,
    "impacto": 0,
    "keywords": 0,
    "formato": 0,
    "geral": 0
  },
  "resumo_avaliacao": "Paragraph summarizing strengths and weaknesses",
  "sugestoes_gerais": [
    { "tipo": "critica|melhoria|elogio", "descricao": "..." }
  ],
  "bullets_melhorados": [
    { "original": "...", "sugerido": "...", "motivo": "..." }
  ],
  "skills_faltando": [
    { "skill": "...", "motivo": "..." }
  ],
  "pontos_fortes": [],
  "pontos_criticos": []
}`;

    logger.debug("Calling AI to review CV");
    const result = await callClaudeJSON(
      system,
      [
        {
          role: "user",
          content: "RESUME FOR REVIEW:\n" + JSON.stringify(cv_adaptado, null, 2) + (vaga_texto ? "\n\nJOB REFERENCE:\n" + vaga_texto : "")
        }
      ],
      6000
    );

    logger.info("CV reviewed successfully", { score: result.scores.geral });
    res.json({ ok: true, ...result });
  })
);

export default router;
