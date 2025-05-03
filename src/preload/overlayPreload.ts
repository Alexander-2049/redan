const icons = {
  grab: `<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-hand-grab"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v-3.5a1.5 1.5 0 0 1 3 0v2.5" /><path d="M11 9.5v-3a1.5 1.5 0 0 1 3 0v3.5" /><path d="M14 7.5a1.5 1.5 0 0 1 3 0v2.5" /><path d="M17 9.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47" /></svg>`,
  drag: `
      <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 1024 1024">
        <path d="M909.3 506.3L781.7 405.6a7.23 7.23 0 0 0-11.7 5.7V476H548V254h64.8c6 0 9.4-7 5.7-11.7L517.7 114.7a7.14 7.14 0 0 0-11.3 0L405.6 242.3a7.23 7.23 0 0 0 5.7 11.7H476v222H254v-64.8c0-6-7-9.4-11.7-5.7L114.7 506.3a7.14 7.14 0 0 0 0 11.3l127.5 100.8c4.7 3.7 11.7.4 11.7-5.7V548h222v222h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V548h222v64.8c0 6 7 9.4 11.7 5.7l127.5-100.8a7.3 7.3 0 0 0 .1-11.4z"/>
      </svg>
    `,
};

class OverlayDraggable {
  private backgroundDiv: HTMLDivElement;
  private draggableDiv: HTMLDivElement;

  constructor() {
    this.backgroundDiv = this.createBackgroundDiv();
    this.draggableDiv = this.createDraggableDiv();

    this.setupEventListeners();
    this.appendElements();
  }

  private createBackgroundDiv(): HTMLDivElement {
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.top = "0";
    div.style.left = "0";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.zIndex = "9999";
    div.style.opacity = "0";
    return div;
  }

  private createDraggableDiv(): HTMLDivElement {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.width = "40px";
    div.style.height = "40px";
    div.style.pointerEvents = "auto";
    div.style.backgroundColor = "rgba(255,255,255,1)";
    div.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(icons.drag)}')`;
    div.style.backgroundRepeat = "no-repeat";
    div.style.backgroundPosition = "center";
    div.style.backgroundSize = "50%";
    div.style.borderRadius = "4px";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (div.style as any)["-webkit-app-region"] = "drag";
    return div;
  }

  private setupEventListeners(): void {
    this.backgroundDiv.addEventListener(
      "mouseenter",
      this.handleMouseEnter.bind(this),
    );
    this.backgroundDiv.addEventListener(
      "mouseleave",
      this.handleMouseLeave.bind(this),
    );
    window.addEventListener("blur", () => {
      this.backgroundDiv.style.opacity = "0";
    });
  }

  private handleMouseEnter(): void {
    this.backgroundDiv.style.opacity = "1";
    this.draggableDiv.style.backgroundColor = "rgba(255,255,255,1)";
    this.draggableDiv.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(icons.drag)}')`;
  }

  private handleMouseLeave(event: MouseEvent): void {
    const rect = this.backgroundDiv.getBoundingClientRect();
    const isOnEdge =
      event.clientX <= rect.left + 10 ||
      event.clientX >= rect.right - 10 ||
      event.clientY <= rect.top + 10 ||
      event.clientY >= rect.bottom - 10;

    if (isOnEdge) {
      this.backgroundDiv.style.opacity = "0";
    } else {
      this.backgroundDiv.style.opacity = "1";
      this.draggableDiv.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(icons.grab)}')`;
    }
  }

  private appendElements(): void {
    this.backgroundDiv.appendChild(this.draggableDiv);
    document.body.appendChild(this.backgroundDiv);
  }
}

// Initialize the draggable overlay when the DOM is loaded
window.addEventListener("DOMContentLoaded", () => {
  new OverlayDraggable();
});
