import { z } from 'zod';

import { Overlay } from '../overlay';
import { OverlayFactory } from '../overlay/factory';

import { JsonFileService } from '@/main/features/json-files';
import { LoggerService } from '@/main/features/logger/LoggerService';
import { PathService } from '@/main/features/paths/PathService';
import { layoutFileSchema } from '@/main/shared/schemas/layout-file-schema';
import { GameName } from '@/main/shared/types/GameName';
import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';
import { toValidWindowsFileName } from '@/main/shared/utils/to-valid-windows-file-name';
import { LayoutConfig } from '@/shared/types/LayoutConfig';
import { LayoutFile } from '@/shared/types/LayoutFile';
import { LayoutProperties } from '@/shared/types/LayoutProperties';

const logger = LoggerService.getLogger('class-layout');

export class Layout {
  private _game: GameName = 'None'; // Defines which game this layout used for
  private _title: string | null = null;
  private _filename: string | null = null;
  private _overlays: Overlay[] = [];
  private _overlayFolders: Map<Overlay, string> = new Map();
  private _screenWidth = 0;
  private _screenHeight = 0;
  private _isEditMode = false;

  constructor(props: LayoutProperties) {
    this._game = props.game;
    this._filename = props.filename;
    this._screenWidth = props.screen.width;
    this._screenHeight = props.screen.height;
    this._title = props.title || null;
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

  public isEditMode() {
    return this._isEditMode;
  }

  public setEditMode(isEditMode: boolean) {
    this._overlays.forEach(overlay => {
      if (overlay.isEditMode() !== isEditMode) {
        overlay.updateEditMode(isEditMode);
      }
    });
    this._isEditMode = isEditMode;
  }

  public save() {
    logger.info('layout.save()');
    return new Promise((resolve, reject) => {
      if (this._game === 'None') return reject('Game name is not specified');
      if (this.screen.width === 0 || this.screen.height === 0)
        return reject('Screen dimentions are not specified');
      if (this._filename === null) return reject('Filename is not specified');
      if (this._title === null) return reject('Title is not specified');

      const data: z.infer<typeof layoutFileSchema> = {
        title: this._title,
        overlays: this._overlays.map(overlay => {
          const properties = this.getOverlayProperties(overlay);
          logger.debug(`Overlay [${overlay.id}] properties to save: ${JSON.stringify(properties)}`);
          return properties;
        }),
        screen: {
          height: this.screen.height,
          width: this.screen.width,
        },
      };

      JsonFileService.write(
        JsonFileService.path.join(
          PathService.getPath('LAYOUTS'),
          toValidWindowsFileName(this._game),
          this._filename,
        ),
        data,
      );

      return resolve(() => {
        return;
      });
    });
  }

  public update(data: LayoutFile) {
    this._title = data.title;
    const overlays = [...this._overlays];
    this._screenWidth = data.screen.width;
    this._screenHeight = data.screen.height;

    logger.debug(`Data has been received for an update: ${JSON.stringify(data)}`);
    logger.debug(`${data.overlays.length} overlays have been received`);

    // Update settings for existing/open overlays
    // Close overlays that were removed from layout file
    for (let i = 0; i < overlays.length; i++) {
      const overlay = overlays[i];
      const settings = data.overlays.find(e => e.id === overlay.id)?.settings;
      if (settings) {
        overlay.updateSettings(settings);
      } else {
        this.removeOverlayById(overlay.id);
      }
    }

    // Open overlays that are in layout file, but are not open yet
    for (let i = 0; i < data.overlays.length; i++) {
      const overlayConfig = data.overlays[i];
      const overlay = this._overlays.find(e => e.id === overlayConfig.id);
      if (!overlay) {
        const newOverlay = OverlayFactory.createFromFolder(
          overlayConfig.id,
          overlayConfig.baseUrl,
          JsonFileService.path.join(PathService.getPath('OVERLAYS'), overlayConfig.folderName),
          {
            ...overlayConfig.size,
            ...overlayConfig.position,
          },
          overlayConfig.visible,
        );
        if (newOverlay) {
          this.addOverlay(newOverlay, overlayConfig.folderName);
        } else {
          logger.error(`${overlayConfig.folderName} overlay folder was not found`);
        }
      }
    }

    return this.save();
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
    this._overlays.forEach(overlay => {
      overlay.show();
    });
  }

  public hide() {
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

  public get title() {
    return this._title || 'unknown';
  }

  public getConfig(): LayoutConfig {
    return {
      filename: this._filename || 'unknown',
      game: this._game,
      screen: {
        width: this._screenWidth,
        height: this._screenHeight,
      },
      overlays: this._overlays.map(e => e.manifest),
    };
  }

  public getLayoutFile(): LayoutFile | null {
    if (!this.filename) return null;

    const filePath = JsonFileService.path.join(
      PathService.getPath('LAYOUTS'),
      toValidWindowsFileName(this._game),
      this.filename,
    );

    let parsed: LayoutFile;
    try {
      const rawData = JsonFileService.read(filePath);
      parsed = layoutFileSchema.parse(rawData);
      logger.debug(`getLayoutFile(): Successfully parsed layout file: ${this.filename}`);
      return parsed;
    } catch (err) {
      logger.error(`Failed to parse layout file "${this.filename}":`, err);
      return null;
    }
  }

  private getOverlayProperties(overlay: Overlay): LayoutOverlay {
    const bounds = overlay.getWindowBounds();

    return {
      baseUrl: overlay.baseUrl,
      id: overlay.id,
      title: overlay.manifest.title,
      position: {
        ...bounds,
      },
      size: {
        ...bounds,
      },
      settings: overlay.settings,
      visible: overlay.visible,
      folderName: this._overlayFolders.get(overlay) || '',
    };
  }
}
