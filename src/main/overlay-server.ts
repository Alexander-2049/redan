import express from "express";
import { getOverlaysData } from "./utils/overlaysFolder";
import fs from "fs";
import path from "path";
import { OVERLAYS_PATH } from "./main-constants";

const app = express();

app.get("/", (req, res) => {
  return res.json(getOverlaysData());
});

app.get("/*", (req, res) => {
  try {
    // Resolve the requested path safely
    const requestedPath = path.normalize(path.join(OVERLAYS_PATH, req.path));

    // Ensure the resolved path is within OVERLAYS_PATH
    if (!requestedPath.startsWith(OVERLAYS_PATH)) {
      return res.status(403).send("Access denied.");
    }

    const filePath = requestedPath;

    // If the path doesn't look like a specific file (no extension), check for index.html
    if (!path.extname(req.path)) {
      const indexPath = path.join(filePath, "index.html");
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return res.redirect(301, path.join(req.path, "index.html"));
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
