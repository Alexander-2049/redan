import { globalShortcut } from "electron";
import { getOverlayWindows } from "./windowManager";

let windowsHidden = false;
let windowsClickThrough = false;

export const registerShortcuts = () => {
  const windows = getOverlayWindows();

  globalShortcut.register("CommandOrControl+Alt+H", () => {
    for (let i = 0; i < windows.length; i++) {
      const overlay = windows[i];
      if (windowsHidden) {
        overlay.window.show();
      } else {
        overlay.window.hide();
      }
    }
    windowsHidden = !windowsHidden;
  });

  globalShortcut.register("CommandOrControl+Alt+I", () => {
    for (let i = 0; i < windows.length; i++) {
      const overlay = windows[i];
      overlay.window.setIgnoreMouseEvents(!windowsClickThrough);
    }
    windowsClickThrough = !windowsClickThrough;
  });
};
