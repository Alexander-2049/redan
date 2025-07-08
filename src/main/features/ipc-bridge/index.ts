import { registerFsHandlers } from './fs-handler';
import { registerLayoutHandlers } from './layout-handler';
import { registerOverlayHandlers } from './overlay-handler';
import { registerSteamHandlers } from './steam-handler';
import { registerWindowActionsHandlers } from './window-actions-handler';

export const registerIpcMessageHandlers = () => {
  registerWindowActionsHandlers();
  registerSteamHandlers();
  registerLayoutHandlers();
  registerOverlayHandlers();
  registerFsHandlers();
};
