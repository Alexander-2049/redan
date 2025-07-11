export const IPC_CHANNELS = {
  ACTIONS: {
    MINIMIZE: 'actions:minimize',
    RESTORE: 'actions:restore',
    CLOSE: 'actions:close',
  },
  STEAM: {
    IS_ONLINE: 'steam:isOnline',
  },
  WORKSHOP: {
    GET_ALL_ITEMS: 'workshop:getAllItems',
    SUBSCRIBE: 'workshop:subscribe',
    UNSUBSCRIBE: 'workshop:unsubscribe',
    GET_SUBSCRIBED_ITEMS: 'workshop:getSubscribedItems',
    DOWNLOAD_ITEM: 'workshop:downloadItem',
    DOWNLOAD_INFO: 'workshop:downloadInfo',
    GET_INSTALL_INFO: 'workshop:getInstallInfo',
    OPEN_IN_STEAM_CLIENT: 'workshop:openInSteamClient',
    CREATE: 'workshop:create',
    UPDATE_ITEM: 'workshop:updateItem',
    GET_MY_ITEMS: 'workshop:getMyItems',
    OPEN_IN_STEAM_CLIENT_UPLOADED_FILES: 'workshop:openInSteamClientUploadedFiles',
  },
  LAYOUTS: {
    GET_LAYOUTS: 'layouts:getLayouts',
    CREATE_LAYOUT: 'layouts:createLayout',
  },
  OVERLAY: {
    OPEN: 'overlay:open',
    CLOSE: 'overlay:close',
    UPDATE_EDIT_MODE: 'overlay:updateEditMode',
    UPDATE_SETTINGS: 'overlay:updateSettings',
  },
  FS: {
    READ: 'fs:read',
  },
} as const;
