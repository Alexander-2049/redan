import express from "express";
import fs from "fs";
import path from "path";
import { OVERLAYS_PATH } from "../../main-constants";
import OverlayHandler from "./overlayHandler";

const app = express();

app.get("/", (req, res) => {
  return res.json(OverlayHandler.loadAllOverlays());
});

app.get("/*", (req, res) => {
  try {
    // Decode the requested path to handle spaces and other encoded characters
    const decodedPath = decodeURIComponent(req.path);

    // Resolve the requested path safely
    const requestedPath = path.normalize(path.join(OVERLAYS_PATH, decodedPath));

    // Ensure the resolved path is within OVERLAYS_PATH
    if (!requestedPath.startsWith(OVERLAYS_PATH)) {
      return res.status(403).send("Access denied.");
    }

    const filePath = requestedPath;

    // If the path doesn't look like a specific file (no extension), check for index.html
    if (!path.extname(decodedPath)) {
      const indexPath = path.join(filePath, "index.html");
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        const queryParams = new URLSearchParams(
          req.query as Record<string, string>,
        ).toString();
        const redirectUrl =
          path.join(decodedPath, "index.html") +
          (queryParams ? `?${queryParams}` : "");
        return res.redirect(301, redirectUrl);
      } else {
        return res.status(404).send("Not found.");
      }
    }

    // Check if the file exists
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send("Not found.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error.");
  }
});

export default app;
