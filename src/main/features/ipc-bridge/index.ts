import { registerSteamHandlers } from './steam-handler';
import { registerWindowActionsHandlers } from './window-actions-handler';

export const registerIpcMessageHandlers = () => {
  registerWindowActionsHandlers();
  registerSteamHandlers();
};
