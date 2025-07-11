import { z } from 'zod';

import { Overlay } from '../overlay';

import { JsonFileService } from '@/main/features/json-files';
import { PathService } from '@/main/features/paths/PathService';
import { layoutFileSchema } from '@/main/shared/schemas/layout-file-schema';
import { GameName } from '@/main/shared/types/GameName';
import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';

export interface LayoutProperties {
  filename: string;
  game: GameName;
  screen: {
    width: number;
    height: number;
  };
}

export class Layout {
  private _game: GameName = 'None'; // Defines which game this layout used for
  private _title: string | null = null;
  private _filename: string | null = null;
  private _overlays: Overlay[] = [];
  private _overlayFolders: Map<Overlay, string> = new Map();
  private _screenWidth = 0;
  private _screenHeight = 0;
  private _isVisible = false;

  constructor(props: LayoutProperties) {
    this._game = props.game;
    this._filename = props.filename;
    this._screenWidth = props.screen.width;
    this._screenHeight = props.screen.height;
  }

  get screen(): { readonly width: number; readonly height: number } {
    return {
      width: this._screenWidth,
      height: this._screenHeight,
    };
  }

  set screen({ width, height }: { width: number; height: number }) {
    this._screenWidth = width;
    this._screenHeight = height;
  }

  public save() {
    return new Promise((resolve, reject) => {
      if (this._game === 'None') return reject('Game name is not specified');
      if (this.screen.width === 0 || this.screen.height === 0)
        return reject('Screen dimentions are not specified');
      if (this._filename === null) return reject('Filename is not specified');
      if (this._title === null) return reject('Title is not specified');

      const data: z.infer<typeof layoutFileSchema> = {
        title: this._title,
        overlays: this._overlays.map(overlay => {
          return this.getOverlayProperties(overlay);
        }),
        screen: {
          height: this.screen.height,
          width: this.screen.width,
        },
      };

      JsonFileService.write(
        JsonFileService.path.join(PathService.getPath('LAYOUTS'), this._filename),
        data,
      );

      return resolve(() => {
        return;
      });
    });
  }

  public setOverlayVisibleById(overlayId: string, visible: boolean) {
    const overlay = this._overlays.find(overlay => overlay.id === overlayId);
    if (!overlay) return false;
    overlay.setVisibile(visible, true);
    return true;
  }

  public addOverlay(overlay: Overlay, folderName: string) {
    this._overlays.push(overlay);
    this._overlayFolders.set(overlay, folderName);
  }

  public removeOverlayById(overlayId: string) {
    const desiredOverlay = this._overlays.find(overlay => overlay.id === overlayId);
    if (!desiredOverlay) return false;

    this._overlayFolders.delete(desiredOverlay);

    this._overlays = this._overlays.filter(overlay => {
      if (overlay === desiredOverlay) {
        desiredOverlay.destroy();
        return false;
      }
      return true;
    });

    return true;
  }

  public show() {
    if (this._isVisible) return;
    this._overlays.forEach(overlay => {
      overlay.show();
    });
  }

  public hide() {
    if (!this._isVisible) return;
    this._overlays.forEach(overlay => {
      overlay.hide();
    });
  }

  public destroy() {
    this._overlays.forEach(overlay => {
      overlay.destroy();
    });
  }

  public get filename(): string | null {
    return this._filename;
  }

  private getOverlayProperties(overlay: Overlay): LayoutOverlay {
    const bounds = overlay.getWindowBounds();

    return {
      baseUrl: overlay.baseUrl,
      id: overlay.id,
      title: overlay.manifest.title,
      ...bounds,
      settings: overlay.settings,
      visible: overlay.visible,
      folderName: this._overlayFolders.get(overlay) || '',
    };
  }
}
