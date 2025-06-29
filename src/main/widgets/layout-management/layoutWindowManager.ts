import { JsonFileService } from '@/main/features/json-files';
import { LoggerService } from '@/main/features/logger/LoggerService';
import { PathService } from '@/main/features/paths/PathService';
import { layoutSettingsFileSchema } from '@/main/shared/schemas/layout-settings-file-schema';
import { LayoutSettings } from '@/main/shared/types/LayoutSetting';

class LayoutWindowManager {
  private _layoutsPath: string;
  private logger = LoggerService.getLogger('layout-window-manager');
  private _activeLayoutFilename: string | null = null;
  private _layoutOrder: string[] = [];
  private _settingsFilePath: string;

  constructor(layoutsPath: string) {
    this._layoutsPath = layoutsPath;
    this._settingsFilePath = JsonFileService.path.join(this._layoutsPath, 'settings.json');
    const settings = this.readSettings();
    if (settings) {
      this._activeLayoutFilename = settings.activeLayoutFilename;
      this._layoutOrder = settings.layoutOrder;
    }
  }

  public readSettings() {
    if (!JsonFileService.exists(this._settingsFilePath)) return null;
    const settingsFileContents = JsonFileService.read(this._settingsFilePath);
    try {
      return layoutSettingsFileSchema.parse(settingsFileContents);
    } catch (e) {
      this.logger.error('Failed to parse layout settings file:', e);
      return null;
    }
  }

  public saveSettings() {
    const data: LayoutSettings = {
      activeLayoutFilename: this._activeLayoutFilename,
      layoutOrder: this._layoutOrder,
    };
    JsonFileService.write(this._settingsFilePath, data);
  }

  public readLayoutFileNames() {
    try {
      return JsonFileService.getFilesInDirectory(this._layoutsPath).filter(
        e => e !== 'settings.json',
      );
    } catch (e) {
      this.logger.error('Failed to read layout file names:', e);
      return [];
    }
  }

  public get layoutsPath(): string {
    return this._layoutsPath;
  }
}

export const layoutWindowManager = new LayoutWindowManager(PathService.getPath('LAYOUTS'));
