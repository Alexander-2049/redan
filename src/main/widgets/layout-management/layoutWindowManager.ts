import { Layout } from '@/main/entities/layout';
import { LayoutFactory } from '@/main/entities/layout/factory';
import { JsonFileService } from '@/main/features/json-files';
import { LoggerService } from '@/main/features/logger/LoggerService';
import { PathService } from '@/main/features/paths/PathService';
import { layoutFileSchema } from '@/main/shared/schemas/layout-file-schema';
import { layoutSettingsFileSchema } from '@/main/shared/schemas/layout-settings-file-schema';
import { GameName } from '@/main/shared/types/GameName';
import { LayoutSettings } from '@/main/shared/types/LayoutSetting';
import { toValidWindowsFileName } from '@/main/shared/utils/to-valid-windows-file-name';
import { LayoutConfig } from '@/shared/types/LayoutConfig';
import { LayoutFile } from '@/shared/types/LayoutFile';

class LayoutWindowManager {
  private logger = LoggerService.getLogger('layout-window-manager');
  private _layoutsPath: string;
  private _layoutOrder: string[] = [];
  private _layouts: Map<string, Layout> = new Map();
  private _activeLayout: Layout | null = null;
  private _game: GameName = 'None';
  private _isEditMode = false;

  constructor(layoutsPath: string, game?: GameName) {
    this._layoutsPath = layoutsPath;
    this.logger.info(`Initializing LayoutWindowManager at path: ${this._layoutsPath}`);
    this.load(game || 'None');
  }

  public isEditMode() {
    return this._isEditMode;
  }

  public setEditMode(isEditMode: boolean): boolean {
    if (this._isEditMode !== isEditMode) {
      this._activeLayout?.setEditMode(isEditMode);
      this._isEditMode = isEditMode;
    }
    return this._isEditMode;
  }

  public readSettings(game: GameName) {
    const filepath = JsonFileService.path.join(
      this._layoutsPath,
      toValidWindowsFileName(game),
      'settings.json',
    );
    this.logger.debug('Reading layout settings...');
    if (!JsonFileService.exists(filepath)) {
      this.logger.warn('Settings file does not exist.');
      return null;
    }
    const settingsFileContents = JsonFileService.read(JsonFileService.path.join(filepath));
    try {
      const parsed = layoutSettingsFileSchema.parse(settingsFileContents);
      this.logger.info('Successfully parsed layout settings.');
      return parsed;
    } catch (e) {
      this.logger.error('Failed to parse layout settings file:', e);
      return null;
    }
  }

  public updateLayoutsOrder(order: string[], game: GameName) {
    this.logger.info(`Updating layout order for ${game}: ${JSON.stringify(order)}`);

    if (game === this._game) {
      this._layoutOrder = order;
    }

    this.saveSettings(game);
  }

  public getLayoutOrder(game: GameName) {
    if (this._game === game) return this._layoutOrder;

    const settings = this.readSettings(game);
    if (settings) return settings.layoutOrder;

    return [];
  }

  public setActiveLayout(fileName: string | null, game: GameName, show = true) {
    this.logger.info(`Setting active layout to: ${fileName || 'null'}`);
    try {
      this._activeLayout?.hide();
      this._activeLayout?.setEditMode(false);
    } catch (error) {
      if (error instanceof Error) this.logger.error(error.message);
      else this.logger.error('Something went wrong while .hide() active layout');
    }

    if (this._game !== game) {
      this.load(game);
    }

    if (fileName === null) {
      this._activeLayout = null;
      this.logger.debug('Active layout set to null');
      return;
    }

    this._activeLayout = this._layouts.get(fileName) || null;

    if (!this._activeLayout) {
      this.logger.warn(`Layout "${fileName}" not found`);
      return;
    }

    this.saveSettings(game);

    if (show) {
      this.logger.debug(`Showing layout: ${fileName}`);
      this._activeLayout.setEditMode(this.isEditMode());
      this._activeLayout?.show();
    }
  }

  public getActiveLayout(): { config: LayoutConfig; data: LayoutFile } | null {
    const data = this._activeLayout?.getLayoutFile();
    const config = this._activeLayout?.getConfig();
    if (data && config) return { data, config };
    return null;
  }

  public getLayoutFilenames(game: GameName) {
    try {
      this.logger.debug('Reading layout file names from directory');
      const files = JsonFileService.getFilesInDirectory(
        JsonFileService.path.join(this._layoutsPath, toValidWindowsFileName(game)),
      ).filter(e => e !== 'settings.json');
      this.logger.info(`Found layout files: ${JSON.stringify(files)}`);
      return files;
    } catch (e) {
      this.logger.error('Failed to read layout file names:', e);
      return [];
    }
  }

