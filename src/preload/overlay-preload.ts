import { /* contextBridge, */ ipcRenderer } from "electron";

class OverlayDraggable {
  private draggableDiv: HTMLDivElement;

  constructor() {
    this.draggableDiv = this.createDraggableDiv();
    this.appendElements();
  }

  private createDraggableDiv(): HTMLDivElement {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "0%";
    div.style.left = "0%";
    div.style.right = "0%";
    div.style.bottom = "0%";
    div.style.backgroundColor = "rgba(0,0,0,0)";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (div.style as any)["-webkit-app-region"] = "drag";
    return div;
  }

  private appendElements(): void {
    document.body.appendChild(this.draggableDiv);
  }

  public showBorders(): void {
    this.draggableDiv.style.border = "2px solid #00ff00";
  }

  public hideBorders(): void {
    this.draggableDiv.style.border = "none";
  }
}

// Initialize the draggable overlay when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  const div = new OverlayDraggable();

  // ✅ IPC listeners
  ipcRenderer.on("show-borders", () => {
    div.showBorders();
  });

  ipcRenderer.on("hide-borders", () => {
    div.hideBorders();
  });
});
