import express from "express";
import { getOverlayNames } from "./utils/overlaysFolder";

const app = express();

app.get("/", (req, res) => {
  return res.json(getOverlayNames());
});

app.get("/:overlayName", (req, res) => {
  
  return res.send(req.params.overlayName);
});

export default app;