  public createLayout(filename: string, layoutData: LayoutFile & { game: GameName }) {
    this.logger.info(`Creating new layout: ${filename}`);
    const layout = LayoutFactory.createAndSaveNewLayout(filename, layoutData, layoutData.game);
    if (layout && layout.filename) {
      this._layouts.set(layout.filename, layout);
      this.logger.debug(`Layout created and stored: ${layout.filename}`);
      this.updateLayoutsOrder(this._layoutOrder, layoutData.game);
      return true;
    }
    this.logger.warn(`Failed to create layout: ${filename}`);
    return false;
  }

  public deleteLayout(filename: string, game: GameName) {
    this.logger.info(`Deleting layout: ${filename}`);
    this._layoutOrder = this.layoutOrder.filter(f => f !== filename);
    if (this._game === game) {
      const layout = this._layouts.get(filename);
      if (layout) layout.destroy();
      const deleted = this._layouts.delete(filename);
      if (deleted) {
        this.logger.debug(`Layout deleted: ${filename}`);
      } else {
        this.logger.warn(`Layout to delete not found: ${filename}`);
      }

      if (this._activeLayout?.filename === filename) {
        this.logger.debug(`Deleted layout was active. Resetting active layout.`);
        this.setActiveLayout(null, game);
      }
    }

    const filePath = JsonFileService.path.join(
      PathService.getPath('LAYOUTS'),
      toValidWindowsFileName(game),
      filename,
    );
    return JsonFileService.delete(filePath);
  }

  public get layoutsPath(): string {
    return this._layoutsPath;
  }

  public get layoutOrder(): ReadonlyArray<string> {
    return this._layoutOrder;
  }

  public load(game: GameName) {
    this.logger.info('Loading layouts from disk');
    this._activeLayout?.hide();
    this._activeLayout = null;
    this._layouts.clear();
    this._layoutOrder = [];
    this._game = game;

    const filenames = this.getLayoutFilenames(game);
    for (const filename of filenames) {
      const layout = LayoutFactory.createFromFile(filename, game);
      if (!layout) {
        this.logger.warn(`Failed to load layout: ${filename}`);
        continue;
      }
      const added = this.addLayout(layout);
      if (added) {
        this.logger.debug(`Loaded layout: ${filename}`);
      }
    }

    const settings = this.readSettings(game);
    if (settings) {
      this.logger.info('Applying saved layout settings...');
      this.setActiveLayout(settings.activeLayoutFilename || null, game);
      this._layoutOrder = settings.layoutOrder;
    }
  }

  public destroy() {
    this._layouts.forEach(layout => layout.destroy());
  }

  public get filenames() {
    return Array.from(this._layouts.keys());
  }

  public getLayouts(game: GameName): (LayoutFile & { filename: string })[] {
    this.logger.info('Retrieving all layouts...');
    const layouts = [];

    for (let i = 0; i < this.filenames.length; i++) {
      const filename = this.filenames[i];
      this.logger.debug(`Reading layout file: ${filename}`);
      try {
        const file = JsonFileService.read(
          JsonFileService.path.join(this._layoutsPath, toValidWindowsFileName(game), filename),
        );
        const data = layoutFileSchema.parse(file);
        layouts.push({ ...data, filename });
        this.logger.debug(`Successfully parsed layout file: ${filename}`);
      } catch (error) {
        this.logger.error(`Failed to read or parse layout file: ${filename}`, error);
      }
    }

    this.logger.info(`Total layouts retrieved: ${layouts.length}`);
    return layouts;
  }

  public updateLayout(filename: string, data: LayoutFile, game: GameName): Promise<void> {
    const layout =
      this._game === game
        ? this._layouts.get(filename)
        : LayoutFactory.createFromFile(filename, game);
    if (layout)
      return new Promise((res, rej) => {
        layout
          .update(data)
          .then(() => {
            res();
          })
          .catch(e => {
            rej(e);
          });
      });
    return new Promise((res, rej) => {
      rej('Could not update layout. Layout not found.');
    });
  }

  private addLayout(layout: Layout) {
    if (!layout.filename) {
      this.logger.warn('Attempted to add layout with no filename');
      return false;
    }
    if (this._layouts.has(layout.filename)) {
      this.logger.warn(`Layout "${layout.filename}" already exists. Skipping.`);
      return false;
    }
    this._layouts.set(layout.filename, layout);
    return true;
  }

  private saveSettings(game: GameName) {
    const filepath = JsonFileService.path.join(
      this._layoutsPath,
      toValidWindowsFileName(game),
      'settings.json',
    );
    const data: LayoutSettings = {
      activeLayoutFilename: this._activeLayout?.filename || null,
      layoutOrder: this._layoutOrder,
    };
    this.logger.debug(`Saving settings: ${JSON.stringify(data)}`);
    JsonFileService.write(filepath, data);
  }
}

export const layoutWindowManager = new LayoutWindowManager(PathService.getPath('LAYOUTS'));
