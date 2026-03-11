import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
export const CV_PATH = join(__dir, "../data/cv-fonte.json");

/**
 * Read the source CV from file
 * @returns {Object} The complete CV object
 * @throws {Error} If file cannot be read or JSON is invalid
 */
export function readCV() {
  return JSON.parse(readFileSync(CV_PATH, "utf-8"));
}

/**
 * Write the CV to file and update the timestamp
 * @param {Object} cv - The CV object to write
 * @throws {Error} If file cannot be written
 */
export function writeCV(cv) {
  cv._meta.ultima_atualizacao = new Date().toISOString().split("T")[0];
  writeFileSync(CV_PATH, JSON.stringify(cv, null, 2), "utf-8");
}
