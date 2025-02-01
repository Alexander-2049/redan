// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
// import { contextBridge, ipcRenderer } from "electron";

// TODO: Create an element that will hover overlay with window drag
window.addEventListener("DOMContentLoaded", () => {
  const dragDiv = document.createElement("div");
  dragDiv.style.position = "fixed";
  dragDiv.style.top = "0";
  dragDiv.style.left = "0";
  dragDiv.style.width = "100%";
  dragDiv.style.height = "100%";
  // dragDiv.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
  dragDiv.style.zIndex = "9999";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dragDiv.style as any)["-webkit-app-region"] = "drag";
  document.body.appendChild(dragDiv);
});
