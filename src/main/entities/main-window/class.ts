import { BrowserWindow } from 'electron';

import { LoggerService } from '@/main/features/logger/LoggerService';
// import { layoutWindowManager } from '@/main/widgets/layout-management';

const logger = LoggerService.getLogger('main-window');

export class MainWindow {
  private _entry: string;
  private _preload: string;
  private window: BrowserWindow;

  constructor(preload: string, entry: string) {
    this._entry = entry;
    this._preload = preload;
    logger.info('Initializing main window...');
    this.window = new BrowserWindow({
      width: 1280,
      height: 880,
      minWidth: 800,
      minHeight: 680,
      webPreferences: {
        preload,
        nodeIntegration: true,
        devTools: process.env.NODE_ENV === 'development',
      },
      frame: false,
      titleBarStyle: 'hidden',
      // icon: iconPath,
    });

    // registerHandlers(mainWindow);

    // mainWindow.setMenuBarVisibility(false);
    this.window.webContents.setAudioMuted(true);

    // this.window.on('close', () => {
    //   logger.info('Main window is closing, cleaning up overlay windows');
    //   this.window.removeAllListeners('close');
    //   layoutWindowManager.destroy();
    // });

    // LayoutHandler.addListener('modified', data => {
    //   mainWindow.webContents.send('layout-modified', data);
    // });
  }

  public load() {
    try {
      this.window
        .loadURL(this.entry)
        .then(() => logger.info('Main window loaded successfully'))
        .catch(error => logger.error('Failed to load main window:', error));
    } catch (e) {
      logger.error('Exception while loading window:', e);
    }
  }

  public show() {
    this.window.show();
  }

  public get entry() {
    return this._entry;
  }
  public get preload(): string {
    return this._preload;
  }
}
