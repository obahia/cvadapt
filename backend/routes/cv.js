import { Router } from "express";
import { CVAdaptError, asyncHandler } from "../utils/errors.js";
import Logger from "../utils/logger.js";
import { validateCV } from "../utils/validator.js";
import { readCV, writeCV } from "../utils/cvFile.js";

const router = Router();
const logger = new Logger("CV");

/**
 * GET /api/cv - Retrieve the complete source CV
 * @returns {Object} Complete CV object with all sections
 * @throws {500} Error reading cv-fonte.json
 */
router.get(
  "/",
  asyncHandler((req, res) => {
    logger.debug("GET /api/cv called");
    const cv = readCV();
    logger.info("CV retrieved successfully");
    res.json(cv);
  })
);

/**
 * PUT /api/cv - Replace entire source CV
 * @param {Object} req.body - Complete CV object
 * @returns {Object} Success message
 * @throws {422} CV validation failed
 * @throws {500} Error writing CV
 */
router.put(
  "/",
  asyncHandler((req, res) => {
    logger.debug("PUT /api/cv called");
    const cv = req.body;

    const validation = validateCV(cv);
    if (!validation.valid) {
      logger.warn("CV validation failed", validation.errors);
      throw new CVAdaptError("CV contém dados inválidos", 422, validation.errors);
    }

    writeCV(cv);
    logger.info("CV replaced successfully");
    res.json({ ok: true, message: "CV fonte atualizado com sucesso." });
  })
);

/**
 * PATCH /api/cv/section - Update a specific CV section
 * @param {Object} req.body - { section: string, data: any }
 * @returns {Object} Updated CV
 * @throws {400} Invalid section
 * @throws {500} Error writing CV
 */
router.patch(
  "/section",
  asyncHandler((req, res) => {
    logger.debug("PATCH /api/cv/section called", { section: req.body.section });

    const { section, data } = req.body;
    const cv = readCV();

    if (!(section in cv)) {
      throw new CVAdaptError(`Seção '${section}' não existe no CV`, 400);
    }

    // Registra no histórico antes de alterar
    cv._meta.historico.unshift({
      timestamp: new Date().toISOString(),
      acao: `Seção '${section}' atualizada`,
    });
    if (cv._meta.historico.length > 50) cv._meta.historico.pop();

    cv[section] = data;
    writeCV(cv);
    logger.info("CV section updated", { section });
    res.json({ ok: true, cv });
  })
);

export default router;
