import { ipcMain } from 'electron';

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

  ipcMain.handle(IPC_CHANNELS.LAYOUTS.CREATE_LAYOUT, (event, props: CreateLayoutProps): boolean => {
    logger.info('Creating new layout...');
    const isLayoutCreated = layoutWindowManager.createLayout(props.filename, {
      game: props.game,
      title: props.title,
      overlays: [],
      screen: {
        height: 0,
        width: 0,
      },
    });
    return isLayoutCreated;
  });
}
