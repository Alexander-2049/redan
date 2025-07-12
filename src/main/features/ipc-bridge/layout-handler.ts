import { ipcMain, screen } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { GameName } from '@/main/shared/types/GameName';
import { layoutWindowManager } from '@/main/widgets/layout-management';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import { CreateLayoutProps } from '@/shared/types/CreateLayoutProps';
import { LayoutFile } from '@/shared/types/LayoutFile';

const logger = LoggerService.getLogger('ipc-layout-handlers');

export function registerLayoutHandlers() {
  ipcMain.handle(
    IPC_CHANNELS.LAYOUTS.GET_LAYOUTS,
    (event, game: GameName): (LayoutFile & { filename: string })[] => {
      logger.info('Fetching layouts...');
      const layouts = layoutWindowManager.getLayouts(game);
      logger.info(`Fetched ${layouts.length} layouts.`);
      return layouts;
    },
  );

  ipcMain.handle(IPC_CHANNELS.LAYOUTS.DELETE_LAYOUT, (event, filename: string, game: GameName) => {
    logger.info('Deleting layout...');
    return layoutWindowManager.deleteLayout(filename, game);
  });

  ipcMain.handle(IPC_CHANNELS.LAYOUTS.CREATE_LAYOUT, (event, props: CreateLayoutProps): boolean => {
    logger.info('Creating new layout...');
    const { width, height } = screen.getPrimaryDisplay().size;

    const isLayoutCreated = layoutWindowManager.createLayout(props.filename, {
      game: props.game,
      title: props.title,
      overlays: [],
      screen: {
        height,
        width,
      },
    });
    return isLayoutCreated;
  });

  ipcMain.handle(
    IPC_CHANNELS.LAYOUTS.UPDATE_LAYOUT,
    (event, filename: string, data: LayoutFile, game: GameName) => {
      logger.info('Updating layout...');
      return layoutWindowManager.updateLayout(filename, data, game);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.LAYOUTS.REORDER_LAYOUTS,
    (event, filenames: string[], game: GameName) => {
      logger.info('Reordering layouts...');
      return layoutWindowManager.updateLayoutsOrder(filenames, game);
    },
  );

  ipcMain.handle(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS_ORDER, (event, game: GameName) => {
    logger.info('Fetching layouts order...');
    return layoutWindowManager.getLayoutOrder(game);
  });
}
