import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dir, ".env") });

// Determinar provedor de IA
const AI_PROVIDER = process.env.AI_PROVIDER || "claude"; // Padrão: claude
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || null;
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || null;

// Validar se chave do provedor selecionado existe
// Note: console.error is used here intentionally during startup before Logger is available
if (AI_PROVIDER === "claude") {
  if (!CLAUDE_API_KEY) {
    console.error(
      "❌ CLAUDE_API_KEY não configurada!\n" +
      "   1. Obtenha uma chave grátis em: https://console.anthropic.com\n" +
      "   2. Adicione em backend/.env: CLAUDE_API_KEY=sk-ant-seu-codigo\n" +
      "   3. Reinicie o servidor"
    );
    process.exit(1);
  }
} else if (AI_PROVIDER === "gemini") {
  if (!GEMINI_API_KEY) {
    console.error(
      "❌ GEMINI_API_KEY não configurada!\n" +
      "   1. Obtenha uma chave em: https://ai.google.dev/\n" +
      "   2. Adicione em backend/.env: GEMINI_API_KEY=sua-chave\n" +
      "   3. Reinicie o servidor"
    );
    process.exit(1);
  }
} else {
  console.error(
    `❌ AI_PROVIDER inválido: ${AI_PROVIDER}\n` +
    "   Use: AI_PROVIDER=claude ou AI_PROVIDER=gemini"
  );
  process.exit(1);
}

export const config = {
  AI_PROVIDER,
  GEMINI_API_KEY,
  CLAUDE_API_KEY,
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "INFO",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

export default config;
