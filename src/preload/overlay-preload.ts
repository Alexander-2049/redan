import { ipcRenderer } from 'electron';

class OverlayDraggable {
  private draggableDiv: HTMLDivElement;
  private overlayContainer: HTMLDivElement;

  constructor() {
    this.draggableDiv = this.createDraggableDiv();
    this.overlayContainer = this.createOverlayContainer();
    this.appendElements();
  }

  private createDraggableDiv(): HTMLDivElement {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.top = '0%';
    div.style.left = '0%';
    div.style.right = '0%';
    div.style.bottom = '0%';
    div.style.backgroundColor = 'rgba(0,0,0,0)';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (div.style as any)['-webkit-app-region'] = 'drag';
    return div;
  }

  private createOverlayContainer(): HTMLDivElement {
    // Add keyframes if not already present
    if (!document.getElementById('animations-style')) {
      const style = document.createElement('style');
      style.id = 'animations-style';
      style.innerHTML = `
      @keyframes pulse-border {
        0%, 100% { border: 2px solid rgba(14, 165, 233, 0.6); }
        50% { border: 2px solid rgba(14, 165, 233, 1); }
      }
      @keyframes pulse-background {
        0%, 100% { background: rgba(14, 165, 233, 0.6); }
        50% { background: rgba(14, 165, 233, 1); }
      }
      `;
      document.head.appendChild(style);
    }

    const container = document.createElement('div');
    container.id = 'overlay-border-container';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.display = 'none';

    const borderDiv = document.createElement('div');
    borderDiv.style.position = 'absolute';
    borderDiv.style.zIndex = '20';
    borderDiv.style.width = '100%';
    borderDiv.style.height = '100%';
    borderDiv.style.border = '2px solid #0ea5e9';
    borderDiv.style.boxSizing = 'border-box';
    borderDiv.style.cursor = 'move';
    borderDiv.style.pointerEvents = 'auto';
    borderDiv.style.animation = 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';

    const labelDiv = document.createElement('div');
    labelDiv.style.display = 'flex';
    labelDiv.style.alignItems = 'center';
    labelDiv.style.gap = '8px';
    labelDiv.style.position = 'absolute';
    labelDiv.style.top = '0';
    labelDiv.style.right = '0';
    labelDiv.style.padding = '4px 8px';
    labelDiv.style.background = '#0ea5e9';
    labelDiv.style.color = '#fff';
    labelDiv.style.cursor = 'move';
    labelDiv.style.fontFamily = 'sans-serif';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.borderBottomLeftRadius = '6px';
    labelDiv.style.pointerEvents = 'auto';
    labelDiv.style.animation = 'pulse-background 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('viewBox', '0 0 256 256');
    svg.setAttribute('fill', '#000');
    svg.style.display = 'inline-block';
    svg.style.verticalAlign = 'middle';
    svg.innerHTML = `<rect width="256" height="256" fill="#FFF" rx="40" ry="40"/><path d="M136,112H48a8,8,0,0,0-8,8v88a8,8,0,0,0,8,8h88a8,8,0,0,0,8-8V120A8,8,0,0,0,136,112Zm-8,88H56V128h72Zm88-16v16a16,16,0,0,1-16,16H176a8,8,0,0,1,0-16h24V184a8,8,0,0,1,16,0Zm0-72v32a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm0-56V72a8,8,0,0,1-16,0V56H184a8,8,0,0,1,0-16h16A16,16,0,0,1,216,56Zm-64-8a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,48ZM40,80V56A16,16,0,0,1,56,40H72a8,8,0,0,1,0,16H56V80a8,8,0,0,1-16,0Z"/>`;

    const span = document.createElement('span');
    span.textContent = 'Edit Mode';

    labelDiv.appendChild(svg);
    labelDiv.appendChild(span);
    borderDiv.appendChild(labelDiv);
    container.appendChild(borderDiv);

    return container;
  }

  private appendElements(): void {
    document.body.appendChild(this.draggableDiv);
    this.draggableDiv.appendChild(this.overlayContainer);
  }

  public setEditableMode(enabled: boolean): void {
    this.overlayContainer.style.display = enabled ? 'block' : 'none';
  }
}

// Initialize the draggable overlay and overlay borders when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  const div = new OverlayDraggable();

  // Get the edit-mode channel from additional arguments
  const editModeChannel =
    process.argv.find(arg => arg.startsWith('--edit-mode-channel='))?.split('=')[1] ?? 'edit-mode';

  void (async () => {
    const isEditableMode = (await ipcRenderer.invoke(editModeChannel)) as boolean;
    div.setEditableMode(isEditableMode);
  })();

  ipcRenderer.on('edit-mode', (_, enabled: boolean) => {
    div.setEditableMode(enabled);
  });
});
