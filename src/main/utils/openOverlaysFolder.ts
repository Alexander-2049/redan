import child_process from "child_process";
import { OVERLAYS_PATH } from "../main-constants";

export const openOverlaysFolder = () => {
  /* This implementation works only for windows system */
  const p = child_process.exec(`explorer "${OVERLAYS_PATH}"`);
  p.on("error", () => {
    p.kill();
  });
};
