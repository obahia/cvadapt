#!/usr/bin/env node

/**
 * Kill Port Utility
 * Mata o processo que está usando uma porta específica
 */

import { exec } from "child_process";
import { platform } from "os";

const port = process.argv[2] || 3001;

function killPort(portNum) {
  return new Promise((resolve) => {
    // Windows
    if (platform() === "win32") {
      exec(`netstat -ano | findstr :${portNum}`, (error, stdout) => {
        if (error || !stdout) {
          console.log(`✅ Porta ${portNum} está livre`);
          resolve();
          return;
        }

        const lines = stdout.split("\n");
        const pids = [];

        lines.forEach((line) => {
          const parts = line.split(/\s+/);
          if (parts.length > 4) {
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid) && pids.indexOf(pid) === -1) {
              pids.push(pid);
            }
          }
        });

        if (pids.length === 0) {
          console.log(`✅ Porta ${portNum} está livre`);
          resolve();
          return;
        }

        const killCmd = pids.map((pid) => `taskkill /PID ${pid} /F`).join(" && ");

        exec(killCmd, (error) => {
          if (error) {
            console.log(`⚠️  Erro ao matar processo: ${error.message}`);
          } else {
            console.log(`✅ Processo(s) na porta ${portNum} foi/foram encerrado(s)`);
          }
          resolve();
        });
      });
    }
    // Unix/Linux/Mac
    else {
      exec(`lsof -i :${portNum} | tail -n +2 | awk '{print $2}' | xargs kill -9 2>/dev/null`, (error) => {
        if (error && error.code !== 1) {
          console.log(`⚠️  Porta ${portNum} pode estar livre`);
        } else {
          console.log(`✅ Processo(s) na porta ${portNum} foi/foram encerrado(s)`);
        }
        resolve();
      });
    }
  });
}

async function main() {
  console.log(`🔧 Limpando porta ${port}...`);
  await killPort(port);
  console.log("");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Erro:", e.message);
  process.exit(1);
});
