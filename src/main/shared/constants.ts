interface IProcessEnv {
  NODE_ENV?: string;
}

export const HTTP_SERVER_PORT = 42049;
export const STEAM_APP_ID = 3825980;

// import { findWorkshopContentPath } from "./utils/steam-client";

export const IS_DEV = (process.env as IProcessEnv).NODE_ENV === 'development';
export const IS_DEBUG = process.argv.includes('--debug');
// export const STEAM_WORKSHOP_CONTENT_PATH =
//   findWorkshopContentPath(STEAM_APP_ID);
