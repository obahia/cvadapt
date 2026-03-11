import Anthropic from "@anthropic-ai/sdk";
import config from "../config.js";
import { CVAdaptError } from "../utils/errors.js";

let client = null;

if (config.AI_PROVIDER === "claude") {
  client = new Anthropic({ apiKey: config.CLAUDE_API_KEY });
}

/**
 * Call AI API (Claude or Gemini) with text response
 * @param {string} system - System prompt
 * @param {Array<{role: string, content: string}>} messages - Message history
 * @param {number} maxTokens - Maximum response tokens
 * @returns {string} AI response text
 * @throws {CVAdaptError} API errors with appropriate status codes
 */
export async function callClaude(system, messages, maxTokens) {
  maxTokens = maxTokens || 4096;

  if (config.AI_PROVIDER === "claude") {
    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: maxTokens,
        system: system,
        messages: messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      });

      return response.content[0].type === "text" ? response.content[0].text : "";
    } catch (error) {
      if (error.message && error.message.includes("rate_limit")) {
        throw new CVAdaptError(
          "Limite de requisições da API Claude excedido. Por favor, tente novamente em alguns momentos.",
          429
        );
      }
      if (error.message && error.message.includes("overloaded_error")) {
        throw new CVAdaptError(
          "Servidor Claude sobrecarregado. Por favor, tente novamente.",
          503
        );
      }
      if (error.status === 401) {
        throw new CVAdaptError(
          "Chave Claude API inválida. Verifique suas credenciais.",
          401
        );
      }
      throw error;
    }
  } else if (config.AI_PROVIDER === "gemini") {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

    // Usar gemini-2.5-flash que é o modelo mais recente
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: {
        parts: [{ text: system }],
      },
      generationConfig: { maxOutputTokens: maxTokens },
    });

    const history = messages.slice(0, -1).map(function (m) {
      return {
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      };
    });

    const chat = model.startChat({ history: history });
    const last = messages[messages.length - 1];

    try {
      const result = await chat.sendMessage(last.content);
      return result.response.text();
    } catch (error) {
      if (error.message && error.message.includes("429")) {
        throw new CVAdaptError(
          "Limite de requisições da API Gemini excedido. Por favor, tente novamente em alguns momentos.",
          429
        );
      }
      if (error.message && error.message.includes("404")) {
        throw new CVAdaptError(
          "Modelo Gemini não disponível. Por favor, entre em contato com o administrador.",
          503
        );
      }
      if (error.message && error.message.includes("GoogleGenerativeAI")) {
        throw new CVAdaptError(
          "Erro ao comunicar com a API Gemini. Por favor, tente novamente.",
          503
        );
      }
      throw error;
    }
  }
}

/**
 * Call AI API with JSON response
 * Handles invalid JSON and attempts recovery
 * @param {string} system - System prompt
 * @param {Array<{role: string, content: string}>} messages - Message history
 * @param {number} maxTokens - Maximum response tokens
 * @returns {Object} Parsed JSON response
 * @throws {CVAdaptError} If JSON parsing fails after retry
 */
export async function callClaudeJSON(system, messages, maxTokens) {
  maxTokens = maxTokens || 4096;
  const systemJSON =
    system +
    "\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no backticks, no explanations.";
  const raw = await callClaude(systemJSON, messages, maxTokens);
  try {
    const clean = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(clean);
  } catch (e) {
    try {
      const fixed = await callClaude(
        "Fix the invalid JSON below and return ONLY valid JSON, nothing else.",
        [
          {
            role: "user",
            content: "Invalid JSON:\n" + raw + "\n\nReturn corrected JSON only.",
          },
        ],
        maxTokens
      );
      return JSON.parse(fixed.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (retryError) {
      throw new CVAdaptError(
        "Erro ao processar resposta da API. JSON inválido retornado.",
        502
      );
    }
  }
}
