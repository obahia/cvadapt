import express from "express";
import cors from "cors";
import config from "./config.js";
import cvRoutes from "./routes/cv.js";
import updaterRoutes from "./routes/updater.js";
import adapterRoutes from "./routes/adapter.js";
import reviewerRoutes from "./routes/reviewer.js";
import latexRoutes from "./routes/latex.js";
import { errorHandler } from "./utils/errors.js";
import Logger from "./utils/logger.js";

const app = express();
const PORT = config.PORT;
const logger = new Logger("Server", config.LOG_LEVEL);

app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json({ limit: "2mb" }));

app.use("/api/cv", cvRoutes);
app.use("/api/updater", updaterRoutes);
app.use("/api/adapter", adapterRoutes);
app.use("/api/reviewer", reviewerRoutes);
app.use("/api/latex", latexRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Endpoint não encontrado",
    path: req.path,
    method: req.method,
  });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`CVAdapt API running at http://localhost:${PORT}`);
});
