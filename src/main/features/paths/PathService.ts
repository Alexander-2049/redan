import path from 'path';

import { app } from 'electron';

export class PathService {
  private static paths = {
    OVERLAYS: path.join(app.getPath('userData'), 'Overlays'),
    LAYOUTS: path.join(app.getPath('userData'), 'Layouts'),
    REPLAYS: path.join(app.getPath('userData'), 'Replays'),
    CACHE: path.join(app.getPath('userData'), 'Cache'),
    LOGS: path.join(app.getPath('userData'), 'Logs'),
  };

  public static getPath(directory: keyof typeof this.paths): string {
    return this.paths[directory];
  }
}
