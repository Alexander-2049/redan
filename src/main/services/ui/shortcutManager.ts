import { globalShortcut } from "electron";
import { getWindows } from "./windowManager";

let windowsHidden = false;
let windowsClickThrough = false;

export const registerShortcuts = () => {
  const windows = getWindows();

  globalShortcut.register("CommandOrControl+Alt+H", () => {
    for (let i = 1; i < windows.length; i++) {
      const win = windows[i];
      if (windowsHidden) {
        win.show();
      } else {
        win.hide();
      }
    }
    windowsHidden = !windowsHidden;
  });

  globalShortcut.register("CommandOrControl+Alt+I", () => {
    for (let i = 1; i < windows.length; i++) {
      const win = windows[i];
      win.setIgnoreMouseEvents(!windowsClickThrough);
    }
    windowsClickThrough = !windowsClickThrough;
  });
};
