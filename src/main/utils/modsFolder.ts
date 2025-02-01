import { MODS_PATH } from "../constants";
import fs from "fs";

export const createModsFolder = () => {
  if (!fs.existsSync(MODS_PATH)) {
    fs.mkdirSync(MODS_PATH, { recursive: true });
    return true;
  } else {
    return false;
  }
};

export const getModFolderNames = () => {
  return fs.readdirSync(MODS_PATH);
};
