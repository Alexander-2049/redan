import child_process from "child_process";
import { OVERLAYS_PATH } from "../main-constants";

export const openOverlaysFolder = (): Promise<void> => {
  /* This implementation works only for windows system */
  const promise = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      p.kill();
      reject(new Error("Operation timed out after 5 seconds"));
    }, 5000);
    const p = child_process.exec(`explorer "${OVERLAYS_PATH}"`);
    p.on("error", () => {
      p.kill();
      clearTimeout(timeout);
      resolve();
    });

    p.on("exit", () => {
      clearTimeout(timeout);
      resolve();
    });

    p.on("close", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
  return promise;
};
