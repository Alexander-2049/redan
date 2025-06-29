export interface OverlayWindowBounds {
  position: { x: number; y: number };
  size: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
}
