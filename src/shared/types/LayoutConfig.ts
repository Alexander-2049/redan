import { OverlayManifestFile } from './OverlayManifestFile';

import { GameName } from '@/main/shared/types/GameName';

export interface LayoutConfig {
  filename: string;
  game: GameName;
  screen: {
    width: number;
    height: number;
  };
  overlays: OverlayManifestFile[];
}
