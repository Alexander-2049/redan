import { BrowserWindow } from 'electron';

import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';

export abstract class Overlay {
  constructor(
    public readonly id: string,
    public readonly folderPath: string,
    protected manifest: OverlayManifestFile,
  ) {}

  /** Underlying Electron window (lazy‑created) */
  protected window: BrowserWindow | null = null;

  /** Create window if needed and load HTML */
  abstract load(): Promise<void>;
  /** Show / hide helpers */
  abstract show(): void;
  abstract hide(): void;
  /** Persist per‑overlay settings */
  abstract saveSettings(): Promise<void>;
}
