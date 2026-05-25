import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 1. Resolve the base directory where the compiled assets sit
  const distPublicPath = path.resolve(__dirname, "..", "dist", "public");

  // 2. Serve static files explicitly under the /icp-audit sub-path
  app.use("/icp-audit", express.static(distPublicPath));

  // 3. Handle client-side routing fallback - point to the nested subpath index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPublicPath, "icp-audit", "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
