/**
 * Simple logging utility with levels
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  gray: "\x1b[90m",
};

class Logger {
  constructor(namespace = "CVAdapt", level = "INFO") {
    this.namespace = namespace;
    this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
  }

  log(level, message, data = null) {
    if (LOG_LEVELS[level] > this.level) return;

    const timestamp = new Date().toISOString();
    const prefix = `${COLORS.gray}[${timestamp}]${COLORS.reset} ${COLORS.blue}[${this.namespace}]${COLORS.reset}`;
    let levelColor = COLORS.reset;

    if (level === "ERROR") levelColor = COLORS.red;
    if (level === "WARN") levelColor = COLORS.yellow;
    if (level === "INFO") levelColor = COLORS.green;
    if (level === "DEBUG") levelColor = COLORS.blue;

    const levelStr = `${levelColor}[${level}]${COLORS.reset}`;

    if (data) {
      console.log(`${prefix} ${levelStr} ${message}`, data);
    } else {
      console.log(`${prefix} ${levelStr} ${message}`);
    }
  }

  error(message, data) {
    this.log("ERROR", message, data);
  }

  warn(message, data) {
    this.log("WARN", message, data);
  }

  info(message, data) {
    this.log("INFO", message, data);
  }

  debug(message, data) {
    this.log("DEBUG", message, data);
  }
}

export default Logger;
