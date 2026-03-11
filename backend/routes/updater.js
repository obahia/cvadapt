import { Router } from "express";
import { callClaudeJSON } from "../services/claude.js";
import { CVAdaptError, asyncHandler } from "../utils/errors.js";
import { validateCV, sanitizeCV } from "../utils/validator.js";
import Logger from "../utils/logger.js";
import { readCV, writeCV } from "../utils/cvFile.js";

const router = Router();
const logger = new Logger("Updater");

router.post(
  "/",
  asyncHandler(async (req, res) => {
    logger.debug("Updater route hit", { body: req.body });
    const { mensagem } = req.body;

    if (!mensagem || !mensagem.trim()) {
      throw new CVAdaptError("Envie uma mensagem descrevendo as alterações", 400);
    }

    if (mensagem.length > 5000) {
      throw new CVAdaptError("Mensagem muito longa (máximo 5000 caracteres)", 400);
    }

    logger.debug("Atualizando CV com mensagem:", { length: mensagem.length });

    const cv = readCV();

    const system = `You are an expert assistant that keeps professional resumes updated.
You will receive the current resume as JSON and a message in natural language describing new information to add.

Your task:
1. Interpret what the user wants to add (experience, project, skill, certification, education, etc.)
2. Insert the information in the correct place in the JSON, respecting the existing structure
3. Create unique IDs for new items (e.g. "exp-2", "proj-3", "cert-2")
4. Enrich bullets with impact language when possible
5. Return the complete updated CV plus a list of what changed

Important rules:
- NEVER invent information the user did not mention
- If details are missing (like dates), use reasonable values and indicate this in the "avisos" field
- Keep the JSON with exactly the same structure
- For new skills, add them to the most appropriate category
- Write all content in the same language as the existing CV (Portuguese)

Return ONLY this JSON:
{
  "cv_atualizado": { ...full cv... },
  "alteracoes": ["Clear description of what was added/modified"],
  "avisos": ["Warnings about incomplete data or assumptions made"]
}`;

    logger.debug("Calling Gemini API...");
    const result = await callClaudeJSON(system, [
      {
        role: "user",
        content: "CURRENT CV:\n" + JSON.stringify(cv, null, 2) + "\n\nNEW INFORMATION:\n" + mensagem,
      },
    ], 8192);

    logger.debug("Gemini API response received", { hasCV: !!result.cv_atualizado });

    // Validar CV atualizado
    const cvAtualizado = sanitizeCV(result.cv_atualizado);
    const validation = validateCV(cvAtualizado);

    if (!validation.valid) {
      logger.warn("CV atualizado contém dados inválidos", validation.errors);
      throw new CVAdaptError("CV atualizado não passou na validação", 422, validation.errors);
    }

    writeCV(cvAtualizado);
    logger.info("CV atualizado com sucesso", { alteracoes: result.alteracoes.length });

    res.json({
      ok: true,
      alteracoes: result.alteracoes || [],
      avisos: result.avisos || [],
      cv: cvAtualizado,
    });
  })
);

export default router;
